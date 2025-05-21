
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ReviewList } from '@/components/reviews/ReviewList';
import { AvailabilityCalendar } from '@/components/booking/AvailabilityCalendar'; // Fixed import path
import { Loader2 } from 'lucide-react';

const MentorProfile: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const { user } = useAuth();
  const [mentorProfile, setMentorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      if (!mentorId) {
        console.error('Mentor ID is missing');
        setLoading(false);
        return;
      }

      try {
        const { data: mentorProfile, error } = await supabase.from('mentor_profiles').select('*').eq('id', mentorId).single();

        if (error) {
          console.error('Error fetching mentor profile:', error);
        }

        setMentorProfile(mentorProfile);
      } catch (error) {
        console.error('Error fetching mentor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorProfile();
  }, [mentorId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        Loading mentor profile...
      </div>
    );
  }

  if (!mentorProfile) {
    return <div className="flex justify-center items-center h-screen">Mentor profile not found.</div>;
  }

  const hourlyRate = Number(mentorProfile?.hourly_rate || 0);

  return (
    <div className="container mx-auto mt-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{mentorProfile?.name}</CardTitle>
          <CardDescription>{mentorProfile?.job_title} at {mentorProfile?.industry}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={mentorProfile?.profile_image} alt={mentorProfile?.name} />
              <AvatarFallback>{mentorProfile?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center">
              <div className="text-lg font-semibold">Rate: ${hourlyRate}/hr</div>
              <div className="text-sm text-gray-500">Years of Experience: {mentorProfile?.years_experience}</div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="text-gray-700">{mentorProfile?.bio}</div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Book a Session</h3>
              {user ? (
                <Link to={`/booking/${mentorProfile?.id}`}>
                  <Button>Book Session</Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button>Login to Book</Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Availability</h2>
        <AvailabilityCalendar mentorId={mentorProfile?.id} onBook={(start, end) => {}} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <ReviewList mentorId={mentorProfile?.id} />
      </div>
    </div>
  );
};

export default MentorProfile;
