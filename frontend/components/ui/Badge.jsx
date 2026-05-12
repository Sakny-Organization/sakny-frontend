import React from 'react';

const Badge = ({ children, variant = 'neutral', className = '' }) => (
  <span className={`ui-badge ui-badge--${variant} ${className}`.trim()}>{children}</span>
);

export default Badge;