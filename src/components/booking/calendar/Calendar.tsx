import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import './Calendar.css';

interface CalendarProps {
  mentorId: string;
  onTimeSelected: (date: Date, time: string) => void;
  availability?: any[];
}

const Calendar: React.FC<CalendarProps> = ({ mentorId, onTimeSelected, availability }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Calculate total days to show (previous month days + current month days)
    const totalDays = daysFromPrevMonth + lastDay.getDate();
    
    // Calculate rows needed (7 days per row)
    const rows = Math.ceil(totalDays / 7);
    
    // Generate calendar days
    const days = [];
    let dayCount = 1 - daysFromPrevMonth;
    
    for (let i = 0; i < rows * 7; i++) {
      const date = new Date(year, month, dayCount);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = isCurrentMonth && date.toDateString() === new Date().toDateString();
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      
      days.push({
        date,
        dayOfMonth: date.getDate(),
        isCurrentMonth,
        isToday,
        isPast
      });
      
      dayCount++;
    }
    
    return days;
  };
  
  // Fetch available times for the selected date
  const fetchAvailableTimes = async (date: Date) => {
    setLoading(true);
    
    try {
      // Format date for database query
      const formattedDate = date.toISOString().split('T')[0];
      
      // If availability is provided as a prop, use it
      if (availability) {
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
        const dayAvailability = availability.find(a => a.day === dayOfWeek);
        
        if (dayAvailability) {
          setAvailableTimes(dayAvailability.slots);
        } else {
          setAvailableTimes([]);
        }
      } else {
        // Otherwise fetch from Supabase
        const { data, error } = await supabase
          .from('mentor_availability')
          .select('time')
          .eq('mentor_id', mentorId)
          .eq('date', formattedDate)
          .eq('available', true);
          
        if (error) throw error;
        
        if (data) {
          setAvailableTimes(data.map(slot => slot.time));
        } else {
          setAvailableTimes([]);
        }
      }
    } catch (error) {
      console.error('Error fetching available times:', error);
      setAvailableTimes([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle date selection
  const handleDateClick = (day: any) => {
    if (day.isPast || !day.isCurrentMonth) return;
    
    setSelectedDate(day.date);
    setSelectedTime(null);
    fetchAvailableTimes(day.date);
  };
  
  // Handle time selection
  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    
    if (selectedDate) {
      onTimeSelected(selectedDate, time);
    }
  };
  
  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Render calendar header
  const renderHeader = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return (
      <div className="calendar-header">
        <button 
          className="calendar-nav-button"
          onClick={handlePrevMonth}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="calendar-title">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button 
          className="calendar-nav-button"
          onClick={handleNextMonth}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };
  
  // Render weekday labels
  const renderWeekdays = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="calendar-weekdays">
        {weekdays.map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
      </div>
    );
  };
  
  // Render calendar days
  const renderDays = () => {
    const days = generateCalendarDays();
    
    return (
      <div className="calendar-days">
        {days.map((day, index) => (
          <div 
            key={index}
            className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${day.isPast ? 'past' : ''} ${selectedDate && day.date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
            onClick={() => handleDateClick(day)}
          >
            {day.dayOfMonth}
          </div>
        ))}
      </div>
    );
  };
  
  // Render available times
  const renderTimes = () => {
    if (!selectedDate) {
      return (
        <div className="calendar-times-message">
          Please select a date to view available times.
        </div>
      );
    }
    
    if (loading) {
      return (
        <div className="calendar-times-loading">
          <div className="calendar-spinner"></div>
          <p>Loading available times...</p>
        </div>
      );
    }
    
    if (availableTimes.length === 0) {
      return (
        <div className="calendar-times-message">
          No available times for this date. Please select another date.
        </div>
      );
    }
    
    return (
      <div className="calendar-times-grid">
        {availableTimes.map(time => (
          <div 
            key={time}
            className={`calendar-time ${selectedTime === time ? 'selected' : ''}`}
            onClick={() => handleTimeClick(time)}
          >
            {time}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="calendar-container">
      <div className="calendar-grid">
        {renderHeader()}
        {renderWeekdays()}
        {renderDays()}
      </div>
      
      <div className="calendar-times">
        <h4 className="calendar-times-title">
          {selectedDate ? `Available Times for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}` : 'Available Times'}
        </h4>
        {renderTimes()}
      </div>
    </div>
  );
};

export default Calendar;
