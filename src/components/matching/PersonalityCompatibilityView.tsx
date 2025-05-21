
import React, { useEffect, useState } from 'react';
import { enhancedSupabase } from '@/integrations/supabase/mockClient';
import { useAuth } from '@/contexts/AuthContext';
import { useError } from '@/contexts/ErrorContext';
import { toast } from '@/components/ui/sonner';
import './PersonalityCompatibilityView.css';

interface PersonalityCompatibilityViewProps {
  mentorId: string;
  menteeId: string;
}

const PersonalityCompatibilityView: React.FC<PersonalityCompatibilityViewProps> = ({ mentorId, menteeId }) => {
  const [compatibilityData, setCompatibilityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { handleError } = useError();

  useEffect(() => {
    fetchCompatibilityData();
  }, [mentorId, menteeId]);

  const fetchCompatibilityData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock data for demonstration
      const mockData = {
        areas: [
          {
            areaKey: 'collaborationStyle',
            mentorValue: 'Collaborative',
            menteeValue: 'Collaborative',
            matchStrength: 0.9
          },
          {
            areaKey: 'communicationPreference',
            mentorValue: 'Direct',
            menteeValue: 'Direct',
            matchStrength: 0.8
          },
          {
            areaKey: 'feedbackStyle',
            mentorValue: 'Honest',
            menteeValue: 'Constructive',
            matchStrength: 0.6
          },
          {
            areaKey: 'problemSolvingApproach',
            mentorValue: 'Analytical',
            menteeValue: 'Creative',
            matchStrength: 0.5
          },
          {
            areaKey: 'workLifeBalance',
            mentorValue: 'Balanced',
            menteeValue: 'Flexible',
            matchStrength: 0.7
          },
          {
            areaKey: 'careerValues',
            mentorValue: 'Growth',
            menteeValue: 'Impact',
            matchStrength: 0.4
          },
          {
            areaKey: 'learningStyle',
            mentorValue: 'Visual',
            menteeValue: 'Auditory',
            matchStrength: 0.6
          }
        ]
      };

      setCompatibilityData(mockData);
    } catch (err: any) {
      handleError(err, 'Failed to load compatibility data');
      setError(err.message || 'Failed to load compatibility data.');
    } finally {
      setLoading(false);
    }
  };

  const getMatchStrengthColor = (strength: number): string => {
    if (strength >= 0.8) return 'var(--success)';
    if (strength >= 0.6) return 'var(--warning)';
    return 'var(--error)';
  };

  // Format area name helper function
  const formatAreaName = (areaKey: string): string => {
    const formattedNames: Record<string, string> = {
      'collaborationStyle': 'Collaboration Style',
      'communicationPreference': 'Communication',
      'feedbackStyle': 'Feedback Style',
      'problemSolvingApproach': 'Problem Solving',
      'workLifeBalance': 'Work-Life Balance',
      'careerValues': 'Career Values',
      'learningStyle': 'Learning Style'
    };
    
    return formattedNames[areaKey] || areaKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  if (loading) {
    return <div className="loading-message">Loading compatibility data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!compatibilityData) {
    return <div className="no-data-message">No compatibility data available.</div>;
  }

  return (
    <div className="compatibility-view">
      <h2>Personality Compatibility</h2>
      {compatibilityData.areas.map((area: any) => (
        <div key={area.areaKey} className="compatibility-area">
          <h3>{formatAreaName(area.areaKey)}</h3>
          <div className="compatibility-details">
            <div className="value-pair">
              <span>Mentor:</span>
              <span>{area.mentorValue}</span>
            </div>
            <div className="value-pair">
              <span>Mentee:</span>
              <span>{area.menteeValue}</span>
            </div>
            <div className="match-strength">
              <span>Match Strength:</span>
              <span
                className="strength-indicator"
                style={{ color: getMatchStrengthColor(area.matchStrength) }}
              >
                {Math.round(area.matchStrength * 100)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PersonalityCompatibilityView;
