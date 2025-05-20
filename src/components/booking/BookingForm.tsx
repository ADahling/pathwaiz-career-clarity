import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CreditCard, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the form schema
const bookingFormSchema = z.object({
  sessionDate: z.string().min(1, { message: 'Please select a session date' }),
  sessionTime: z.string().min(1, { message: 'Please select a session time' }),
  duration: z.string().min(1, { message: 'Please select a session duration' }),
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters' }).max(100),
  notes: z.string().max(500, { message: 'Notes must be less than 500 characters' }).optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  mentorId: string;
  mentorName: string;
  hourlyRate: number;
  selectedDate?: Date;
  selectedTime?: string;
  onSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  mentorId,
  mentorName,
  hourlyRate,
  selectedDate,
  selectedTime,
  onSuccess,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      sessionDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
      sessionTime: selectedTime || '',
      duration: '60',
      topic: '',
      notes: '',
    },
  });

  // Calculate session cost based on duration and hourly rate
  const calculateCost = (duration: string) => {
    const durationInHours = parseInt(duration) / 60;
    return (durationInHours * hourlyRate).toFixed(2);
  };

  // Handle form submission
  const onSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // This is a placeholder implementation
      // In a real implementation, we would submit the booking to Supabase
      
      console.log('Booking submitted:', {
        mentorId,
        ...values,
        cost: calculateCost(values.duration),
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Booking Request Submitted',
        description: `Your session with ${mentorName} has been requested. Proceed to payment to confirm.`,
      });
      
      // Navigate to payment page or call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        // In a real implementation, we would navigate to the payment page with the booking ID
        navigate(`/payment?bookingId=placeholder-id&amount=${calculateCost(values.duration)}`);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit booking request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time slot options
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const period = hour < 12 ? 'AM' : 'PM';
        const formattedMinute = minute === 0 ? '00' : minute;
        const time = `${formattedHour}:${formattedMinute} ${period}`;
        const value = `${hour.toString().padStart(2, '0')}:${formattedMinute}`;
        slots.push({ label: time, value });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const selectedDuration = form.watch('duration');
  const sessionCost = calculateCost(selectedDuration || '60');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book a Session with {mentorName}</CardTitle>
        <CardDescription>
          Select your preferred date, time, and duration for the mentoring session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sessionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Date</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sessionTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Time</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot.value} value={slot.value}>
                                {slot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Duration</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes (${(hourlyRate * 0.5).toFixed(2)})</SelectItem>
                          <SelectItem value="60">60 minutes (${hourlyRate.toFixed(2)})</SelectItem>
                          <SelectItem value="90">90 minutes (${(hourlyRate * 1.5).toFixed(2)})</SelectItem>
                          <SelectItem value="120">120 minutes (${(hourlyRate * 2).toFixed(2)})</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="What would you like to discuss?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share any specific questions or topics you'd like to cover"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Session Cost:</span>
                <span className="text-lg font-bold">${sessionCost}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                You will be prompted to complete payment after submitting this booking request.
              </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-muted-foreground">
          By booking a session, you agree to Pathwaiz's Terms of Service and Cancellation Policy.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
