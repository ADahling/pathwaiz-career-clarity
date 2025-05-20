import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Availability, AvailabilityException, Booking } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Set up the localizer for the calendar
const localizer = momentLocalizer(moment);

// Define event types for the calendar
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  isAvailable?: boolean;
  isBooked?: boolean;
}

interface AvailabilityCalendarProps {
  mentorId: string;
  onTimeSlotSelect?: (start: Date, end: Date) => void;
  readOnly?: boolean;
  showBookedSlots?: boolean;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  mentorId,
  onTimeSlotSelect,
  readOnly = false,
  showBookedSlots = true,
}) => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch mentor availability and bookings
  useEffect(() => {
    const fetchAvailabilityAndBookings = async () => {
      setLoading(true);
      try {
        // This is a placeholder implementation
        // In a real implementation, we would fetch actual data from Supabase
        
        // Mock data for demonstration
        const mockAvailability: Availability[] = [
          {
            id: '1',
            mentor_id: mentorId,
            day_of_week: 1, // Monday
            start_time: '09:00:00',
            end_time: '12:00:00',
            is_recurring: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            mentor_id: mentorId,
            day_of_week: 1, // Monday
            start_time: '13:00:00',
            end_time: '17:00:00',
            is_recurring: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '3',
            mentor_id: mentorId,
            day_of_week: 3, // Wednesday
            start_time: '10:00:00',
            end_time: '15:00:00',
            is_recurring: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '4',
            mentor_id: mentorId,
            day_of_week: 5, // Friday
            start_time: '14:00:00',
            end_time: '18:00:00',
            is_recurring: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];

        const mockExceptions: AvailabilityException[] = [
          {
            id: '1',
            mentor_id: mentorId,
            exception_date: moment().add(2, 'days').format('YYYY-MM-DD'),
            is_available: false,
            start_time: null,
            end_time: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];

        const mockBookings: Booking[] = [
          {
            id: '1',
            mentor_id: mentorId,
            mentee_id: 'mock-mentee-id',
            start_time: moment().add(1, 'day').set('hour', 10).set('minute', 0).toISOString(),
            end_time: moment().add(1, 'day').set('hour', 11).set('minute', 0).toISOString(),
            duration: 60,
            status: 'confirmed',
            cancellation_reason: null,
            notes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];

        // Convert availability to calendar events
        const availabilityEvents = generateAvailabilityEvents(mockAvailability, mockExceptions);
        
        // Convert bookings to calendar events
        const bookingEvents = showBookedSlots ? mockBookings.map(booking => ({
          id: booking.id,
          title: 'Booked',
          start: new Date(booking.start_time),
          end: new Date(booking.end_time),
          isBooked: true,
        })) : [];

        // Combine all events
        setEvents([...availabilityEvents, ...bookingEvents]);
      } catch (error) {
        console.error('Error fetching availability and bookings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load availability. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilityAndBookings();
  }, [mentorId, showBookedSlots, toast]);

  // Generate availability events from recurring availability
  const generateAvailabilityEvents = (
    availability: Availability[],
    exceptions: AvailabilityException[]
  ): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const startDate = moment().startOf('week');
    const endDate = moment().add(4, 'weeks').endOf('week');

    // For each day in the range
    for (let day = moment(startDate); day.isBefore(endDate); day.add(1, 'day')) {
      const dayOfWeek = day.day(); // 0 = Sunday, 1 = Monday, etc.

      // Check if this day has an exception
      const exception = exceptions.find(
        e => moment(e.exception_date).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
      );

      // If there's an exception and it's not available, skip this day
      if (exception && !exception.is_available) continue;

      // Find availability for this day of the week
      const availableSlots = availability.filter(a => a.day_of_week === dayOfWeek);

      // Create events for each available slot
      availableSlots.forEach(slot => {
        const startTime = moment(slot.start_time, 'HH:mm:ss');
        const endTime = moment(slot.end_time, 'HH:mm:ss');

        const start = moment(day)
          .set('hour', startTime.hour())
          .set('minute', startTime.minute())
          .set('second', 0);

        const end = moment(day)
          .set('hour', endTime.hour())
          .set('minute', endTime.minute())
          .set('second', 0);

        // Only add future events
        if (start.isAfter(moment())) {
          events.push({
            id: `avail-${slot.id}-${start.format('YYYY-MM-DD')}`,
            title: 'Available',
            start: start.toDate(),
            end: end.toDate(),
            isAvailable: true,
          });
        }
      });
    }

    return events;
  };

  // Handle slot selection
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    if (readOnly) return;

    // Check if the selected slot is within an available time
    const isAvailable = events.some(event => 
      event.isAvailable && 
      moment(start).isSameOrAfter(moment(event.start)) && 
      moment(end).isSameOrBefore(moment(event.end))
    );

    if (!isAvailable) {
      toast({
        title: 'Unavailable Time',
        description: 'Please select an available time slot.',
        variant: 'destructive',
      });
      return;
    }

    // Check if the slot is already booked
    const isBooked = events.some(event => 
      event.isBooked && 
      (
        (moment(start).isBefore(moment(event.end)) && moment(end).isAfter(moment(event.start))) ||
        moment(start).isSame(moment(event.start))
      )
    );

    if (isBooked) {
      toast({
        title: 'Already Booked',
        description: 'This time slot is already booked.',
        variant: 'destructive',
      });
      return;
    }

    // If we're in mentor mode and not read-only, show dialog to add/remove availability
    if (userRole === 'mentor' && user?.id === mentorId) {
      setSelectedSlot({ start, end });
      setShowDialog(true);
    } 
    // If we're in mentee mode or using the component with onTimeSlotSelect, call the callback
    else if (onTimeSlotSelect) {
      onTimeSlotSelect(start, end);
    }
  };

  // Handle adding or removing availability
  const handleManageAvailability = async (action: 'add' | 'remove') => {
    if (!selectedSlot) return;
    
    setIsSubmitting(true);
    
    try {
      // This is a placeholder implementation
      // In a real implementation, we would update availability in Supabase
      
      if (action === 'add') {
        // Add new availability
        toast({
          title: 'Availability Added',
          description: `Added availability for ${moment(selectedSlot.start).format('MMMM D, YYYY h:mm A')} to ${moment(selectedSlot.end).format('h:mm A')}`,
        });
        
        // Add to local state for immediate feedback
        setEvents([
          ...events,
          {
            id: `avail-new-${Date.now()}`,
            title: 'Available',
            start: selectedSlot.start,
            end: selectedSlot.end,
            isAvailable: true,
          }
        ]);
      } else {
        // Remove availability
        toast({
          title: 'Availability Removed',
          description: `Removed availability for ${moment(selectedSlot.start).format('MMMM D, YYYY h:mm A')} to ${moment(selectedSlot.end).format('h:mm A')}`,
        });
        
        // Remove from local state for immediate feedback
        setEvents(events.filter(event => 
          !(event.isAvailable && 
            moment(event.start).isSame(moment(selectedSlot.start)) && 
            moment(event.end).isSame(moment(selectedSlot.end))
          )
        ));
      }
    } catch (error) {
      console.error('Error managing availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to update availability. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setShowDialog(false);
      setSelectedSlot(null);
    }
  };

  // Custom event styling
  const eventStyleGetter = (event: CalendarEvent) => {
    let style: React.CSSProperties = {
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      textAlign: 'center',
    };
    
    if (event.isAvailable) {
      style.backgroundColor = '#4A90E2';
    } else if (event.isBooked) {
      style.backgroundColor = '#F5A623';
    }
    
    return { style };
  };

  return (
    <Card>
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="h-96">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              selectable={!readOnly}
              onSelectSlot={handleSelectSlot}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day']}
              defaultView="week"
              step={30}
              timeslots={2}
            />
          </div>
        )}
        
        {/* Dialog for managing availability */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Availability</DialogTitle>
            </DialogHeader>
            
            {selectedSlot && (
              <div className="py-4">
                <p className="text-center mb-4">
                  {moment(selectedSlot.start).format('MMMM D, YYYY')}
                  <br />
                  {moment(selectedSlot.start).format('h:mm A')} - {moment(selectedSlot.end).format('h:mm A')}
                </p>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={() => handleManageAvailability('add')}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Add Availability
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleManageAvailability('remove')}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Remove Availability
                  </Button>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="secondary" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;
