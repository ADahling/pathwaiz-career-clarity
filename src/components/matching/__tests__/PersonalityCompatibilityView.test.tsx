import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { PersonalityCompatibilityView } from '@/components/matching/PersonalityCompatibilityView';
import matchingService from '@/services/MatchingService';
import { personalityCompatibilityService, skillMatchingService } from '@/services/AdvancedMatchingService';

// Mock the services
jest.mock('@/services/MatchingService');
jest.mock('@/services/AdvancedMatchingService', () => ({
  personalityCompatibilityService: {
    generateCompatibilityInsights: jest.fn(),
    formatAreaName: jest.fn((area) => area.charAt(0).toUpperCase() + area.slice(1))
  },
  skillMatchingService: {
    calculateSkillMatchScore: jest.fn(),
    identifySkillGaps: jest.fn(),
    generateSkillDevelopmentPlan: jest.fn()
  }
}));

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

describe('PersonalityCompatibilityView Component', () => {
  const mentorId = 'mentor-1';
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
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
        profile_image: ''
      }
    ]);
    
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
    
    (personalityCompatibilityService.generateCompatibilityInsights as jest.Mock).mockReturnValue({
      overallScore: 85,
      overallDescription: 'Strong overall compatibility with some complementary differences',
      strengths: [
        { area: 'Communication Style', description: 'Perfect match in communication style' },
        { area: 'Feedback Approach', description: 'Compatible feedback styles' }
      ],
      challenges: [
        { area: 'Problem Solving', description: 'Different but potentially valuable problem-solving perspectives' }
      ],
      details: {
        communication: { score: 100, description: 'Perfect match in communication style' },
        feedback: { score: 85, description: 'Compatible feedback styles' },
        workPace: { score: 80, description: 'Compatible working speeds' },
        problemSolving: { score: 65, description: 'Different but potentially valuable problem-solving perspectives' },
        conflictResolution: { score: 75, description: 'Good alignment in handling disagreements' }
      }
    });
    
    (skillMatchingService.calculateSkillMatchScore as jest.Mock).mockReturnValue({
      score: 80,
      matchDetails: []
    });
    
    (skillMatchingService.identifySkillGaps as jest.Mock).mockReturnValue([
      {
        skill: 'leadership',
        currentGap: 2,
        mentorCanFill: 2,
        gapFillPercentage: 100,
        priority: 5
      }
    ]);
    
    (skillMatchingService.generateSkillDevelopmentPlan as jest.Mock).mockReturnValue({
      focusAreas: [
        {
          skill: 'leadership',
          currentLevel: 2,
          targetLevel: 4,
          mentorLevel: 5,
          estimatedSessions: 5
        }
      ],
      estimatedTimeframe: '5 weeks',
      recommendedResources: []
    });
  });
  
  test('renders personality compatibility tab by default', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ErrorProvider>
            <PersonalityCompatibilityView mentorId={mentorId} />
          </ErrorProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(matchingService.fetchMentors).toHaveBeenCalled();
      expect(matchingService.fetchUserPreferences).toHaveBeenCalledWith('test-user-id');
    });
    
    // Check if personality tab is selected by default
    expect(screen.getByRole('tab', { name: 'Personality Match' })).toHaveAttribute('aria-selected', 'true');
    
    // Check if compatibility score is displayed
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Personality Match')).toBeInTheDocument();
    expect(screen.getByText('Strong overall compatibility with some complementary differences')).toBeInTheDocument();
    
    // Check if strengths and challenges are displayed
    expect(screen.getByText('Compatibility Strengths')).toBeInTheDocument();
    expect(screen.getByText('Perfect match in communication style')).toBeInTheDocument();
    expect(screen.getByText('Areas for Attention')).toBeInTheDocument();
    expect(screen.getByText('Different but potentially valuable problem-solving perspectives')).toBeInTheDocument();
    
    // Check if compatibility factors are displayed
    expect(screen.getByText('Compatibility Factors')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
  
  test('switches to skills tab and displays skill compatibility data', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ErrorProvider>
            <PersonalityCompatibilityView mentorId={mentorId} />
          </ErrorProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(matchingService.fetchMentors).toHaveBeenCalled();
      expect(matchingService.fetchUserPreferences).toHaveBeenCalledWith('test-user-id');
    });
    
    // Click on Skills & Expertise tab
    fireEvent.click(screen.getByRole('tab', { name: 'Skills & Expertise' }));
    
    // Check if skills tab is selected
    expect(screen.getByRole('tab', { name: 'Skills & Expertise' })).toHaveAttribute('aria-selected', 'true');
    
    // Check if skill match score is displayed
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Skills Match')).toBeInTheDocument();
    expect(screen.getByText("This mentor's expertise aligns with 80% of your skill development needs.")).toBeInTheDocument();
    
    // Check if skill development opportunities are displayed
    expect(screen.getByText('Skill Development Opportunities')).toBeInTheDocument();
    expect(screen.getByText('leadership')).toBeInTheDocument();
    expect(screen.getByText('100% gap fill')).toBeInTheDocument();
    
    // Check if development plan is displayed
    expect(screen.getByText('Skill Development Plan')).toBeInTheDocument();
    expect(screen.getByText('Estimated Timeframe')).toBeInTheDocument();
    expect(screen.getByText('5 weeks')).toBeInTheDocument();
    expect(screen.getByText('Recommended Focus Areas')).toBeInTheDocument();
    expect(screen.getByText('~5 sessions')).toBeInTheDocument();
  });
  
  test('handles error when mentor is not found', async () => {
    // Mock mentor not found
    (matchingService.fetchMentors as jest.Mock).mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ErrorProvider>
            <PersonalityCompatibilityView mentorId={mentorId} />
          </ErrorProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(matchingService.fetchMentors).toHaveBeenCalled();
    });
    
    // Check if error message is displayed
    expect(screen.getByText('Mentor information not found. Please try again later.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
  
  test('handles error when user preferences are not found', async () => {
    // Mock user preferences not found
    (matchingService.fetchUserPreferences as jest.Mock).mockResolvedValue(null);
    
    const mockToast = jest.fn();
    (require('@/components/ui/toast').useToast as jest.Mock).mockReturnValue({
      toast: mockToast
    });
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ErrorProvider>
            <PersonalityCompatibilityView mentorId={mentorId} />
          </ErrorProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(matchingService.fetchUserPreferences).toHaveBeenCalledWith('test-user-id');
    });
    
    // Check if toast was called with error message
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Preferences Not Found',
      description: 'Please complete the matching questionnaire to see compatibility details.',
      variant: 'destructive'
    }));
  });
});
