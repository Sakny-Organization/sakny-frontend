import React from 'react';
import { motion } from 'framer-motion';
import BudgetRangeSlider from './BudgetRangeSlider';

const StepBudget = ({ data, onChange, errors = {} }) => {
  return (
    <motion.div
      className="step-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="step-title">Step 4. Budget</h2>
      <p className="step-description">
        Set your monthly budget range. We'll match you with roommates who share a similar range.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-4">
          Monthly Budget Range (EGP)
        </label>
        <BudgetRangeSlider
          min={500}
          max={20000}
          step={500}
          budgetMin={data.budgetMin || 2000}
          budgetMax={data.budgetMax || 6000}
          onChange={({ budgetMin, budgetMax }) =>
            onChange({ ...data, budgetMin, budgetMax })
          }
        />
        {errors.budget && <p className="inline-error">{errors.budget}</p>}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          <strong className="text-black">How it works:</strong> Your budget range is compared to other users' ranges.
          You'll be matched with roommates whose budget overlaps with yours, ensuring financial compatibility.
        </p>
      </div>
    </motion.div>
  );
};

export default StepBudget;
