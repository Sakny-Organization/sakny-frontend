import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

interface PageTransitionProps {
  children: React.ReactNode;
  delay?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  delay = 0
}) => {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={{ ...pageTransition.transition, delay }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
