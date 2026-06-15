import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const roommateTypeOptions = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'WORKING_PROFESSIONAL', label: 'Working Professional' },
  { value: 'DONT_MIND', label: "Don't Mind" },
];

const prefSmokingOptions = [
  { value: 'NON_SMOKER_ONLY', label: 'Non-smoker only' },
  { value: 'DONT_MIND', label: "Don't mind" },
];

const prefPetsOptions = [
  { value: 'OKAY_WITH_PETS', label: 'Okay with pets' },
  { value: 'NO_PETS_PREFERRED', label: 'No pets preferred' },
];

const prefSleepOptions = [
  { value: 'EARLY_BIRD', label: 'Early bird' },
  { value: 'NIGHT_OWL', label: 'Night owl' },
  { value: 'DONT_MIND', label: "Don't mind" },
];

const prefCleanlinessOptions = [
  { value: 'VERY_CLEAN', label: 'Very clean' },
  { value: 'AVERAGE_OR_ABOVE', label: 'Average or above' },
  { value: 'DONT_MIND', label: "Don't mind" },
];

const StepRoommatePrefs = ({ data, onChange, errors = {} }) => {
  const renderPillGroup = (options, selectedValue, onSelect) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        return (
          <button
            key={value}
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-all border ${
              selectedValue === value
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onClick={() => onSelect(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  return (
    <motion.div
      className="step-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="step-title">Step 6. Roommate Preferences</h2>
      <p className="step-description">
        Tell us what you're looking for in a roommate. These preferences help filter your matches.
      </p>

      {/* Roommate Gender - Auto set, info note */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Roommate Gender</label>
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <Info size={16} className="text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            {data.gender
              ? `You'll only be matched with ${data.gender} roommates — same gender matching is automatic.`
              : 'Set your gender in Step 1 to enable same-gender matching.'}
          </p>
        </div>
      </div>

      {/* Roommate Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Preferred Roommate Type</label>
        {renderPillGroup(roommateTypeOptions, data.roommateType, (val) =>
          onChange({ ...data, roommateType: val })
        )}
        {errors.roommateType && <p className="inline-error">{errors.roommateType}</p>}
      </div>

      {/* Preferred Smoking */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Smoking Preference</label>
        {renderPillGroup(prefSmokingOptions, data.prefSmoking, (val) =>
          onChange({ ...data, prefSmoking: val })
        )}
      </div>

      {/* Preferred Pets */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Pets Acceptance</label>
        {renderPillGroup(prefPetsOptions, data.prefPets, (val) =>
          onChange({ ...data, prefPets: val })
        )}
      </div>

      {/* Preferred Sleep */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Sleep Schedule Preference</label>
        {renderPillGroup(prefSleepOptions, data.prefSleepSchedule, (val) =>
          onChange({ ...data, prefSleepSchedule: val })
        )}
      </div>

      {/* Preferred Cleanliness */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Cleanliness Preference</label>
        {renderPillGroup(prefCleanlinessOptions, data.prefCleanliness, (val) =>
          onChange({ ...data, prefCleanliness: val })
        )}
      </div>

      {/* Additional preferences - free text */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">
          Additional Notes <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <textarea
          value={data.additionalNotes || ''}
          onChange={(e) => onChange({ ...data, additionalNotes: e.target.value })}
          placeholder="Any other preferences or things a roommate should know..."
          className="bio-textarea"
          rows={3}
          maxLength={300}
        />
        <p className="text-xs text-gray-500 mt-1">{(data.additionalNotes || '').length}/300 characters</p>
      </div>
    </motion.div>
  );
};

export default StepRoommatePrefs;
