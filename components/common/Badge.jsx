import React from 'react';
const Badge = ({ children, variant = 'neutral', className = '' }) => {
    const variants = {
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-yellow-100 text-yellow-800',
        neutral: 'bg-gray-100 text-gray-800',
    };
    return (<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>);
};
export default Badge;
