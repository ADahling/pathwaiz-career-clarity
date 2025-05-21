import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useError } from '@/contexts/ErrorContext';
import { useNavigate } from 'react-router-dom';
import './MatchingQuestionnaire.css';

interface MatchingQuestionnaireProps {
  onComplete?: (matchingData: any) => void;
}

export const MatchingQuestionnaire: React.FC<MatchingQuestionnaireProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { handleError } = useError();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    // Communication style preferences
    communicationStyle: '',
    feedbackPreference: '',
    meetingFrequency: '',
    responseTimeExpectation: '',
    
    // Mentorship style preferences
    mentorshipApproach: '',
    guidanceLevel: 50, // Slider value 0-100
    learningStyle: '',
    goalOrientation: '',
    
    // Skills and expertise
    careerStage: '',
    industryInterests: [] as string[],
    skillsToImprove: [] as string[],
    careerGoals: '',
  });

  // Define the questionnaire steps
  const steps = [
    {
      title: "Communication Preferences",
      description: "Let's understand how you prefer to communicate with your mentor.",
      fields: [
        {
          type: "radio",
          name: "communicationStyle",
          label: "What communication style do you prefer?",
          options: [
            { value: "direct", label: "Direct and straightforward" },
            { value: "supportive", label: "Supportive and encouraging" },
            { value: "analytical", label: "Analytical and detailed" },
            { value: "collaborative", label: "Collaborative and interactive" }
          ]
        },
        {
          type: "radio",
          name: "feedbackPreference",
          label: "How do you prefer to receive feedback?",
          options: [
            { value: "gentle", label: "Gentle and constructive" },
            { value: "honest", label: "Honest and direct" },
            { value: "detailed", label: "Detailed with specific examples" },
            { value: "actionable", label: "Actionable with clear next steps" }
          ]
        },
        {
          type: "radio",
          name: "meetingFrequency",
          label: "What meeting frequency works best for you?",
          options: [
            { value: "weekly", label: "Weekly check-ins" },
            { value: "biweekly", label: "Bi-weekly sessions" },
            { value: "monthly", label: "Monthly deep dives" },
            { value: "asNeeded", label: "As needed, when I have specific questions" }
          ]
        },
        {
          type: "radio",
          name: "responseTimeExpectation",
          label: "What response time do you expect for messages?",
          options: [
            { value: "sameDay", label: "Same day responses" },
            { value: "24hours", label: "Within 24 hours" },
            { value: "48hours", label: "Within 48 hours" },
            { value: "flexible", label: "Flexible, I understand mentors are busy" }
          ]
        }
      ]
    },
    {
      title: "Mentorship Style",
      description: "Help us understand what type of mentorship approach works best for you.",
      fields: [
        {
          type: "radio",
          name: "mentorshipApproach",
          label: "What mentorship approach do you prefer?",
          options: [
            { value: "coaching", label: "Coaching (helps you find your own answers)" },
            { value: "advisory", label: "Advisory (provides specific advice and solutions)" },
            { value: "sponsorship", label: "Sponsorship (advocates for your growth and opportunities)" },
            { value: "roleModel", label: "Role model (leads by example)" }
          ]
        },
        {
          type: "slider",
          name: "guidanceLevel",
          label: "How much guidance vs. independence do you prefer?",
          min: 0,
          max: 100,
          step: 10,
          markers: [
            { value: 0, label: "Complete guidance" },
            { value: 50, label: "Balanced" },
            { value: 100, label: "Complete independence" }
          ]
        },
        {
          type: "radio",
          name: "learningStyle",
          label: "What's your preferred learning style?",
          options: [
            { value: "visual", label: "Visual (diagrams, charts, demonstrations)" },
            { value: "auditory", label: "Auditory (discussions, verbal explanations)" },
            { value: "reading", label: "Reading/Writing (articles, written instructions)" },
            { value: "kinesthetic", label: "Kinesthetic (hands-on practice, learning by doing)" }
          ]
        },
        {
          type: "radio",
          name: "goalOrientation",
          label: "How do you prefer to approach goals?",
          options: [
            { value: "structured", label: "Structured with clear milestones" },
            { value: "flexible", label: "Flexible and adaptable" },
            { value: "challengeDriven", label: "Challenge-driven with stretch goals" },
            { value: "processOriented", label: "Process-oriented with focus on learning" }
          ]
        }
      ]
    },
    {
      title: "Skills & Expertise",
      description: "Tell us about your career goals and the skills you want to develop.",
      fields: [
        {
          type: "radio",
          name: "careerStage",
          label: "What stage are you in your career?",
          options: [
            { value: "student", label: "Student or recent graduate" },
            { value: "earlyCareer", label: "Early career (1-3 years)" },
            { value: "midCareer", label: "Mid-career (4-10 years)" },
            { value: "seniorLevel", label: "Senior level (10+ years)" },
            { value: "careerTransition", label: "Career transition" }
          ]
        },
        {
          type: "checkbox",
          name: "industryInterests",
          label: "Which industries are you interested in? (Select all that apply)",
          options: [
            { value: "technology", label: "Technology" },
            { value: "finance", label: "Finance" },
            { value: "healthcare", label: "Healthcare" },
            { value: "education", label: "Education" },
            { value: "marketing", label: "Marketing" },
            { value: "design", label: "Design" },
            { value: "consulting", label: "Consulting" },
            { value: "nonprofit", label: "Non-profit" }
          ]
        },
        {
          type: "checkbox",
          name: "skillsToImprove",
          label: "What skills are you looking to improve? (Select all that apply)",
          options: [
            { value: "leadership", label: "Leadership" },
            { value: "communication", label: "Communication" },
            { value: "technical", label: "Technical skills" },
            { value: "projectManagement", label: "Project management" },
            { value: "networking", label: "Networking" },
            { value: "careerPlanning", label: "Career planning" },
            { value: "workLifeBalance", label: "Work-life balance" },
            { value: "conflictResolution", label: "Conflict resolution" }
          ]
        },
        {
          type: "textarea",
          name: "careerGoals",
          label: "What are your short and long-term career goals?",
          placeholder: "Describe what you hope to achieve in your career in the next 1-5 years..."
        }
      ]
    }
  ];

  const handleInputChange = (name: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setAnswers(prev => {
      const currentValues = prev[name as keyof typeof prev] as string[];
      
      if (checked) {
        return {
          ...prev,
          [name]: [...currentValues, value]
        };
      } else {
        return {
          ...prev,
          [name]: currentValues.filter(v => v !== value)
        };
      }
    });
  };

  const isStepComplete = () => {
    const currentStepFields = steps[currentStep].fields;
    
    for (const field of currentStepFields) {
      const value = answers[field.name as keyof typeof answers];
      
      if (field.type === 'checkbox') {
        // For checkboxes, at least one option should be selected
        if (Array.isArray(value) && value.length === 0) {
          return false;
        }
      } else if (field.type === 'textarea') {
        // For text areas, should have some content
        if (typeof value === 'string' && value.trim() === '') {
          return false;
        }
      } else {
        // For other field types, should have a value
        if (value === undefined || value === '') {
          return false;
        }
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your preferences.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // For now, we'll just mock the API call since mentee_preferences table doesn't exist yet
      // We'll modify this to use localStorage instead
      
      // Store preferences in localStorage
      localStorage.setItem('mentee_preferences', JSON.stringify({
        user_id: user.id,
        communication_preferences: {
          style: answers.communicationStyle,
          feedback: answers.feedbackPreference,
          meeting_frequency: answers.meetingFrequency,
          response_time: answers.responseTimeExpectation
        },
        mentorship_preferences: {
          approach: answers.mentorshipApproach,
          guidance_level: answers.guidanceLevel,
          learning_style: answers.learningStyle,
          goal_orientation: answers.goalOrientation
        },
        career_preferences: {
          stage: answers.careerStage,
          industry_interests: answers.industryInterests,
          skills_to_improve: answers.skillsToImprove,
          goals: answers.careerGoals
        },
        updated_at: new Date().toISOString()
      }));

      toast({
        title: "Preferences Saved",
        description: "Your mentorship preferences have been saved successfully.",
      });

      // If onComplete callback is provided, call it with the answers
      if (onComplete) {
        onComplete(answers);
      } else {
        // Otherwise, navigate to the mentor matching page
        navigate('/find-mentor');
      }
    } catch (error) {
      handleError(error, "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'radio':
        return (
          <div className="space-y-4" key={field.name}>
            <Label className="text-base font-medium">{field.label}</Label>
            <RadioGroup
              value={answers[field.name as keyof typeof answers] as string}
              onValueChange={(value) => handleInputChange(field.name, value)}
              className="space-y-2"
            >
              {field.options.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                  <Label htmlFor={`${field.name}-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'slider':
        return (
          <div className="space-y-6" key={field.name}>
            <div>
              <Label className="text-base font-medium">{field.label}</Label>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                {field.markers.map((marker: any) => (
                  <span key={marker.value}>{marker.label}</span>
                ))}
              </div>
            </div>
            <Slider
              value={[answers[field.name as keyof typeof answers] as number]}
              min={field.min}
              max={field.max}
              step={field.step}
              onValueChange={(value) => handleInputChange(field.name, value[0])}
              className="py-4"
            />
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="space-y-4" key={field.name}>
            <Label className="text-base font-medium">{field.label}</Label>
            <div className="grid grid-cols-2 gap-2">
              {field.options.map((option: any) => {
                const values = answers[field.name as keyof typeof answers] as string[];
                const isChecked = Array.isArray(values) && values.includes(option.value);
                
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.name}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange(field.name, option.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={`${field.name}-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case 'textarea':
        return (
          <div className="space-y-2" key={field.name}>
            <Label className="text-base font-medium">{field.label}</Label>
            <Textarea
              placeholder={field.placeholder}
              value={answers[field.name as keyof typeof answers] as string}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              rows={4}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="matching-questionnaire">
      <CardHeader>
        <CardTitle>{currentStepData.title}</CardTitle>
        <CardDescription>{currentStepData.description}</CardDescription>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentStepData.fields.map(renderField)}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || loading}
        >
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!isStepComplete() || loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : currentStep === steps.length - 1 ? (
            'Find My Mentor Match'
          ) : (
            'Next'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MatchingQuestionnaire;
