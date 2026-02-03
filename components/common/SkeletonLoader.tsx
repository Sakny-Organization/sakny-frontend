import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  circle?: boolean;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = 'w-full',
  height = 'h-4',
  circle = false,
  className = '',
}) => {
  return (
    <motion.div
      className={`
        ${width} ${height} 
        ${circle ? 'rounded-full' : 'rounded-md'}
        bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        ${className}
      `}
      style={{
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// Skeleton for card
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
    <SkeletonLoader height="h-48" />
    <div className="space-y-3">
      <SkeletonLoader height="h-4" width="w-3/4" />
      <SkeletonLoader height="h-4" width="w-1/2" />
      <SkeletonLoader height="h-10" />
    </div>
  </div>
);

// Skeleton for profile
export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-4">
    <SkeletonLoader width="w-20" height="h-20" circle />
    <SkeletonLoader height="h-6" width="w-1/3" />
    <div className="space-y-2">
      <SkeletonLoader height="h-4" />
      <SkeletonLoader height="h-4" width="w-5/6" />
    </div>
  </div>
);

export default SkeletonLoader;
