import React from 'react';
import { Review } from '../types';
import { Star, MessageSquareQuote } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <MessageSquareQuote size={48} className="mb-4 opacity-20" />
        <p>No specific reviews extracted from analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between px-2 mb-4">
        <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">
          Evidence: {reviews.length} Key Reviews Analyzed
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-sm truncate max-w-[120px]" title={review.author}>
                  {review.author || 'App Store User'}
                </span>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
            </div>
            
            {review.title && (
              <h4 className="font-bold text-gray-800 mb-2 text-sm leading-tight">
                {review.title}
              </h4>
            )}
            
            <p className="text-gray-600 text-sm leading-relaxed overflow-y-auto max-h-40 scrollbar-thin">
              "{review.content}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
