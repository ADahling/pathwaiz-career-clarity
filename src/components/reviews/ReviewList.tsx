
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { StarRating } from './StarRating';
import { Review } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useApi } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReviewListProps {
  mentorId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ mentorId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { loading, error, execute } = useApi<Review[]>();
  const { user } = useAuth();
  const [newRating, setNewRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [mentorId]);

  const fetchReviews = async () => {
    const result = await execute(async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('mentor_id', mentorId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }, 'Failed to load reviews');

    if (result.data) {
      setReviews(result.data);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('You must be logged in to submit a review.');
      return;
    }

    if (!newRating) {
      toast.error('Please provide a rating.');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please provide a comment.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create a new review
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          mentor_id: mentorId,
          mentee_id: user.id,
          rating: newRating,
          comment: newComment,
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        setReviews([data[0], ...reviews]);
        setNewRating(null);
        setNewComment('');
        toast.success('Review submitted successfully!');
      }
    } catch (err: any) {
      console.error('Error submitting review:', err);
      toast.error(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderReviewForm = () => {
    if (!user) {
      return (
        <div className="p-4 bg-muted rounded-md text-center">
          <p>
            <a href="/auth" className="text-primary hover:underline">Log in</a> to submit a review.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 border rounded-md p-4">
        <h3 className="text-lg font-medium">Submit a Review</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Rating:</label>
          <StarRating rating={newRating || 0} onRatingChange={setNewRating} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Comment:</label>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your review here..."
            className="min-h-[120px]"
          />
        </div>
        <Button
          onClick={handleSubmitReview}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-destructive" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <p className="text-destructive font-medium mb-2">Error loading reviews</p>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={fetchReviews} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reviews</h2>
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-muted-foreground mb-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333a1.333 1.333 0 112.667 0v6.334a1.333 1.333 0 01-2.667 0v-6.334zM10 10a1 1 0 112 0v7a1 1 0 01-2 0v-7zM14 9.667a1.667 1.667 0 113.334 0v7.666a1.667 1.667 0 01-3.334 0v-7.666zM18 9.5a2.5 2.5 0 115 0v8a2.5 2.5 0 01-5 0v-8z" />
          </svg>
          <p className="text-muted-foreground mb-2">No reviews yet.</p>
          <p className="mb-4">Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="border rounded-md p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <StarRating rating={review.rating} readOnly />
                <span className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8">
        {renderReviewForm()}
      </div>
    </div>
  );
};

export default ReviewList;
