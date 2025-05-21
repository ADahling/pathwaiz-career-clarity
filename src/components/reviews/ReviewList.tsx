
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { StarRating } from './StarRating';
import { Review } from '@/types/supabase';
import { enhancedSupabase as mockSupabase } from '@/integrations/supabase/mockClient';

interface ReviewListProps {
  mentorId: string;
}

// Mock data for reviews since the 'reviews' table doesn't exist in Supabase yet
const mockReviews: Review[] = [
  {
    id: '1',
    mentor_id: 'mentor-1',
    mentee_id: 'mentee-1',
    rating: 5,
    comment: 'Excellent mentor! Very knowledgeable and supportive.',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    mentor_id: 'mentor-1',
    mentee_id: 'mentee-2',
    rating: 4,
    comment: 'Great session, learned a lot about the industry.',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  }
];

export const ReviewList: React.FC<ReviewListProps> = ({ mentorId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [newRating, setNewRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [mentorId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');

      // In a real implementation, we would fetch from Supabase
      // For now, use mock data filtered by mentor ID
      setTimeout(() => {
        const filteredReviews = mockReviews.filter(review => review.mentor_id === mentorId);
        setReviews(filteredReviews);
        setLoading(false);
      }, 800); // Simulate API delay
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
      setLoading(false);
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
      const newReview: Review = {
        id: `mock-${Date.now()}`,
        mentor_id: mentorId,
        mentee_id: user.id,
        rating: newRating,
        comment: newComment,
        created_at: new Date().toISOString()
      };

      // In a real implementation, we would insert to Supabase
      // For now, update the local state
      setTimeout(() => {
        setReviews([newReview, ...reviews]);
        setNewRating(null);
        setNewComment('');
        toast.success('Review submitted successfully!');
        setIsSubmitting(false);
      }, 800); // Simulate API delay
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Failed to submit review. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderReviewForm = () => {
    if (!user) {
      return (
        <div className="review-form-login-prompt">
          <p>
            <a href="/auth">Log in</a> to submit a review.
          </p>
        </div>
      );
    }

    return (
      <div className="review-form">
        <h3>Submit a Review</h3>
        <div className="review-form-rating">
          <label>Rating:</label>
          <StarRating rating={newRating || 0} onRatingChange={setNewRating} />
        </div>
        <div className="review-form-comment">
          <label>Comment:</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your review here..."
          />
        </div>
        <button
          onClick={handleSubmitReview}
          disabled={isSubmitting}
          className="review-form-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    );
  };

  return (
    <div className="review-list">
      <h2>Reviews</h2>
      {loading ? (
        <div className="review-loading">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="review-error">
          <p>{error}</p>
          <button onClick={fetchReviews}>Try Again</button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="review-empty">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="empty-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333a1.333 1.333 0 112.667 0v6.334a1.333 1.333 0 01-2.667 0v-6.334zM10 10a1 1 0 112 0v7a1 1 0 01-2 0v-7zM14 9.667a1.667 1.667 0 113.334 0v7.666a1.667 1.667 0 01-3.334 0v-7.666zM18 9.5a2.5 2.5 0 115 0v8a2.5 2.5 0 01-5 0v-8z" />
          </svg>
          <p>No reviews yet. Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="review-items">
          {reviews.map((review) => (
            <div className="review-item" key={review.id}>
              <div className="review-header">
                <StarRating rating={review.rating} readOnly />
                <span className="review-date">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
      {renderReviewForm()}
    </div>
  );
};

export default ReviewList;
