import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSavedProfile } from '../slices/savedSlice';

const SaveButton = ({ profileId, iconOnly = true, className = '', showLabel = false }) => {
  const dispatch = useDispatch();
  const savedIds = useSelector((state) => state.saved.ids);
  const isSaved = savedIds.includes(profileId);

  const handleClick = (event) => {
    event.stopPropagation();
    dispatch(toggleSavedProfile(profileId));
  };

  return (
    <motion.button
      type="button"
      className={`save-button ${iconOnly ? 'save-button--icon' : 'save-button--pill'} ${isSaved ? 'is-saved' : ''} ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18 }}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved profiles' : 'Save profile'}
    >
      <motion.span
        initial={false}
        animate={{ scale: isSaved ? [1, 1.18, 1] : 1 }}
        transition={{ duration: 0.28 }}
      >
        <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
      </motion.span>
      {(showLabel || !iconOnly) && <span>{isSaved ? 'Saved' : 'Save'}</span>}
    </motion.button>
  );
};

export default SaveButton;