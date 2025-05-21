import { supabase } from '@/integrations/supabase/client';
import { useErrorContext } from '@/contexts/ErrorContext';
import { OpenAI } from 'openai';
import { env } from '@/config/env';

// Define types for mentor matching
export interface MentorProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  expertise: string[];
  years_experience: number;
  hourly_rate: number;
  communication_style: string;
  mentorship_style: string;
  availability: any[];
  rating: number;
  reviews_count: number;
  profile_image: string;
  match_score?: number;
  match_reasons?: string[];
}

export interface MatchingPreferences {
  communication_preferences: {
    style: string;
    feedback: string;
    meeting_frequency: string;
    response_time: string;
  };
  mentorship_preferences: {
    approach: string;
    guidance_level: number;
    learning_style: string;
    goal_orientation: string;
  };
  career_preferences: {
    stage: string;
    industry_interests: string[];
    skills_to_improve: string[];
    goals: string;
  };
}

class MatchingService {
  private openai: OpenAI | null = null;
  
  constructor() {
    try {
      if (env.openai.apiKey) {
        this.openai = new OpenAI({
          apiKey: env.openai.apiKey
        });
      } else {
        console.warn('OpenAI API key not found. AI-powered matching will be limited.');
      }
    } catch (error) {
      console.error('Error initializing OpenAI:', error);
    }
  }

  /**
   * Fetch all available mentors from the database
   */
  async fetchMentors(): Promise<MentorProfile[]> {
    try {
      const { data, error } = await supabase
        .from('mentor_profiles')
        .select(`
          id,
          name,
          job_title,
          industry,
          bio,
          years_experience,
          hourly_rate,
          profile_image
        `);

      if (error) throw error;
      
      // Transform the data to match the MentorProfile interface
      const transformedMentors: MentorProfile[] = (data || []).map(mentor => ({
        id: mentor.id || '',
        name: mentor.name || '',
        title: mentor.job_title || '',
        company: mentor.industry || '',
        bio: mentor.bio || '',
        expertise: [], // We'll need to add this data or fetch from another table
        years_experience: mentor.years_experience || 0,
        hourly_rate: mentor.hourly_rate || 0,
        communication_style: 'direct', // Default value
        mentorship_style: 'coaching', // Default value
        availability: [], // We'll need to fetch this separately
        rating: 0, // Default value
        reviews_count: 0, // Default value
        profile_image: mentor.profile_image || ''
      }));
      
      return transformedMentors;
    } catch (error) {
      console.error('Error fetching mentors:', error);
      throw error;
    }
  }

  /**
   * Fetch a user's matching preferences
   */
  async fetchUserPreferences(userId: string): Promise<MatchingPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('mentee_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No preferences found
          return null;
        }
        throw error;
      }
      
      // The data structure already matches our MatchingPreferences interface
      return data as unknown as MatchingPreferences;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  /**
   * Generate AI-powered mentor recommendations based on user preferences
   */
  async generateAIRecommendations(
    mentors: MentorProfile[],
    preferences: MatchingPreferences
  ): Promise<MentorProfile[]> {
    try {
      if (!this.openai) {
        // Fallback to rule-based matching if OpenAI is not available
        return this.generateRuleBasedRecommendations(mentors, preferences);
      }

      // Prepare the prompt for OpenAI
      const prompt = this.buildOpenAIPrompt(mentors, preferences);
      
      // Call OpenAI API - updated to use the newer SDK
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert career mentor matching algorithm. Your task is to match mentees with the most compatible mentors based on communication style, mentorship approach, and skill alignment."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      });

      // Parse the response
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const mentorRankings = JSON.parse(content);
      
      // Apply the rankings to the mentor list
      const rankedMentors = mentors.map(mentor => {
        const ranking = mentorRankings.find((r: any) => r.mentor_id === mentor.id);
        if (ranking) {
          return {
            ...mentor,
            match_score: ranking.match_score,
            match_reasons: ranking.match_reasons
          };
        }
        return mentor;
      });
      
      // Sort by match score (highest first)
      return rankedMentors.sort((a, b) => 
        (b.match_score || 0) - (a.match_score || 0)
      );
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      // Fallback to rule-based matching
      return this.generateRuleBasedRecommendations(mentors, preferences);
    }
  }

  /**
   * Build the prompt for OpenAI
   */
  private buildOpenAIPrompt(
    mentors: MentorProfile[],
    preferences: MatchingPreferences
  ): string {
    // Convert mentors to a simplified format for the prompt
    const mentorData = mentors.map(mentor => ({
      mentor_id: mentor.id,
      name: mentor.name,
      expertise: mentor.expertise,
      communication_style: mentor.communication_style,
      mentorship_style: mentor.mentorship_style,
      years_experience: mentor.years_experience
    }));

    return `
I need to match a mentee with the most compatible mentors based on the following criteria:

MENTEE PREFERENCES:
${JSON.stringify(preferences, null, 2)}

AVAILABLE MENTORS:
${JSON.stringify(mentorData, null, 2)}

Please analyze the compatibility between the mentee's preferences and each mentor's profile. 
Focus on these three key areas with equal weighting:
1. Communication style compatibility
2. Mentorship style alignment
3. Skills and expertise match

For each mentor, provide:
1. A match score from 0-100
2. 2-3 specific reasons why they would be a good match

Return your response as a JSON array in this format:
[
  {
    "mentor_id": "mentor-id-1",
    "match_score": 85,
    "match_reasons": ["Strong communication style match", "Expertise in requested skills", "Similar mentorship approach"]
  },
  ...
]

Only include mentors with a match score of 50 or higher, sorted by match score in descending order.
`;
  }

  /**
   * Fallback method for rule-based recommendations when AI is not available
   */
  private generateRuleBasedRecommendations(
    mentors: MentorProfile[],
    preferences: MatchingPreferences
  ): MentorProfile[] {
    return mentors.map(mentor => {
      let score = 0;
      const reasons: string[] = [];
      
      // Communication style matching (33% weight)
      if (mentor.communication_style === preferences.communication_preferences.style) {
        score += 33;
        reasons.push(`Matching communication style: ${mentor.communication_style}`);
      } else {
        // Partial match based on communication style compatibility
        const partialScore = this.calculatePartialCommunicationMatch(
          mentor.communication_style,
          preferences.communication_preferences.style
        );
        score += partialScore;
        if (partialScore > 15) {
          reasons.push(`Compatible communication styles`);
        }
      }
      
      // Mentorship style matching (33% weight)
      if (mentor.mentorship_style === preferences.mentorship_preferences.approach) {
        score += 33;
        reasons.push(`Matching mentorship approach: ${mentor.mentorship_style}`);
      } else {
        // Partial match based on mentorship style compatibility
        const partialScore = this.calculatePartialMentorshipMatch(
          mentor.mentorship_style,
          preferences.mentorship_preferences.approach
        );
        score += partialScore;
        if (partialScore > 15) {
          reasons.push(`Compatible mentorship approaches`);
        }
      }
      
      // Skills and expertise matching (33% weight)
      const skillMatchScore = this.calculateSkillMatch(
        mentor.expertise,
        preferences.career_preferences.skills_to_improve,
        preferences.career_preferences.industry_interests
      );
      score += skillMatchScore;
      
      if (skillMatchScore > 25) {
        reasons.push(`Strong expertise in your areas of interest`);
      } else if (skillMatchScore > 15) {
        reasons.push(`Has experience in some of your areas of interest`);
      }
      
      // Add years of experience as a bonus factor
      if (mentor.years_experience >= 10) {
        score += 5;
        reasons.push(`${mentor.years_experience}+ years of industry experience`);
      }
      
      return {
        ...mentor,
        match_score: Math.min(100, Math.round(score)), // Cap at 100
        match_reasons: reasons.slice(0, 3) // Limit to top 3 reasons
      };
    }).sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  }

  /**
   * Calculate partial match score for communication styles
   */
  private calculatePartialCommunicationMatch(mentorStyle: string, menteePreference: string): number {
    // Define compatibility matrix for communication styles
    const compatibilityMatrix: {[key: string]: {[key: string]: number}} = {
      'direct': {
        'supportive': 15,
        'analytical': 25,
        'collaborative': 20
      },
      'supportive': {
        'direct': 15,
        'analytical': 20,
        'collaborative': 25
      },
      'analytical': {
        'direct': 25,
        'supportive': 20,
        'collaborative': 15
      },
      'collaborative': {
        'direct': 20,
        'supportive': 25,
        'analytical': 15
      }
    };
    
    return compatibilityMatrix[mentorStyle]?.[menteePreference] || 10;
  }

  /**
   * Calculate partial match score for mentorship styles
   */
  private calculatePartialMentorshipMatch(mentorStyle: string, menteePreference: string): number {
    // Define compatibility matrix for mentorship styles
    const compatibilityMatrix: {[key: string]: {[key: string]: number}} = {
      'coaching': {
        'advisory': 20,
        'sponsorship': 15,
        'roleModel': 25
      },
      'advisory': {
        'coaching': 20,
        'sponsorship': 25,
        'roleModel': 15
      },
      'sponsorship': {
        'coaching': 15,
        'advisory': 25,
        'roleModel': 20
      },
      'roleModel': {
        'coaching': 25,
        'advisory': 15,
        'sponsorship': 20
      }
    };
    
    return compatibilityMatrix[mentorStyle]?.[menteePreference] || 10;
  }

  /**
   * Calculate skill match score
   */
  private calculateSkillMatch(
    mentorExpertise: string[],
    skillsToImprove: string[],
    industryInterests: string[]
  ): number {
    if (!mentorExpertise || !skillsToImprove || !industryInterests) {
      return 0;
    }
    
    let score = 0;
    
    // Check for direct skill matches
    const skillMatches = skillsToImprove.filter(skill => 
      mentorExpertise.some(exp => exp.toLowerCase().includes(skill.toLowerCase()))
    );
    
    // Check for industry matches
    const industryMatches = industryInterests.filter(industry => 
      mentorExpertise.some(exp => exp.toLowerCase().includes(industry.toLowerCase()))
    );
    
    // Calculate score based on percentage of matches
    const skillMatchPercentage = skillMatches.length / skillsToImprove.length;
    const industryMatchPercentage = industryMatches.length / industryInterests.length;
    
    // Weight skill matches slightly higher than industry matches
    score = (Number(skillMatchPercentage) * 20) + (Number(industryMatchPercentage) * 13);
    
    return Math.min(33, score); // Cap at 33 (33% of total weight)
  }

  /**
   * Save mentor matches to the database
   */
  async saveMentorMatches(userId: string, matches: MentorProfile[]): Promise<void> {
    try {
      // Prepare the data for insertion
      const matchData = matches.slice(0, 10).map((mentor, index) => ({
        user_id: userId,
        mentor_id: mentor.id,
        match_score: mentor.match_score || 0,
        match_reasons: mentor.match_reasons || [],
        rank: index + 1,
        created_at: new Date().toISOString()
      }));
      
      // First, delete any existing matches for this user
      const { error: deleteError } = await supabase
        .from('mentor_matches')
        .delete()
        .eq('user_id', userId);
        
      if (deleteError) throw deleteError;
      
      // Then, insert the new matches
      const { error: insertError } = await supabase
        .from('mentor_matches')
        .insert(matchData);
        
      if (insertError) throw insertError;
    } catch (error) {
      console.error('Error saving mentor matches:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const matchingService = new MatchingService();

export default matchingService;
