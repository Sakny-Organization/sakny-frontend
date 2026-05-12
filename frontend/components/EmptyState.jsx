import React from 'react';
import { motion } from 'framer-motion';
import Button from './common/Button';
import { scaleIn } from '../utils/animations';

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
  className = '',
}) => {
  return (
    <motion.div
      className={`empty-panel ${className}`}
      initial={scaleIn.initial}
      animate={scaleIn.animate}
      exit={scaleIn.exit}
      transition={scaleIn.transition}
    >
      <div className="empty-panel__icon">{icon}</div>
      <h3 className="empty-panel__title">{title}</h3>
      <p className="empty-panel__description">{description}</p>
      {(actionLabel || secondaryAction) && (
        <div className="empty-panel__actions">
          {actionLabel && onAction && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryAction}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;