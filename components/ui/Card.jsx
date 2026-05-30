import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverable = false, ...props }) => (
  <motion.div
    className={`ui-card ${hoverable ? 'ui-card--hoverable' : ''} ${className}`.trim()}
    whileHover={hoverable ? { y: -4 } : undefined}
    transition={{ duration: 0.22 }}
    {...props}
  >
    {children}
  </motion.div>
);

export default Card;