import React from 'react';
import { Feature } from '../types';
import { ThumbsUp, ThumbsDown, AlertCircle, Star } from 'lucide-react';

interface FeatureListProps {
  features: Feature[];
  type: 'LIKED' | 'DISLIKED';
}

export const FeatureList: React.FC<FeatureListProps> = ({ features, type }) => {
  const isLiked = type === 'LIKED';
  const Icon = isLiked ? ThumbsUp : ThumbsDown;
  const AccentIcon = isLiked ? Star : AlertCircle;
  const colorClass = isLiked ? 'text-green-600' : 'text-red-600';
  const bgClass = isLiked ? 'bg-green-50' : 'bg-red-50';
  const borderClass = isLiked ? 'border-green-100' : 'border-red-100';

  if (features.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Icon size={48} className="mb-4 opacity-20" />
        <p>No features found for this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className={`relative group bg-white rounded-xl p-6 shadow-sm border ${borderClass} hover:shadow-md transition-shadow duration-300 flex flex-col`}
        >
          <div className={`absolute top-4 right-4 p-2 rounded-full ${bgClass} ${colorClass} bg-opacity-50`}>
            <AccentIcon size={18} />
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-3 pr-8 leading-tight">
            {feature.title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
};
