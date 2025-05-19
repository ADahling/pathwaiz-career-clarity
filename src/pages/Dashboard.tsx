
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const handleEditProfile = () => {
    if (userRole === 'mentee') {
      navigate('/mentee-profile');
    } else if (userRole === 'mentor') {
      navigate('/mentor-profile');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container-custom flex-grow my-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <p className="text-gray-600 mb-4">
              {userRole === 'mentee'
                ? 'Your mentee profile helps mentors understand your career goals and interests.'
                : 'Your mentor profile showcases your expertise to potential mentees.'}
            </p>
            <Button 
              variant="outline" 
              onClick={handleEditProfile}
              className="flex items-center gap-2"
            >
              Edit Profile <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {userRole === 'mentee' ? 'Find Mentors' : 'Your Mentees'}
            </h2>
            <p className="text-gray-600 mb-4">
              {userRole === 'mentee'
                ? 'Connect with experienced professionals who can guide your career journey.'
                : 'Manage your mentee connections and scheduled sessions.'}
            </p>
            <Button className="flex items-center gap-2">
              {userRole === 'mentee' ? 'Browse Mentors' : 'View Mentees'} <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
            <p className="text-gray-600 mb-4">
              You have no upcoming mentoring sessions scheduled.
            </p>
            <Button variant="outline" className="flex items-center gap-2">
              Schedule a Session <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Resources</h2>
            <p className="text-gray-600 mb-4">
              Access helpful resources to maximize your mentoring experience.
            </p>
            <Button variant="outline" className="flex items-center gap-2">
              View Resources <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
