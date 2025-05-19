
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { GraduationCap, Briefcase } from 'lucide-react';

const Onboarding: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = async (role: 'mentee' | 'mentor') => {
    if (!user) {
      toast.error('You must be logged in');
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      // Update the user's profile with their role
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);

      if (error) throw error;

      // Create the appropriate role-specific profile
      if (role === 'mentee') {
        const { error: menteeProfileError } = await supabase
          .from('mentee_profiles')
          .insert({ id: user.id });
        
        if (menteeProfileError) throw menteeProfileError;
        
        toast.success('Welcome to Pathwaiz as a mentee!');
        navigate('/mentee-profile');
      } else {
        const { error: mentorProfileError } = await supabase
          .from('mentor_profiles')
          .insert({ id: user.id });
        
        if (mentorProfileError) throw mentorProfileError;
        
        toast.success('Welcome to Pathwaiz as a mentor!');
        navigate('/mentor-profile');
      }
    } catch (error: any) {
      console.error('Error setting role:', error.message);
      toast.error(error.message || 'Error setting role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to Pathwaiz</h1>
        <p className="text-xl text-center mb-12">Tell us who you are</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="transition-all hover:shadow-lg cursor-pointer border-2 hover:border-pathwaiz-blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                I'm Looking for Career Guidance
              </CardTitle>
              <CardDescription>I want to connect with mentors who can help me navigate my career path</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As a mentee, you'll be able to:
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Connect with industry professionals
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Get firsthand career insights
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Make confident career decisions
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-pathwaiz-blue" 
                onClick={() => handleRoleSelection('mentee')}
                disabled={isLoading}
              >
                Continue as Mentee
              </Button>
            </CardFooter>
          </Card>

          <Card className="transition-all hover:shadow-lg cursor-pointer border-2 hover:border-pathwaiz-blue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                I Want to Share My Experience
              </CardTitle>
              <CardDescription>I want to guide others with my professional expertise and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As a mentor, you'll be able to:
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Share your industry knowledge
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Help others make informed career decisions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Set your own rates and availability
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-pathwaiz-blue" 
                onClick={() => handleRoleSelection('mentor')}
                disabled={isLoading}
              >
                Continue as Mentor
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
