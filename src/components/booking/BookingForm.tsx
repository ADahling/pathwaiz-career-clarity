import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Calendar from '@/components/booking/calendar/Calendar';
import { useAuth } from '@/contexts/AuthContext';
import { useError } from '@/contexts/ErrorContext';
import './BookingForm.css';

interface BookingFormProps {
  mentor: any;
  onClose?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ mentor, onClose }) => {
  const { user } = useAuth();
  const { captureError } = useError();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState('');
  const [sessionTopic, setSessionTopic] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionDuration, setSessionDuration] = useState<number>(60); // Default to 60 minutes
  const [sessionPrice, setSessionPrice] = useState<number>(0);

  // Session types with durations and price ranges
  const sessionOptions = [
    { 
      type: 'Quick Advice', 
      duration: 15, 
      priceRange: '$20-50',
      description: 'Get targeted advice on a specific question',
      bestFor: ['Specific questions', 'Career direction validation', 'Quick resume feedback']
    },
    { 
      type: 'Deep Dive', 
      duration: 30, 
      priceRange: '$40-100',
      description: 'Explore topics in greater depth',
      bestFor: ['Interview preparation', 'Career transition strategy', 'Portfolio review']
    },
    { 
      type: 'Comprehensive Session', 
      duration: 60, 
      priceRange: '$80-200',
      description: 'Full mentoring session with detailed feedback',
      bestFor: ['In-depth career planning', 'Skill gap analysis', 'Extensive portfolio review', 'Detailed project feedback']
    }
  ];

  useEffect(() => {
    // Reset error when step changes
    setError('');
  }, [step]);

  useEffect(() => {
    // Calculate session price based on mentor's rate and session duration
    if (mentor && sessionDuration) {
      let baseRate = 0;
      
      // Get mentor's hourly rate or use default based on expertise level
      const hourlyRate = mentor.hourlyRate || 100;
      
      // Calculate price based on duration
      switch(sessionDuration) {
        case 15:
          baseRate = Math.round(hourlyRate * 0.25);
          // Ensure price is within the Quick Advice range ($20-50)
          baseRate = Math.max(20, Math.min(50, baseRate));
          break;
        case 30:
          baseRate = Math.round(hourlyRate * 0.5);
          // Ensure price is within the Deep Dive range ($40-100)
          baseRate = Math.max(40, Math.min(100, baseRate));
          break;
        case 60:
        default:
          baseRate = hourlyRate;
          // Ensure price is within the Comprehensive Session range ($80-200)
          baseRate = Math.max(80, Math.min(200, baseRate));
          break;
      }
      
      setSessionPrice(baseRate);
    }
  }, [mentor, sessionDuration]);

  const handleTimeSelected = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleSessionTypeChange = (type: string, duration: number) => {
    setSessionType(type);
    setSessionDuration(duration);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedDate || !selectedTime) {
        setError('Please select a date and time for your session');
        return;
      }
    } else if (step === 2) {
      if (!sessionType) {
        setError('Please select a session type');
        return;
      }
      if (!sessionTopic.trim()) {
        setError('Please enter a topic for your session');
        return;
      }
    }

    setStep(prevStep => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to book a session');
      return;
    }

    if (!selectedDate || !selectedTime || !sessionType || !sessionTopic.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Format date and time for database
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Calculate mentor share (80%) and platform fee (20%)
      const mentorShare = sessionPrice * 0.8;
      const platformFee = sessionPrice * 0.2;
      
      // Create booking in Supabase
      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            mentee_id: user.id,
            mentor_id: mentor.id,
            date: formattedDate,
            time: selectedTime,
            session_type: sessionType,
            duration: sessionDuration,
            topic: sessionTopic,
            notes: additionalNotes,
            price: sessionPrice,
            mentor_share: mentorShare,
            platform_fee: platformFee,
            status: 'pending',
            payment_status: 'unpaid',
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (bookingError) throw bookingError;

      // Update availability to mark the slot as unavailable
      const { error: availabilityError } = await supabase
        .from('mentor_availability')
        .update({ available: false })
        .match({ 
          mentor_id: mentor.id, 
          date: formattedDate, 
          time: selectedTime 
        });

      if (availabilityError) {
        console.error('Error updating availability:', availabilityError);
        // Continue anyway as the booking was successful
      }

      setSuccess(true);
      
      // Redirect to payment page
      setTimeout(() => {
        if (data && data[0]) {
          navigate(`/payment/${data[0].id}`);
        } else {
          navigate('/dashboard');
        }
      }, 1500);

    } catch (error) {
      captureError(error);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="booking-steps">
        <div className={`booking-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Select Time</div>
        </div>
        <div className="step-connector"></div>
        <div className={`booking-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Session Details</div>
        </div>
        <div className="step-connector"></div>
        <div className={`booking-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Confirm</div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <div className="booking-step-content">
        <h3 className="booking-step-title">Select a Date & Time</h3>
        <p className="booking-step-description">
          Choose from {mentor.name}'s available time slots.
        </p>
        
        <Calendar 
          mentorId={mentor.id}
          onTimeSelected={handleTimeSelected}
          availability={mentor.availability}
        />
        
        {error && <div className="booking-error">{error}</div>}
        
        <div className="booking-actions">
          <button 
            className="booking-button-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="booking-button-primary"
            onClick={handleNextStep}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="booking-step-content">
        <h3 className="booking-step-title">Session Details</h3>
        <p className="booking-step-description">
          Tell {mentor.name} what you'd like to discuss in your session.
        </p>
        
        <div className="booking-form-group">
          <label className="booking-label">Session Type</label>
          <div className="booking-session-options">
            {sessionOptions.map((option, index) => (
              <div 
                key={index}
                className={`booking-session-option ${sessionType === option.type ? 'selected' : ''}`}
                onClick={() => handleSessionTypeChange(option.type, option.duration)}
              >
                <div className="session-option-header">
                  <span className="session-option-duration">{option.duration} min</span>
                  <span className="session-option-type">{option.type}</span>
                  <span className="session-option-price">{option.priceRange}</span>
                </div>
                <p className="session-option-description">{option.description}</p>
                <div className="session-option-best-for">
                  <span>Best for:</span>
                  <ul>
                    {option.bestFor.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="booking-form-group">
          <label className="booking-label">Session Topic</label>
          <input
            type="text"
            className="booking-input"
            placeholder="E.g., Career transition to product management"
            value={sessionTopic}
            onChange={(e) => setSessionTopic(e.target.value)}
          />
        </div>
        
        <div className="booking-form-group">
          <label className="booking-label">Additional Notes (Optional)</label>
          <textarea
            className="booking-textarea"
            placeholder="Share any specific questions or information that will help your mentor prepare"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={4}
          />
        </div>
        
        {error && <div className="booking-error">{error}</div>}
        
        <div className="booking-actions">
          <button 
            className="booking-button-secondary"
            onClick={handlePrevStep}
          >
            Back
          </button>
          <button 
            className="booking-button-primary"
            onClick={handleNextStep}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const formattedDate = selectedDate ? selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';

    // Calculate mentor share and platform fee
    const mentorShare = sessionPrice * 0.8;
    const platformFee = sessionPrice * 0.2;

    return (
      <div className="booking-step-content">
        <h3 className="booking-step-title">Confirm Your Booking</h3>
        <p className="booking-step-description">
          Please review your session details before confirming.
        </p>
        
        <div className="booking-summary">
          <div className="booking-summary-item">
            <div className="booking-summary-label">Mentor</div>
            <div className="booking-summary-value">{mentor.name}</div>
          </div>
          
          <div className="booking-summary-item">
            <div className="booking-summary-label">Date & Time</div>
            <div className="booking-summary-value">
              {formattedDate} at {selectedTime}
            </div>
          </div>
          
          <div className="booking-summary-item">
            <div className="booking-summary-label">Session Type</div>
            <div className="booking-summary-value">{sessionType}</div>
          </div>
          
          <div className="booking-summary-item">
            <div className="booking-summary-label">Duration</div>
            <div className="booking-summary-value">{sessionDuration} minutes</div>
          </div>
          
          <div className="booking-summary-item">
            <div className="booking-summary-label">Topic</div>
            <div className="booking-summary-value">{sessionTopic}</div>
          </div>
          
          {additionalNotes && (
            <div className="booking-summary-item">
              <div className="booking-summary-label">Additional Notes</div>
              <div className="booking-summary-value">{additionalNotes}</div>
            </div>
          )}
          
          <div className="booking-summary-pricing">
            <div className="booking-summary-item">
              <div className="booking-summary-label">Session Fee</div>
              <div className="booking-summary-value booking-price">${sessionPrice.toFixed(2)}</div>
            </div>
            
            <div className="booking-summary-breakdown">
              <div className="booking-summary-item mentor-share">
                <div className="booking-summary-label">Mentor Share (80%)</div>
                <div className="booking-summary-value">${mentorShare.toFixed(2)}</div>
              </div>
              
              <div className="booking-summary-item platform-fee">
                <div className="booking-summary-label">Platform Fee (20%)</div>
                <div className="booking-summary-value">${platformFee.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="booking-terms">
          <p>By confirming this booking, you agree to Pathwaiz's <a href="/terms">Terms of Service</a> and <a href="/cancellation-policy">Cancellation Policy</a>.</p>
        </div>
        
        {error && <div className="booking-error">{error}</div>}
        
        {success ? (
          <div className="booking-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="booking-success-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3>Booking Created!</h3>
            <p>Redirecting to payment page...</p>
          </div>
        ) : (
          <div className="booking-actions">
            <button 
              className="booking-button-secondary"
              onClick={handlePrevStep}
              disabled={loading}
            >
              Back
            </button>
            <button 
              className="booking-button-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="booking-spinner"></span>
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="booking-form-container">
      {renderStepIndicator()}
      
      <div className="booking-form-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default BookingForm;
export { BookingForm };
