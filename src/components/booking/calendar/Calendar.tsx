import React, { useState, useEffect } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import './Calendar.css';

interface CalendarProps {
  mentorId: string;
  onTimeSelected: (date: Date, timeSlot: string) => void;
  availability?: any[];
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ mentorId, onTimeSelected, availability }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<Record<string, TimeSlot[]>>({});
  const [loading, setLoading] = useState(true);

  // Generate days for the current month view
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        
        // If we have availability passed as prop, use that
        if (availability && availability.length > 0) {
          processAvailabilityData(availability);
          return;
        }

        // Otherwise fetch from Supabase
        const { data, error } = await supabase
          .from('mentor_availability')
          .select('*')
          .eq('mentor_id', mentorId);

        if (error) throw error;

        if (!data || data.length === 0) {
          // If no data, use placeholder availability
          const placeholderAvailability = generatePlaceholderAvailability();
          processAvailabilityData(placeholderAvailability);
        } else {
          processAvailabilityData(data);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        // Use placeholder data on error
        const placeholderAvailability = generatePlaceholderAvailability();
        processAvailabilityData(placeholderAvailability);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [mentorId, availability]);

  const generatePlaceholderAvailability = () => {
    // Generate placeholder availability for the next 14 days
    const placeholderAvailability = [];
    const today = new Date();
    
    for (let i = 1; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const dateString = date.toISOString().split('T')[0];
      
      // Generate 3-5 random time slots for each day
      const numSlots = Math.floor(Math.random() * 3) + 3;
      const possibleTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
      const shuffled = [...possibleTimes].sort(() => 0.5 - Math.random());
      const selectedTimes = shuffled.slice(0, numSlots);
      
      selectedTimes.forEach(time => {
        placeholderAvailability.push({
          mentor_id: mentorId,
          date: dateString,
          time: time,
          available: true
        });
      });
    }
    
    return placeholderAvailability;
  };

  const processAvailabilityData = (data: any[]) => {
    const availabilityMap: Record<string, TimeSlot[]> = {};
    
    data.forEach(slot => {
      const dateKey = slot.date;
      if (!availabilityMap[dateKey]) {
        availabilityMap[dateKey] = [];
      }
      
      availabilityMap[dateKey].push({
        time: slot.time,
        available: slot.available
      });
    });
    
    setAvailableDates(availabilityMap);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    // Only allow selection if date has availability
    if (availableDates[dateString] && availableDates[dateString].length > 0) {
      setSelectedDate(date);
      setSelectedTimeSlot(null);
    }
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    
    if (selectedDate) {
      onTimeSelected(selectedDate, timeSlot);
    }
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const hasAvailability = availableDates[dateString] && availableDates[dateString].length > 0;
      
      const isSelected = selectedDate && 
                         selectedDate.getDate() === day && 
                         selectedDate.getMonth() === month && 
                         selectedDate.getFullYear() === year;
      
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      
      const className = `calendar-day ${hasAvailability ? 'available' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''}`;
      
      days.push(
        <div 
          key={day} 
          className={className}
          onClick={() => !isPast && handleDateClick(date)}
        >
          {day}
          {hasAvailability && <span className="availability-indicator"></span>}
        </div>
      );
    }
    
    return days;
  };

  const renderTimeSlots = () => {
    if (!selectedDate) return null;
    
    const dateString = selectedDate.toISOString().split('T')[0];
    const timeSlots = availableDates[dateString] || [];
    
    if (timeSlots.length === 0) {
      return <p className="no-slots-message">No available time slots for this date.</p>;
    }
    
    // Sort time slots chronologically
    timeSlots.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    
    return (
      <div className="time-slots-container">
        {timeSlots.map((slot, index) => (
          <button
            key={index}
            className={`time-slot ${selectedTimeSlot === slot.time ? 'selected' : ''} ${!slot.available ? 'unavailable' : ''}`}
            onClick={() => slot.available && handleTimeSlotClick(slot.time)}
            disabled={!slot.available}
          >
            {slot.time}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="spinner"></div>
        <p>Loading availability...</p>
      </div>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="booking-calendar-container">
      <div className="calendar-header">
        <button className="month-nav-button" onClick={handlePrevMonth}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="current-month">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button className="month-nav-button" onClick={handleNextMonth}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      <div className="calendar-days">
        {renderCalendarDays()}
      </div>
      
      {selectedDate && (
        <div className="time-slot-section">
          <h3 className="time-slot-heading">
            Available Times for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          {renderTimeSlots()}
        </div>
      )}
    </div>
  );
};

export default Calendar;
