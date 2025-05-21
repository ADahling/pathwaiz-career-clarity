import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useErrorContext } from '@/contexts/ErrorContext';
import { useToast } from '@/components/ui/use-toast';
import matchingService, { MentorProfile } from '@/services/MatchingService';
import { skillMatchingService, personalityCompatibilityService } from '@/services/AdvancedMatchingService';
import './PersonalityCompatibilityView.css';

interface PersonalityCompatibilityViewProps {
  mentorId: string;
}

export const PersonalityCompatibilityView: React.FC<PersonalityCompatibilityViewProps> = ({ mentorId }) => {
  const { user } = useAuth();
  const { handleError } = useErrorContext();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [compatibilityData, setCompatibilityData] = useState<any>(null);
  const [skillMatchData, setSkillMatchData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('personality');
  
  useEffect(() => {
    if (user && mentorId) {
      fetchCompatibilityData();
    }
  }, [user, mentorId]);
  
  const fetchCompatibilityData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Fetch mentor details
      const mentors = await matchingService.fetchMentors();
      const mentorData = mentors.find(m => m.id === mentorId);
      
      if (!mentorData) {
        throw new Error("Mentor not found");
      }
      
      setMentor(mentorData);
      
      // Fetch user preferences
      const userPreferences = await matchingService.fetchUserPreferences(user.id);
      
      if (!userPreferences) {
        toast({
          title: "Preferences Not Found",
          description: "Please complete the matching questionnaire to see compatibility details.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // For demo purposes, we'll create mock detailed data
      // In a real implementation, this would come from the database
      const mockMentorTraits = {
        communication_preference: mentorData.communication_style || 'direct',
        feedback_style: 'honest',
        work_pace: 'balanced',
        problem_solving: 'analytical',
        conflict_resolution: 'collaborative'
      };
      
      const mockMenteePreferences = {
        communication_preference: userPreferences.communication_preferences.style,
        feedback_style: userPreferences.communication_preferences.feedback,
        work_pace: 'balanced',
        problem_solving: 'creative',
        conflict_resolution: 'compromising'
      };
      
      // Generate compatibility insights
      const compatibilityInsights = personalityCompatibilityService.generateCompatibilityInsights(
        mockMentorTraits,
        mockMenteePreferences
      );
      
      setCompatibilityData(compatibilityInsights);
      
      // Generate skill match data
      const mockMentorSkills = [
        {
          skill: 'leadership',
          level: 5,
          years_experience: 8,
          certifications: ['Leadership Excellence Certification']
        },
        {
          skill: 'communication',
          level: 4,
          years_experience: 10,
          certifications: []
        },
        {
          skill: 'technical',
          level: 3,
          years_experience: 5,
          certifications: ['Technical Proficiency Certificate']
        }
      ];
      
      const mockMenteeSkillNeeds = [
        {
          skill: 'leadership',
          importance: 5,
          current_level: 2,
          target_level: 4
        },
        {
          skill: 'communication',
          importance: 4,
          current_level: 3,
          target_level: 5
        },
        {
          skill: 'networking',
          importance: 3,
          current_level: 1,
          target_level: 3
        }
      ];
      
      const skillMatchScore = skillMatchingService.calculateSkillMatchScore(
        mockMentorSkills,
        mockMenteeSkillNeeds
      );
      
      const skillGaps = skillMatchingService.identifySkillGaps(
        mockMentorSkills,
        mockMenteeSkillNeeds
      );
      
      const developmentPlan = skillMatchingService.generateSkillDevelopmentPlan(
        mockMentorSkills,
        mockMenteeSkillNeeds
      );
      
      setSkillMatchData({
        score: skillMatchScore,
        gaps: skillGaps,
        developmentPlan
      });
    } catch (error) {
      handleError(error, "Failed to load compatibility data");
    } finally {
      setLoading(false);
    }
  };
  
  const renderPersonalityCompatibility = () => {
    if (!compatibilityData) return null;
    
    return (
      <div className="personality-compatibility">
        <div className="compatibility-score-container">
          <div className="compatibility-score">
            <div className="score-circle">
              <span className="score-value">{compatibilityData.overallScore}%</span>
            </div>
            <span className="score-label">Personality Match</span>
          </div>
          
          <p className="compatibility-description">
            {compatibilityData.overallDescription}
          </p>
        </div>
        
        <div className="compatibility-details">
          <div className="compatibility-section">
            <h3 className="section-title">Compatibility Strengths</h3>
            {compatibilityData.strengths.length > 0 ? (
              <ul className="strength-list">
                {compatibilityData.strengths.map((strength: any, index: number) => (
                  <li key={index} className="strength-item">
                    <span className="strength-area">{strength.area}:</span> {strength.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-message">No significant strengths identified.</p>
            )}
          </div>
          
          <div className="compatibility-section">
            <h3 className="section-title">Areas for Attention</h3>
            {compatibilityData.challenges.length > 0 ? (
              <ul className="challenge-list">
                {compatibilityData.challenges.map((challenge: any, index: number) => (
                  <li key={index} className="challenge-item">
                    <span className="challenge-area">{challenge.area}:</span> {challenge.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-message">No significant challenges identified.</p>
            )}
          </div>
        </div>
        
        <div className="compatibility-factors">
          <h3 className="section-title">Compatibility Factors</h3>
          
          <div className="factors-grid">
            {Object.entries(compatibilityData.details).map(([key, value]: [string, any]) => (
              <div key={key} className="factor-card">
                <div className="factor-header">
                  <h4 className="factor-title">{personalityCompatibilityService.formatAreaName(key)}</h4>
                  <span className="factor-score">{value.score}%</span>
                </div>
                <Progress value={value.score} className="factor-progress" />
                <p className="factor-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderSkillsCompatibility = () => {
    if (!skillMatchData) return null;
    
    return (
      <div className="skills-compatibility">
        <div className="compatibility-score-container">
          <div className="compatibility-score">
            <div className="score-circle">
              <span className="score-value">{skillMatchData.score.score}%</span>
            </div>
            <span className="score-label">Skills Match</span>
          </div>
          
          <p className="compatibility-description">
            This mentor's expertise aligns with {skillMatchData.score.score}% of your skill development needs.
          </p>
        </div>
        
        <div className="skill-gaps-section">
          <h3 className="section-title">Skill Development Opportunities</h3>
          
          {skillMatchData.gaps.length > 0 ? (
            <div className="skill-gaps-grid">
              {skillMatchData.gaps.slice(0, 3).map((gap: any, index: number) => (
                <div key={index} className="skill-gap-card">
                  <div className="skill-gap-header">
                    <h4 className="skill-name">{gap.skill}</h4>
                    <span className="gap-fill-badge">{gap.gapFillPercentage}% gap fill</span>
                  </div>
                  
                  <div className="skill-levels">
                    <div className="level-item">
                      <span className="level-label">Your Current Level</span>
                      <div className="level-bar">
                        <div 
                          className="level-indicator current" 
                          style={{ width: `${gap.currentGap > 0 ? 100 - (gap.currentGap * 20) : 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="level-item">
                      <span className="level-label">Mentor's Level</span>
                      <div className="level-bar">
                        <div 
                          className="level-indicator mentor" 
                          style={{ width: `${(gap.mentorCanFill + (gap.currentGap - gap.mentorCanFill)) * 20}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="level-item">
                      <span className="level-label">Your Target Level</span>
                      <div className="level-bar">
                        <div 
                          className="level-indicator target" 
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No significant skill gaps identified.</p>
          )}
        </div>
        
        <div className="development-plan-section">
          <h3 className="section-title">Skill Development Plan</h3>
          
          <div className="development-plan-content">
            <div className="timeframe-card">
              <h4 className="timeframe-title">Estimated Timeframe</h4>
              <p className="timeframe-value">{skillMatchData.developmentPlan.estimatedTimeframe}</p>
              <p className="timeframe-description">
                Based on weekly sessions focusing on your priority skills
              </p>
            </div>
            
            <div className="focus-areas">
              <h4 className="focus-areas-title">Recommended Focus Areas</h4>
              
              <div className="focus-areas-grid">
                {skillMatchData.developmentPlan.focusAreas.map((area: any, index: number) => (
                  <div key={index} className="focus-area-card">
                    <h5 className="focus-skill">{area.skill}</h5>
                    <p className="sessions-estimate">~{area.estimatedSessions} sessions</p>
                    <div className="skill-progression">
                      <div className="progression-point current">
                        <span className="point-label">Current</span>
                        <span className="point-value">{area.currentLevel}</span>
                      </div>
                      <div className="progression-line"></div>
                      <div className="progression-point target">
                        <span className="point-label">Target</span>
                        <span className="point-value">{area.targetLevel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="compatibility-loading">
        <div className="loading-spinner"></div>
        <p>Loading compatibility data...</p>
      </div>
    );
  }
  
  if (!mentor) {
    return (
      <div className="compatibility-error">
        <p>Mentor information not found. Please try again later.</p>
        <Button onClick={fetchCompatibilityData}>Retry</Button>
      </div>
    );
  }
  
  return (
    <Card className="compatibility-view">
      <CardHeader>
        <CardTitle>Compatibility with {mentor.name}</CardTitle>
        <CardDescription>
          Detailed analysis of your compatibility with this mentor based on personality traits and skill alignment.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="compatibility-tabs">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personality">Personality Match</TabsTrigger>
            <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personality" className="mt-6">
            {renderPersonalityCompatibility()}
          </TabsContent>
          
          <TabsContent value="skills" className="mt-6">
            {renderSkillsCompatibility()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalityCompatibilityView;
