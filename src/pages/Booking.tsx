import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar';
import BookingForm from '@/components/booking/BookingForm';
import PaymentForm from '@/components/payment/PaymentForm';
import { useParams, useNavigate } from 'react-router-dom';

const Booking: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('availability');
  const [loading, setLoading] = useState(true);
  const [mentorData, setMentorData] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Fetch mentor data
  useEffect(() => {
    const fetchMentorData = async () => {
      if (!mentorId) return;
      
      setLoading(true);
      
      try {
        // This is a placeholder implementation
        // In a real implementation, we would fetch mentor data from Supabase
        
        // Mock mentor data
        const mockMentor = {
          id: mentorId,
          profile: {
            first_name: 'John',
            last_name: 'Doe',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            bio: 'Experienced software engineer with 10+ years in the industry. Specialized in web development and career transitions.',
            location: 'San Francisco, CA',
          },
          job_title: 'Senior Software Engineer',
          company: 'Tech Innovations Inc.',
          hourly_rate: 120,
          expertise: ['Web Development', 'Career Transitions', 'Interview Preparation'],
          average_rating: 4.8,
          total_reviews: 24,
        };
        
        setMentorData(mockMentor);
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load mentor data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [mentorId, toast]);

  // Handle slot selection
  const handleSlotSelect = (start: Date, end: Date) => {
    setSelectedSlot({ start, end });
    setActiveTab('booking');
  };

  // Handle booking success
  const handleBookingSuccess = (newBookingId: string) => {
    setBookingId(newBookingId);
    setActiveTab('payment');
    toast({
      title: 'Booking Created',
      description: 'Your booking has been created. Please complete payment to confirm.',
    });
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    toast({
      title: 'Payment Successful',
      description: 'Your booking has been confirmed. Check your email for details.',
    });
    navigate('/dashboard');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book a Session</CardTitle>
        <CardDescription>
          {mentorData ? (
            `Schedule a mentoring session with ${mentorData.profile.first_name} ${mentorData.profile.last_name}`
          ) : (
            'Select a time slot and complete your booking'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : mentorData ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="booking" disabled={!selectedSlot}>Booking Details</TabsTrigger>
              <TabsTrigger value="payment" disabled={!bookingId}>Payment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="availability" className="mt-6">
              <div className="mb-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={mentorData.profile.avatar_url}
                      alt={`${mentorData.profile.first_name} ${mentorData.profile.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">
                      {mentorData.profile.first_name} {mentorData.profile.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {mentorData.job_title} at {mentorData.company}
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-1">
                        ${mentorData.hourly_rate}/hour
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {mentorData.average_rating} ★ ({mentorData.total_reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm mb-4">{mentorData.profile.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentorData.expertise.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Select a Time Slot</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose from available time slots below. All times are shown in your local timezone.
                </p>
                <AvailabilityCalendar
                  mentorId={mentorId || ''}
                  onTimeSlotSelect={handleSlotSelect}
                  readOnly={false}
                  showBookedSlots={true}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="booking" className="mt-6">
              {selectedSlot && (
                <BookingForm
                  mentorId={mentorId || ''}
                  mentorName={`${mentorData.profile.first_name} ${mentorData.profile.last_name}`}
                  hourlyRate={mentorData.hourly_rate}
                  selectedDate={selectedSlot.start}
                  selectedTime={`${selectedSlot.start.getHours().toString().padStart(2, '0')}:${selectedSlot.start.getMinutes().toString().padStart(2, '0')}`}
                  onSuccess={() => handleBookingSuccess('placeholder-booking-id')}
                />
              )}
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              {bookingId && (
                <PaymentForm
                  bookingId={bookingId}
                  amount={mentorData.hourly_rate}
                  mentorName={`${mentorData.profile.first_name} ${mentorData.profile.last_name}`}
                  sessionDate={selectedSlot ? selectedSlot.start.toLocaleDateString() : ''}
                  sessionTime={selectedSlot ? selectedSlot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  onSuccess={handlePaymentSuccess}
                />
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Mentor not found.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/find-a-mentor')}
            >
              Back to Mentor Search
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Booking;
