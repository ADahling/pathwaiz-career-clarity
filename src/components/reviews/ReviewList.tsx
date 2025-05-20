import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from './StarRating';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Review } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

interface ReviewListProps {
  mentorId: string;
  limit?: number;
  showLoadMore?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
  mentorId,
  limit = 5,
  showLoadMore = true,
}) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // This is a placeholder implementation
        // In a real implementation, we would fetch reviews from Supabase
        
        // Mock data for demonstration
        const mockReviews = [
          {
            id: '1',
            rating: 5,
            content: 'Excellent mentor! Provided valuable insights and practical advice for my career transition. Highly recommend!',
            created_at: '2025-04-15T14:30:00Z',
            mentee: {
              first_name: 'Alex',
              last_name: 'Johnson',
              avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            },
          },
          {
            id: '2',
            rating: 4,
            content: 'Very knowledgeable and helpful. Gave me great feedback on my resume and interview techniques.',
            created_at: '2025-04-10T09:15:00Z',
            mentee: {
              first_name: 'Taylor',
              last_name: 'Smith',
              avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
            },
          },
          {
            id: '3',
            rating: 5,
            content: 'Transformed my approach to job searching. The mentor was patient, understanding, and provided actionable steps.',
            created_at: '2025-04-05T16:45:00Z',
            mentee: {
              first_name: 'Jordan',
              last_name: 'Williams',
              avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
            },
          },
        ];
        
        // Simulate pagination
        const paginatedReviews = mockReviews.slice(0, page * limit);
        setReviews(paginatedReviews);
        setHasMore(paginatedReviews.length < mockReviews.length);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [mentorId, limit, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            What mentees are saying
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
        <CardDescription>
          What mentees are saying
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={review.mentee.avatar_url} />
                      <AvatarFallback>
                        {`${review.mentee.first_name[0]}${review.mentee.last_name[0]}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{`${review.mentee.first_name} ${review.mentee.last_name}`}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} readOnly size={16} />
                </div>
                <p className="text-sm">{review.content}</p>
                <div className="flex justify-end">
                  <Badge variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                    Helpful
                  </Badge>
                </div>
              </div>
            ))}
            
            {showLoadMore && hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMore}
                  className="text-sm text-primary hover:underline"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load more reviews'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewList;
