import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';
const PageTransition = ({ children, delay = 0 }) => {
    return (<motion.div initial={pageTransition.initial} animate={pageTransition.animate} exit={pageTransition.exit} transition={{ ...pageTransition.transition, delay }}>
      {children}
    </motion.div>);
};
export default PageTransition;
