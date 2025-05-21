import { supabase } from '@/integrations/supabase/client';
import { env } from '@/config/env';

// Define types for skill proficiency
export interface SkillProficiency {
  skill: string;
  level: number; // 1-5 scale
  years_experience: number;
  certifications?: string[];
}

// Define types for personality traits
export interface PersonalityTraits {
  communication_preference: string; // direct, supportive, analytical, collaborative
  feedback_style: string; // gentle, honest, detailed, actionable
  work_pace: string; // fast, methodical, balanced
  problem_solving: string; // creative, analytical, practical, collaborative
  conflict_resolution: string; // accommodating, compromising, collaborative, competitive, avoiding
}

// Extend MentorProfile to include detailed skill proficiencies and personality traits
export interface DetailedMentorProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  expertise: string[];
  skill_proficiencies: SkillProficiency[];
  personality_traits: PersonalityTraits;
  years_experience: number;
  hourly_rate: number;
  communication_style: string;
  mentorship_style: string;
  availability: any[];
  rating: number;
  reviews_count: number;
  profile_image: string;
}

// Define types for mentee preferences with detailed skill needs
export interface DetailedMatchingPreferences {
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
    skill_priorities: {
      skill: string;
      importance: number; // 1-5 scale
      current_level: number; // 1-5 scale
      target_level: number; // 1-5 scale
    }[];
    goals: string;
  };
  personality_preferences: {
    communication_preference: string;
    feedback_style: string;
    work_pace: string;
    problem_solving: string;
    conflict_resolution: string;
  };
}

class SkillMatchingService {
  /**
   * Calculate detailed skill match score between mentor and mentee
   */
  calculateSkillMatchScore(
    mentorSkills: SkillProficiency[],
    menteeSkillNeeds: DetailedMatchingPreferences['career_preferences']['skill_priorities']
  ): { score: number; matchDetails: any[] } {
    if (!mentorSkills || !menteeSkillNeeds || mentorSkills.length === 0 || menteeSkillNeeds.length === 0) {
      return { score: 0, matchDetails: [] };
    }
    
    let totalScore = 0;
    const matchDetails = [];
    const totalPossibleScore = menteeSkillNeeds.reduce((sum, skill) => sum + skill.importance, 0);
    
    // For each skill the mentee wants to improve
    for (const menteeSkill of menteeSkillNeeds) {
      // Find matching mentor skill
      const matchingMentorSkill = mentorSkills.find(
        ms => ms.skill.toLowerCase() === menteeSkill.skill.toLowerCase()
      );
      
      if (matchingMentorSkill) {
        // Calculate how well the mentor can help with this skill
        // Consider: mentor's proficiency level, years of experience, and mentee's target level
        
        // Base score: how much above mentee's current level is the mentor
        const levelDifference = matchingMentorSkill.level - menteeSkill.current_level;
        
        // Skill match score factors:
        // 1. Mentor should be at least at mentee's target level
        // 2. More years of experience is better
        // 3. Having certifications is a bonus
        
        let skillMatchScore = 0;
        
        // Factor 1: Mentor's level vs mentee's target
        if (matchingMentorSkill.level >= menteeSkill.target_level) {
          skillMatchScore += 3; // Full points if mentor meets or exceeds target
        } else if (levelDifference > 0) {
          skillMatchScore += 1; // Partial points if mentor is better than mentee but below target
        }
        
        // Factor 2: Years of experience (max 2 points)
        skillMatchScore += Math.min(2, matchingMentorSkill.years_experience / 2);
        
        // Factor 3: Certifications bonus
        if (matchingMentorSkill.certifications && matchingMentorSkill.certifications.length > 0) {
          skillMatchScore += 1;
        }
        
        // Scale by importance of this skill to the mentee
        const weightedScore = (skillMatchScore / 6) * menteeSkill.importance;
        totalScore += weightedScore;
        
        matchDetails.push({
          skill: menteeSkill.skill,
          mentorLevel: matchingMentorSkill.level,
          menteeTargetLevel: menteeSkill.target_level,
          menteeCurrentLevel: menteeSkill.current_level,
          mentorExperience: matchingMentorSkill.years_experience,
          hasCertifications: matchingMentorSkill.certifications && matchingMentorSkill.certifications.length > 0,
          importance: menteeSkill.importance,
          score: weightedScore
        });
      }
    }
    
    // Normalize score to 0-100 range
    const normalizedScore = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;
    
    return {
      score: Math.min(100, Math.round(normalizedScore)),
      matchDetails
    };
  }
  
  /**
   * Find skill gaps that the mentor can help fill
   */
  identifySkillGaps(
    mentorSkills: SkillProficiency[],
    menteeSkillNeeds: DetailedMatchingPreferences['career_preferences']['skill_priorities']
  ): any[] {
    const gaps = [];
    
    for (const menteeSkill of menteeSkillNeeds) {
      const matchingMentorSkill = mentorSkills.find(
        ms => ms.skill.toLowerCase() === menteeSkill.skill.toLowerCase()
      );
      
      if (matchingMentorSkill) {
        const currentGap = menteeSkill.target_level - menteeSkill.current_level;
        const mentorCanFill = Math.max(0, matchingMentorSkill.level - menteeSkill.current_level);
        const gapFillPercentage = currentGap > 0 ? (mentorCanFill / currentGap) * 100 : 0;
        
        gaps.push({
          skill: menteeSkill.skill,
          currentGap,
          mentorCanFill,
          gapFillPercentage: Math.min(100, Math.round(gapFillPercentage)),
          priority: menteeSkill.importance
        });
      }
    }
    
    // Sort by priority and gap fill percentage
    return gaps.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return b.gapFillPercentage - a.gapFillPercentage; // Better gap fill percentage first
    });
  }
  
  /**
   * Generate skill development recommendations
   */
  generateSkillDevelopmentPlan(
    mentorSkills: SkillProficiency[],
    menteeSkillNeeds: DetailedMatchingPreferences['career_preferences']['skill_priorities']
  ): any {
    const skillGaps = this.identifySkillGaps(mentorSkills, menteeSkillNeeds);
    
    // Focus on top 3 priority skills that mentor can help with
    const topSkills = skillGaps.slice(0, 3);
    
    const developmentPlan = {
      focusAreas: topSkills.map(gap => ({
        skill: gap.skill,
        currentLevel: menteeSkillNeeds.find(s => s.skill === gap.skill)?.current_level || 0,
        targetLevel: menteeSkillNeeds.find(s => s.skill === gap.skill)?.target_level || 0,
        mentorLevel: mentorSkills.find(s => s.skill.toLowerCase() === gap.skill.toLowerCase())?.level || 0,
        estimatedSessions: this.estimateSessionsNeeded(gap.currentGap)
      })),
      estimatedTimeframe: this.estimateTimeframe(topSkills),
      recommendedResources: this.recommendResources(topSkills.map(g => g.skill))
    };
    
    return developmentPlan;
  }
  
  /**
   * Estimate number of sessions needed to close a skill gap
   */
  private estimateSessionsNeeded(gap: number): number {
    // Simple estimation: 2-3 sessions per level of improvement needed
    return Math.max(1, Math.ceil(gap * 2.5));
  }
  
  /**
   * Estimate timeframe for skill development
   */
  private estimateTimeframe(skillGaps: any[]): string {
    const totalSessions = skillGaps.reduce((sum, gap) => {
      return sum + this.estimateSessionsNeeded(gap.currentGap);
    }, 0);
    
    // Assuming 1 session per week
    const weeks = Math.ceil(totalSessions / 1);
    
    if (weeks <= 4) {
      return `${weeks} weeks`;
    } else if (weeks <= 12) {
      const months = Math.ceil(weeks / 4);
      return `${months} months`;
    } else {
      return "3+ months";
    }
  }
  
  /**
   * Recommend resources for skill development
   */
  private recommendResources(skills: string[]): any[] {
    // This would ideally connect to a resource database
    // For now, return placeholder recommendations
    const resources = [];
    
    for (const skill of skills) {
      resources.push({
        skill,
        books: [`"Mastering ${skill}" by Expert Author`],
        courses: [`Advanced ${skill} on Coursera`],
        practice: [`Weekly ${skill} exercises with mentor`]
      });
    }
    
    return resources;
  }
}

class PersonalityCompatibilityService {
  /**
   * Calculate personality compatibility score between mentor and mentee
   */
  calculateCompatibilityScore(
    mentorTraits: PersonalityTraits,
    menteePreferences: DetailedMatchingPreferences['personality_preferences']
  ): { score: number; compatibilityDetails: any } {
    if (!mentorTraits || !menteePreferences) {
      return { score: 0, compatibilityDetails: {} };
    }
    
    const compatibilityDetails = {
      communication: this.calculateCommunicationCompatibility(
        mentorTraits.communication_preference,
        menteePreferences.communication_preference
      ),
      feedback: this.calculateFeedbackCompatibility(
        mentorTraits.feedback_style,
        menteePreferences.feedback_style
      ),
      workPace: this.calculateWorkPaceCompatibility(
        mentorTraits.work_pace,
        menteePreferences.work_pace
      ),
      problemSolving: this.calculateProblemSolvingCompatibility(
        mentorTraits.problem_solving,
        menteePreferences.problem_solving
      ),
      conflictResolution: this.calculateConflictResolutionCompatibility(
        mentorTraits.conflict_resolution,
        menteePreferences.conflict_resolution
      )
    };
    
    // Calculate overall score (equal weighting for all factors)
    const overallScore = (
      compatibilityDetails.communication.score +
      compatibilityDetails.feedback.score +
      compatibilityDetails.workPace.score +
      compatibilityDetails.problemSolving.score +
      compatibilityDetails.conflictResolution.score
    ) / 5;
    
    return {
      score: Math.round(overallScore),
      compatibilityDetails
    };
  }
  
  /**
   * Calculate communication style compatibility
   */
  private calculateCommunicationCompatibility(
    mentorStyle: string,
    menteePreference: string
  ): { score: number; description: string } {
    // Define compatibility matrix for communication styles
    const compatibilityMatrix: {[key: string]: {[key: string]: number}} = {
      'direct': {
        'direct': 100,
        'supportive': 60,
        'analytical': 80,
        'collaborative': 70
      },
      'supportive': {
        'direct': 60,
        'supportive': 100,
        'analytical': 70,
        'collaborative': 90
      },
      'analytical': {
        'direct': 80,
        'supportive': 70,
        'analytical': 100,
        'collaborative': 75
      },
      'collaborative': {
        'direct': 70,
        'supportive': 90,
        'analytical': 75,
        'collaborative': 100
      }
    };
    
    const score = compatibilityMatrix[mentorStyle]?.[menteePreference] || 50;
    
    let description = '';
    if (score >= 90) {
      description = `Perfect match in communication style`;
    } else if (score >= 75) {
      description = `Strong compatibility in communication approach`;
    } else if (score >= 60) {
      description = `Good communication compatibility with some differences`;
    } else {
      description = `Different communication styles that may require adjustment`;
    }
    
    return { score, description };
  }
  
  /**
   * Calculate feedback style compatibility
   */
  private calculateFeedbackCompatibility(
    mentorStyle: string,
    menteePreference: string
  ): { score: number; description: string } {
    // Define compatibility matrix for feedback styles
    const compatibilityMatrix: {[key: string]: {[key: string]: number}} = {
      'gentle': {
        'gentle': 100,
        'honest': 65,
        'detailed': 80,
        'actionable': 75
      },
      'honest': {
        'gentle': 65,
        'honest': 100,
        'detailed': 85,
        'actionable': 90
      },
      'detailed': {
        'gentle': 80,
        'honest': 85,
        'detailed': 100,
        'actionable': 90
      },
      'actionable': {
        'gentle': 75,
        'honest': 90,
        'detailed': 90,
        'actionable': 100
      }
    };
    
    const score = compatibilityMatrix[mentorStyle]?.[menteePreference] || 50;
    
    let description = '';
    if (score >= 90) {
      description = `Perfectly aligned feedback preferences`;
    } else if (score >= 75) {
      description = `Compatible feedback styles`;
    } else if (score >= 60) {
      description = `Workable feedback dynamic with some adjustment needed`;
    } else {
      description = `Different feedback preferences that may require discussion`;
    }
    
    return { score, description };
  }
  
  /**
   * Calculate work pace compatibility
   */
  private calculateWorkPaceCompatibility(
    mentorPace: string,
    menteePace: string
  ): { score: number; description: string } {
    // Define compatibility matrix for work paces
    const compatibilityMatrix: {[key: string]: {[key: string]: number}} = {
      'fast': {
        'fast': 100,
        'methodical': 60,
        'balanced': 85
      },
      'methodical': {
        'fast': 60,
        'methodical': 100,
        'balanced': 85
      },
      'balanced': {
        'fast': 85,
        'methodical': 85,
        'balanced': 100
      }
    };
    
    const score = compatibilityMatrix[mentorPace]?.[menteePace] || 50;
    
    let description = '';
    if (score >= 90) {
      description = `Perfectly matched work pace`;
    } else if (score >= 75) {
      description = `Compatible working speeds`;
    } else if (score >= 60) {
      description = `Different but manageable work pace preferences`;
    } else {
      description = `Significantly different work paces that may require adjustment`;
    }
    
    return { score, description };
  }
  
  /**
   * Calculate problem solving compatibility
   */
  private calculateProblemSolvingCompatibility(
    mentorStyle: string,
    menteePreference: string
  ): { score: number; description: string } {
    // Define compatibility matrix for problem solving styles
    const compatibilityMatrix: {[key: string]: {[key: string]: number}} = {
      'creative': {
        'creative': 100,
        'analytical': 70,
        'practical': 80,
        'collaborative': 90
      },
      'analytical': {
        'creative': 70,
        'analytical': 100,
        'practical': 85,
        'collaborative': 75
      },
      'practical': {
        'creative': 80,
        'analytical': 85,
        'practical': 100,
        'collaborative': 80
      },
      'collaborative': {
        'creative': 90,
        'analytical': 75,
        'practical': 80,
        'collaborative': 100
      }
    };
    
    const score = compatibilityMatrix[mentorStyle]?.[menteePreference] || 50;
    
    let description = '';
    if (score >= 90) {
      description = `Highly compatible problem-solving approaches`;
    } else if (score >= 75) {
      description = `Complementary problem-solving styles`;
    } else if (score >= 60) {
      description = `Different but potentially valuable problem-solving perspectives`;
    } else {
      description = `Contrasting problem-solving approaches that may provide diverse perspectives`;
    }
    
    return { score, description };
  }
  
  /**
   * Calculate conflict resolution compatibility
   */
  private calculateConflictResolutionCompatibility(
    mentorStyle: string,
    menteePreference: string
  ): { score: number; description: string } {
    // Define compatibility matrix for conflict resolution styles
    const compatibilityMatrix: {[key: string]: {[key: string]: number}} = {
      'accommodating': {
        'accommodating': 90,
        'compromising': 85,
        'collaborative': 80,
        'competitive': 60,
        'avoiding': 70
      },
      'compromising': {
        'accommodating': 85,
        'compromising': 100,
        'collaborative': 90,
        'competitive': 70,
        'avoiding': 65
      },
      'collaborative': {
        'accommodating': 80,
        'compromising': 90,
        'collaborative': 100,
        'competitive': 65,
        'avoiding': 60
      },
      'competitive': {
        'accommodating': 60,
        'compromising': 70,
        'collaborative': 65,
        'competitive': 85,
        'avoiding': 50
      },
      'avoiding': {
        'accommodating': 70,
        'compromising': 65,
        'collaborative': 60,
        'competitive': 50,
        'avoiding': 90
      }
    };
    
    const score = compatibilityMatrix[mentorStyle]?.[menteePreference] || 50;
    
    let description = '';
    if (score >= 90) {
      description = `Highly compatible conflict resolution approaches`;
    } else if (score >= 75) {
      description = `Good alignment in handling disagreements`;
    } else if (score >= 60) {
      description = `Workable differences in conflict resolution styles`;
    } else {
      description = `Different approaches to conflict that may require discussion`;
    }
    
    return { score, description };
  }
  
  /**
   * Generate compatibility insights
   */
  generateCompatibilityInsights(
    mentorTraits: PersonalityTraits,
    menteePreferences: DetailedMatchingPreferences['personality_preferences']
  ): any {
    const { compatibilityDetails } = this.calculateCompatibilityScore(mentorTraits, menteePreferences);
    
    // Identify strengths (high compatibility areas)
    const strengths = Object.entries(compatibilityDetails)
      .filter(([_, details]) => (details as any).score >= 80)
      .map(([area, details]) => ({
        area: this.formatAreaName(area),
        description: (details as any).description
      }));
    
    // Identify potential challenges (lower compatibility areas)
    const challenges = Object.entries(compatibilityDetails)
      .filter(([_, details]) => (details as any).score < 70)
      .map(([area, details]) => ({
        area: this.formatAreaName(area),
        description: (details as any).description
      }));
    
    // Generate overall compatibility summary
    const overallScore = Object.values(compatibilityDetails).reduce(
      (sum, detail) => sum + (detail as any).score, 0
    ) / Object.values(compatibilityDetails).length;
    
    let overallDescription = '';
    if (overallScore >= 85) {
      overallDescription = "Exceptional personality compatibility that should lead to a productive mentorship relationship";
    } else if (overallScore >= 75) {
      overallDescription = "Strong overall compatibility with some complementary differences";
    } else if (overallScore >= 65) {
      overallDescription = "Good compatibility with areas that may benefit from open discussion";
    } else {
      overallDescription = "Some compatibility challenges that may require adaptation from both parties";
    }
    
    return {
      overallScore: Math.round(overallScore),
      overallDescription,
      strengths,
      challenges,
      details: compatibilityDetails
    };
  }
  
  /**
   * Format area name for display
   */
  private formatAreaName(area: string): string {
    switch (area) {
      case 'communication':
        return 'Communication Style';
      case 'feedback':
        return 'Feedback Approach';
      case 'workPace':
        return 'Work Pace';
      case 'problemSolving':
        return 'Problem Solving';
      case 'conflictResolution':
        return 'Conflict Resolution';
      default:
        return area.charAt(0).toUpperCase() + area.slice(1);
    }
  }
}

// Create singleton instances
export const skillMatchingService = new SkillMatchingService();
export const personalityCompatibilityService = new PersonalityCompatibilityService();
