
import React, { useEffect, useState } from 'react';
import { enhancedSupabase } from '@/integrations/supabase/mockClient';
import { useAuth } from '@/contexts/AuthContext';
import { useError } from '@/contexts/ErrorContext'; 
import { toast } from '@/components/ui/sonner';
import matchingService from '@/services/MatchingService';
import './MentorMatching.css';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StarRating } from '@/components/reviews/StarRating';
import MatchingQuestionnaire from '@/components/matching/MatchingQuestionnaire';

export const MentorMatching: React.FC = () => {
  const { user } = useAuth();
  const { handleError } = useError();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('questionnaire');
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [matchedMentors, setMatchedMentors] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchUserPreferences();
      fetchMentors();
    }
  }, [user]);
  
  const fetchUserPreferences = async () => {
    if (!user) return;
    
    try {
      const userPreferences = await matchingService.fetchUserPreferences(user.id);
      setPreferences(userPreferences);
      setHasCompletedQuestionnaire(!!userPreferences);
      
      if (userPreferences) {
        setActiveTab('results');
      }
    } catch (error) {
      handleError(error, "Failed to fetch your preferences");
    }
  };
  
  const fetchMentors = async () => {
    try {
      const mentorData = await matchingService.fetchMentors();
      setMentors(mentorData);
    } catch (error) {
      handleError(error, "Failed to fetch mentors");
    }
  };
  
  const handleQuestionnaireComplete = async (answers: any) => {
    if (!user) {
      toast({
        description: "Please sign in to save your preferences and see mentor matches.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Fetch all mentors if not already loaded
      let mentorData = mentors;
      if (mentorData.length === 0) {
        mentorData = await matchingService.fetchMentors();
        setMentors(mentorData);
      }
      
      // Fetch updated preferences
      const userPreferences = await matchingService.fetchUserPreferences(user.id);
      setPreferences(userPreferences);
      
      if (!userPreferences) {
        throw new Error("Failed to save preferences");
      }
      
      // Generate AI recommendations
      const matches = await matchingService.generateAIRecommendations(mentorData, userPreferences);
      setMatchedMentors(matches);
      
      // Save matches to database
      await matchingService.saveMentorMatches(user.id, matches);
      
      setHasCompletedQuestionnaire(true);
      setActiveTab('results');
      
      toast({
        description: "We've found mentors that match your preferences!",
      });
    } catch (error) {
      handleError(error, "Failed to generate mentor matches");
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewProfile = (mentorId: string) => {
    navigate(`/mentor/${mentorId}`);
  };
  
  const renderMatchedMentors = () => {
    if (loading) {
      return (
        <div className="mentor-matches-loading">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="mentor-card-skeleton">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (matchedMentors.length === 0) {
      return (
        <div className="mentor-matches-empty">
          <p>No mentor matches found. Please complete the questionnaire to get personalized mentor recommendations.</p>
          <Button onClick={() => setActiveTab('questionnaire')}>
            Complete Questionnaire
          </Button>
        </div>
      );
    }
    
    return (
      <div className="mentor-matches">
        {matchedMentors.map((mentor: any) => (
          <Card key={mentor.id} className="mentor-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={mentor.profile_image} alt={mentor.name} />
                  <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{mentor.name}</h3>
                    {mentor.match_score && (
                      <div className="match-score">
                        <span className="match-score-label">Match</span>
                        <span className="match-score-value">{mentor.match_score}%</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{mentor.title} at {mentor.company}</p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={mentor.rating} readOnly size={16} />
                    <span className="text-xs text-muted-foreground">({mentor.reviews_count} reviews)</span>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-1">Why you'll match:</h4>
                    <ul className="match-reasons">
                      {mentor.match_reasons?.map((reason: string, index: number) => (
                        <li key={index} className="text-sm">{reason}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {mentor.expertise.slice(0, 3).map((skill: string, index: number) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="outline">+{mentor.expertise.length - 3} more</Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm">
                      <span className="font-medium">${mentor.hourly_rate}</span>
                      <span className="text-muted-foreground"> / hour</span>
                    </div>
                    
                    <Button onClick={() => handleViewProfile(mentor.id)}>
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="mentor-matching-container">
      <div className="mentor-matching-header">
        <h1 className="text-3xl font-bold">Find Your Perfect Mentor</h1>
        <p className="text-muted-foreground mt-2">
          Our AI-powered matching algorithm will connect you with mentors who match your communication style, 
          mentorship preferences, and career goals.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mentor-matching-tabs">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
          <TabsTrigger value="results" disabled={!hasCompletedQuestionnaire}>
            Mentor Matches
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="questionnaire" className="mt-6">
          <MatchingQuestionnaire onComplete={handleQuestionnaireComplete} />
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Mentor Matches</CardTitle>
              <CardDescription>
                Based on your preferences, we've found these mentors who would be a great fit for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderMatchedMentors()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorMatching;
