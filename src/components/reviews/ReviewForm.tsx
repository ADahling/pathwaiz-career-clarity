
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { StarRating } from './StarRating';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define the form schema
const reviewFormSchema = z.object({
  rating: z.number().min(1, { message: 'Please select a rating' }).max(5),
  comment: z.string().min(10, { message: 'Review must be at least 10 characters' }).max(500, { message: 'Review must be less than 500 characters' }),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  bookingId: string;
  mentorId: string;
  mentorName: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookingId,
  mentorId,
  mentorName,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: ReviewFormValues) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to submit a review",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit the review to Supabase
      const { error } = await supabase
        .from('reviews')
        .insert({
          mentor_id: mentorId,
          mentee_id: user.id,
          rating: values.rating,
          comment: values.comment,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Review Submitted',
        description: `Thank you for reviewing your session with ${mentorName}.`,
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate Your Session</CardTitle>
          <CardDescription>
            You need to be logged in to leave a review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <a href="/auth">Log In</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rate Your Session</CardTitle>
        <CardDescription>
          Share your experience with {mentorName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                      size={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience and feedback..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground text-center">
        Your review helps other mentees find the right mentor for their needs.
      </CardFooter>
    </Card>
  );
};

export default ReviewForm;
