import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import SkeletonCard from '../SkeletonCard';

const PropertyGrid = ({ properties, loading = false, emptyState = null, ...cardProps }) => {
  if (loading) {
    return (
      <div className="property-grid">
        {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
      </div>
    );
  }

  if (!properties.length) {
    return emptyState;
  }

  return (
    <motion.div className="property-grid" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.08 } } }}>
      <AnimatePresence>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} {...cardProps} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default PropertyGrid;