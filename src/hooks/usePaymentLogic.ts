
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionOption {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'one-time' | 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

export const usePaymentLogic = (bookingId: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<any>(null);
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SubscriptionOption | null>(null);
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        if (!bookingId) {
          throw new Error('Booking ID is required');
        }
        
        // First fetch the booking data
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();
          
        if (bookingError) throw bookingError;
        
        if (!bookingData) {
          // If no data, use placeholder for development
          const placeholderBooking = {
            id: bookingId,
            mentee_id: user.id,
            mentor_id: 'mentor-1',
            date: new Date().toISOString().split('T')[0],
            time: '14:00',
            session_type: 'Career Guidance',
            topic: 'Transitioning to product management',
            status: 'pending',
            payment_status: 'pending',
            created_at: new Date().toISOString()
          };
          
          setBooking(placeholderBooking);
          setMentor({
            id: 'mentor-1',
            name: 'Alex Johnson',
            hourlyRate: 75,
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
          });
        } else {
          setBooking(bookingData);
          
          // Now fetch the mentor profile separately
          const { data: mentorData, error: mentorError } = await supabase
            .from('mentor_profiles')
            .select('id, name, hourly_rate, profile_image')
            .eq('id', bookingData.mentor_id)
            .single();
          
          if (mentorError) {
            console.error('Error fetching mentor:', mentorError);
            // Use placeholder mentor data if mentor not found
            setMentor({
              id: bookingData.mentor_id,
              name: 'Unknown Mentor',
              hourlyRate: 75,
              profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
            });
          } else {
            // Extract mentor info from the fetched data
            const mentorInfo = {
              id: mentorData.id,
              name: mentorData.name || 'Unknown Mentor',
              hourlyRate: mentorData.hourly_rate || 75,
              profileImage: mentorData.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg'
            };
            
            setMentor(mentorInfo);
          }
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking information. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [user, bookingId, navigate]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    
    // Redirect to dashboard after a delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };
  
  const handleCancel = () => {
    navigate(`/booking/${booking?.mentor_id}`);
  };

  const handleSubscriptionSelect = (option: SubscriptionOption) => {
    setSelectedOption(option);
  };

  const handleApplyPromoCode = async (code: string): Promise<boolean> => {
    // In a real implementation, this would validate the promo code with your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate a valid promo code that gives 15% off
        if (code.toUpperCase() === 'WELCOME15') {
          setDiscount(15);
          setPromoApplied(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const handleRemovePromoCode = () => {
    setDiscount(0);
    setPromoApplied(false);
  };
  
  // Calculate final amount based on selected option and discount
  const calculateFinalAmount = () => {
    if (!selectedOption) {
      return mentor?.hourlyRate * 100 || 7500; // Default to hourly rate in cents
    }
    
    const baseAmount = selectedOption.price * 100; // Convert to cents
    if (discount > 0) {
      return baseAmount - (baseAmount * discount / 100);
    }
    return baseAmount;
  };

  return {
    booking,
    mentor,
    loading,
    error,
    paymentSuccess,
    selectedOption,
    discount,
    promoApplied,
    handlePaymentSuccess,
    handleCancel,
    handleSubscriptionSelect,
    handleApplyPromoCode,
    handleRemovePromoCode,
    calculateFinalAmount,
    setSelectedOption
  };
};
