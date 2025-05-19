
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';

const MenteeProfile: React.FC = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else if (userRole !== 'mentee') {
      navigate('/onboarding');
    }
  }, [user, userRole, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container-custom flex-grow my-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Mentee Dashboard</h1>
        <p className="text-lg mb-4">
          This is your mentee profile page. Here you'll be able to:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Update your profile information</li>
          <li>Browse available mentors</li>
          <li>Schedule mentoring sessions</li>
          <li>Track your career progress</li>
        </ul>
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Complete Your Profile</h2>
          <p className="mb-4">Tell us about your career goals and interests to help us match you with the right mentors.</p>
          <Button>Update Profile</Button>
        </div>
      </div>
    </div>
  );
};

export default MenteeProfile;
