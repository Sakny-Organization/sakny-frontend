import React from 'react';
import { motion } from 'framer-motion';
import LocationSelector from './LocationSelector';

const StepLocation = ({ data, onChange, errors = {} }) => {
  return (
    <motion.div
      className="step-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="step-title">Step 5. Preferred Location</h2>
      <p className="step-description">
        Where would you like to live? Add up to 5 areas you'd consider for shared housing.
      </p>

      <div className="mb-6">
        <LocationSelector
          selectedAreas={data.preferredAreas || []}
          onChange={(areas) => onChange({ ...data, preferredAreas: areas })}
          maxAreas={5}
        />
        {errors.preferredAreas && <p className="inline-error">{errors.preferredAreas}</p>}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          <strong className="text-black">Tip:</strong> Adding multiple areas increases your chances
          of finding compatible roommates. You can be as specific as a street or as broad as a governorate.
        </p>
      </div>
    </motion.div>
  );
};

export default StepLocation;
