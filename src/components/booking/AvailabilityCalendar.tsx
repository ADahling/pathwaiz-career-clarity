
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enhancedSupabase } from '@/integrations/supabase/mockClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import './calendar/Calendar.css';
import { Availability, AvailabilityException, Booking } from '@/types/supabase';

const localizer = momentLocalizer(moment);

interface AvailabilityCalendarProps {
  mentorId: string;
  onBook: (startTime: string, endTime: string) => void;
}

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  allDay: boolean;
  resource: any;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ mentorId, onBook }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [availabilityExceptions, setAvailabilityExceptions] = useState<AvailabilityException[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [mentorId, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      if (!user) {
        setError('You must be logged in to view availability.');
        return;
      }

      // Fetch availability data
      const { data: availabilityData, error: availabilityError } = await enhancedSupabase
        .from('mentor_availability')
        .select('*')
        .eq('mentor_id', mentorId);

      if (availabilityError) throw availabilityError;

      // Fetch exceptions data
      const { data: exceptionData, error: exceptionError } = await enhancedSupabase
        .from('availability_exceptions')
        .select('*')
        .eq('mentor_id', mentorId);

      if (exceptionError) throw exceptionError;

      // Fetch existing bookings
      const { data: bookingData, error: bookingError } = await enhancedSupabase
        .from('bookings')
        .select('*')
        .eq('mentor_id', mentorId);

      if (bookingError) throw bookingError;

      // Process data into events
      if (availabilityData) {
        setAvailabilities(availabilityData as Availability[]);
      }
      
      if (exceptionData) {
        setAvailabilityExceptions(exceptionData as AvailabilityException[]);
      }
      
      if (bookingData) {
        setBookings(bookingData as Booking[]);
      }
      
      // Convert data to calendar events
      processData(
        availabilityData || [], 
        exceptionData || [], 
        bookingData || []
      );
      
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load availability. Please try again.');
      toast.error(err.message || 'Failed to load availability.');
    } finally {
      setLoading(false);
    }
  };

  const processData = (
    availabilityData: any[],
    exceptionData: any[],
    bookingData: any[]
  ) => {
    const eventsArray: CalendarEvent[] = [];

    // Process regular availabilities
    availabilityData.forEach(availability => {
      if (!availability.date || !availability.time) return;
      
      const dateStr = availability.date;
      const timeStr = availability.time;
      
      // Create a date object from the date and time strings
      const [hour, minute] = timeStr.split(':').map(Number);
      const start = new Date(dateStr);
      start.setHours(hour, minute);
      
      // End time is 1 hour after start
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      if (availability.available) {
        eventsArray.push({
          start,
          end,
          title: 'Available',
          allDay: false,
          resource: { availabilityId: availability.id }
        });
      }
    });

    // Process availability exceptions
    exceptionData.forEach(exception => {
      const { date, is_available, start_time, end_time } = exception;
      if (!start_time || !end_time) return;
      
      const startParts = start_time.split(':').map(Number);
      const endParts = end_time.split(':').map(Number);
      
      const start = new Date(date);
      start.setHours(startParts[0], startParts[1]);
      
      const end = new Date(date);
      end.setHours(endParts[0], endParts[1]);

      if (is_available) {
        eventsArray.push({
          start,
          end,
          title: 'Available',
          allDay: false,
          resource: { exceptionId: exception.id }
        });
      } else {
        eventsArray.push({
          start,
          end,
          title: 'Not Available',
          allDay: false,
          resource: { exceptionId: exception.id }
        });
      }
    });

    // Process bookings to block slots
    bookingData.forEach(booking => {
      if (!booking.date || !booking.time) return;
      
      const dateStr = booking.date;
      const timeStr = booking.time;
      
      // Create a date object from the date and time strings
      const [hour, minute] = timeStr.split(':').map(Number);
      const start = new Date(dateStr);
      start.setHours(hour, minute);
      
      // End time is based on duration (default to 1 hour)
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + (booking.duration || 60));

      eventsArray.push({
        start,
        end,
        title: 'Booked',
        allDay: false,
        resource: { bookingId: booking.id }
      });
    });

    setEvents(eventsArray);
  };

  const handleSelectSlot = (slotInfo: any) => {
    const start = moment(slotInfo.start).format();
    const end = moment(slotInfo.end).format();

    onBook(start, end);
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="spinner"></div>
        <p>Loading availability...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button
          className="calendar-retry-button"
          onClick={fetchData}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="availability-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        onSelectSlot={handleSelectSlot}
        style={{ height: 500 }}
      />
    </div>
  );
};

export default AvailabilityCalendar;
