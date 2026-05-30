import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leading,
  trailing,
  block = false,
  ...props
}) => {
  const classes = ['ui-button', `ui-button--${variant}`, `ui-button--${size}`];

  if (block) {
    classes.push('ui-button--block');
  }

  if (className) {
    classes.push(className);
  }

  return (
    <motion.button
      type="button"
      className={classes.join(' ')}
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18 }}
      {...props}
    >
      {leading && <span className="ui-button__icon">{leading}</span>}
      <span>{children}</span>
      {trailing && <span className="ui-button__icon">{trailing}</span>}
    </motion.button>
  );
};

export default Button;