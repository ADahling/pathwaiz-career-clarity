import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readOnly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 24,
  readOnly = false,
}) => {
  const handleClick = (index: number) => {
    if (readOnly) return;
    if (onRatingChange) {
      // If clicking the same star that's already selected, clear the rating
      onRatingChange(rating === index ? 0 : index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (readOnly) return;
    // This would be used for hover effects in a more advanced implementation
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={size}
          className={`cursor-${readOnly ? 'default' : 'pointer'} transition-colors ${
            index <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
        />
      ))}
    </div>
  );
};
