import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import './calendar/Calendar.css';
import { Availability, AvailabilityException, Booking } from '@/types/supabase';

const localizer = momentLocalizer(moment);

interface AvailabilityCalendarProps {
  mentorId: string;
  onBook: (startTime: string, endTime: string) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ mentorId, onBook }) => {
  const [events, setEvents] = useState<any[]>([]);
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

      const [
        { data: availabilityData, error: availabilityError },
        { data: exceptionData, error: exceptionError },
        { data: bookingData, error: bookingError },
      ] = await Promise.all([
        supabase
          .from('availabilities')
          .select('*')
          .eq('mentor_id', mentorId),
        supabase
          .from('availability_exceptions')
          .select('*')
          .eq('mentor_id', mentorId),
        supabase
          .from('bookings')
          .select('*')
          .eq('mentor_id', mentorId)
          .eq('mentee_id', user.id),
      ]);

      if (availabilityError) throw availabilityError;
      if (exceptionError) throw exceptionError;
      if (bookingError) throw bookingError;

      setAvailabilities(availabilityData || []);
      setAvailabilityExceptions(exceptionData || []);
      setBookings(bookingData || []);

      processData(availabilityData, exceptionData, bookingData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load availability. Please try again.');
      toast.error(err.message || 'Failed to load availability.');
    } finally {
      setLoading(false);
    }
  };

  const processData = (
    availabilityData: Availability[],
    exceptionData: AvailabilityException[],
    bookingData: Booking[]
  ) => {
    const eventsArray: any[] = [];

    // Process regular availabilities
    availabilityData.forEach(availability => {
      const { day_of_week, start_time, end_time } = availability;
      const day = moment().day(day_of_week).format('YYYY-MM-DD');
      const start = moment(`${day} ${start_time}`, 'YYYY-MM-DD HH:mm').toDate();
      const end = moment(`${day} ${end_time}`, 'YYYY-MM-DD HH:mm').toDate();

      eventsArray.push({
        start,
        end,
        title: 'Available',
        allDay: false,
        resource: { availabilityId: availability.id },
      });
    });

    // Process availability exceptions
    exceptionData.forEach(exception => {
      const { date, is_available, start_time, end_time } = exception;
      const start = moment(`${date} ${start_time}`, 'YYYY-MM-DD HH:mm').toDate();
      const end = moment(`${date} ${end_time}`, 'YYYY-MM-DD HH:mm').toDate();

      if (is_available) {
        eventsArray.push({
          start,
          end,
          title: 'Available',
          allDay: false,
          resource: { exceptionId: exception.id },
        });
      } else {
        eventsArray.push({
          start,
          end,
          title: 'Not Available',
          allDay: true,
          resource: { exceptionId: exception.id },
        });
      }
    });

    // Process bookings to block slots
    bookingData.forEach(booking => {
      const start = moment(booking.start_time).toDate();
      const end = moment(booking.end_time).toDate();

      eventsArray.push({
        start,
        end,
        title: 'Booked',
        allDay: false,
        resource: { bookingId: booking.id },
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
