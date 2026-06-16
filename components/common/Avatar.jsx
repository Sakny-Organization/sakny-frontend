import React from 'react';

const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  className = '',
  showOnlineStatus = false,
  isOnline = false
}) => {
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  const getBackgroundColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-teal-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
    '2xl': 'h-24 w-24 text-2xl',
  };

  const onlineStatusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size]} rounded-full border border-gray-200 object-cover shadow-sm`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} ${getBackgroundColor(name)} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}
        >
          {getInitials(name)}
        </div>
      )}
      {showOnlineStatus && (
        <div
          className={`absolute bottom-0 right-0 ${onlineStatusSizes[size]} ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          } border-2 border-white rounded-full`}
        />
      )}
    </div>
  );
};

export default Avatar;
