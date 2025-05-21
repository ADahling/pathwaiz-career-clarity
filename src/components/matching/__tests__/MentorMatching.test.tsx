import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { MentorMatching } from '@/components/matching/MentorMatching';
import matchingService from '@/services/MatchingService';

// Mock the services
jest.mock('@/services/MatchingService');
jest.mock('@/services/AdvancedMatchingService');

// Mock the contexts
jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

jest.mock('@/contexts/ErrorContext', () => ({
  ErrorProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useErrorContext: () => ({
    handleError: jest.fn()
  })
}));

// Mock the UI components
jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('MentorMatching Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (matchingService.fetchUserPreferences as jest.Mock).mockResolvedValue(null);
    (matchingService.fetchMentors as jest.Mock).mockResolvedValue([]);
    (matchingService.generateAIRecommendations as jest.Mock).mockResolvedValue([]);
    (matchingService.saveMentorMatches as jest.Mock).mockResolvedValue(undefined);
  });
  
  test('renders questionnaire tab by default when no preferences exist', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ErrorProvider>
            <MentorMatching />
          </ErrorProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(matchingService.fetchUserPreferences).toHaveBeenCalledWith('test-user-id');
    });
    
    expect(screen.getByText('Find Your Perfect Mentor')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Questionnaire' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Mentor Matches' })).toBeDisabled();
  });
  
  test('renders results tab when user has completed questionnaire', async () => {
    // Mock user preferences exist
    (matchingService.fetchUserPreferences as jest.Mock).mockResolvedValue({
      communication_preferences: {
        style: 'direct',
        feedback: 'honest',
        meeting_frequency: 'weekly',
        response_time: 'sameDay'
      },
      mentorship_preferences: {
        approach: 'coaching',
        guidance_level: 50,
        learning_style: 'visual',
        goal_orientation: 'structured'
      },
      career_preferences: {
        stage: 'midCareer',
        industry_interests: ['technology'],
        skills_to_improve: ['leadership'],
        goals: 'Become a team lead'
      }
    });
    
    // Mock matched mentors
    (matchingService.fetchMentors as jest.Mock).mockResolvedValue([
      {
        id: 'mentor-1',
        name: 'Jane Doe',
        title: 'Senior Manager',
        company: 'Tech Corp',
        bio: 'Experienced leader',
        expertise: ['leadership', 'management'],
        years_experience: 10,
        hourly_rate: 100,
        communication_style: 'direct',
        mentorship_style: 'coaching',
        availability: [],
        rating: 4.8,
        reviews_count: 24,
        profile_image: '',
        match_score: 85,
        match_reasons: ['Communication style match', 'Expertise in leadership']
      }
    ]);
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ErrorProvider>
            <MentorMatching />
          </ErrorProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(matchingService.fetchUserPreferences).toHaveBeenCalledWith('test-user-id');
      expect(matchingService.fetchMentors).toHaveBeenCalled();
    });
    
    expect(screen.getByRole('tab', { name: 'Mentor Matches' })).not.toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Mentor Matches' })).toHaveAttribute('aria-selected', 'true');
    
    // Check if mentor card is displayed
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Senior Manager at Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Match')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });
  
  test('completes questionnaire and generates matches', async () => {
    // Mock the questionnaire completion
    const mockAnswers = {
      communicationStyle: 'direct',
      feedbackPreference: 'honest',
      meetingFrequency: 'weekly',
      responseTimeExpectation: 'sameDay',
      mentorshipApproach: 'coaching',
      guidanceLevel: 50,
      learningStyle: 'visual',
      goalOrientation: 'structured',
      careerStage: 'midCareer',
      industryInterests: ['technology'],
      skillsToImprove: ['leadership'],
      careerGoals: 'Become a team lead'
    };
    
    // Mock user preferences after saving
    (matchingService.fetchUserPreferences as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({
      communication_preferences: {
        style: 'direct',
        feedback: 'honest',
        meeting_frequency: 'weekly',
        response_time: 'sameDay'
      },
      mentorship_preferences: {
        approach: 'coaching',
        guidance_level: 50,
        learning_style: 'visual',
        goal_orientation: 'structured'
      },
      career_preferences: {
        stage: 'midCareer',
        industry_interests: ['technology'],
        skills_to_improve: ['leadership'],
        goals: 'Become a team lead'
      }
    });
    
    // Mock matched mentors
    const mockMentors = [
      {
        id: 'mentor-1',
        name: 'Jane Doe',
        title: 'Senior Manager',
        company: 'Tech Corp',
        bio: 'Experienced leader',
        expertise: ['leadership', 'management'],
        years_experience: 10,
        hourly_rate: 100,
        communication_style: 'direct',
        mentorship_style: 'coaching',
        availability: [],
        rating: 4.8,
        reviews_count: 24,
        profile_image: ''
      }
    ];
    
    const mockMatchedMentors = [
      {
        ...mockMentors[0],
        match_score: 85,
        match_reasons: ['Communication style match', 'Expertise in leadership']
      }
    ];
    
    (matchingService.fetchMentors as jest.Mock).mockResolvedValue(mockMentors);
    (matchingService.generateAIRecommendations as jest.Mock).mockResolvedValue(mockMatchedMentors);
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ErrorProvider>
            <MentorMatching />
          </ErrorProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(matchingService.fetchUserPreferences).toHaveBeenCalledWith('test-user-id');
    });
    
    // Simulate questionnaire completion
    const onComplete = (matchingService.generateAIRecommendations as jest.Mock).mock.calls[0][1];
    await onComplete(mockAnswers);
    
    await waitFor(() => {
      expect(matchingService.fetchUserPreferences).toHaveBeenCalledTimes(2);
      expect(matchingService.generateAIRecommendations).toHaveBeenCalled();
      expect(matchingService.saveMentorMatches).toHaveBeenCalledWith('test-user-id', mockMatchedMentors);
    });
    
    // Check if results tab is selected and mentor card is displayed
    expect(screen.getByRole('tab', { name: 'Mentor Matches' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });
});
