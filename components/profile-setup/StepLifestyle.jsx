import React from 'react';
import { motion } from 'framer-motion';

const smokingOptions = [
  { value: 'NON_SMOKER', label: 'Non-smoker', desc: 'I do not smoke at all' },
  { value: 'SOMETIMES', label: 'Sometimes', desc: 'I smoke occasionally' },
  { value: 'SMOKE_OFTEN', label: 'Smoke often', desc: 'I smoke regularly' },
];

const petsOptions = [
  { value: 'NO_PETS', label: 'No pets', desc: "I don't have any pets" },
  { value: 'HAVE_PETS', label: 'Have pets', desc: 'I have pets or plan to' },
];

const sleepOptions = [
  { value: 'EARLY_BIRD', label: 'Early bird', desc: 'I sleep early and wake early' },
  { value: 'NIGHT_OWL', label: 'Night owl', desc: 'I stay up late' },
  { value: 'FLEXIBLE', label: 'Flexible', desc: 'My schedule varies' },
];

const cleanlinessLabels = ['Very messy', 'A bit messy', 'Average', 'Clean', 'Very clean'];

const StepLifestyle = ({ data, onChange, errors = {} }) => {
  const cleanlinessValue = data.cleanliness || 3;

  const renderRadioGroup = (name, options, selectedValue, onSelect) => (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex flex-row items-start gap-3 p-4 border rounded-md cursor-pointer transition-all w-full ${
            selectedValue === option.value
              ? 'border-black bg-gray-50'
              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <input
            type="radio"
            name={name}
            checked={selectedValue === option.value}
            onChange={() => onSelect(option.value)}
            className="w-5 h-5 mt-0.5 cursor-pointer accent-black flex-shrink-0"
          />
          <div>
            <span className="text-base text-black font-medium leading-none">{option.label}</span>
            <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
          </div>
        </label>
      ))}
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
      <h2 className="step-title">Step 3. Lifestyle</h2>
      <p className="step-description">
        Tell us about your daily habits so we can find someone compatible.
      </p>

      {/* Smoking */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Smoking</label>
        {renderRadioGroup('smoking', smokingOptions, data.smoking, (val) =>
          onChange({ ...data, smoking: val })
        )}
        {errors.smoking && <p className="inline-error">{errors.smoking}</p>}
      </div>

      {/* Pets */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Pets</label>
        {renderRadioGroup('pets', petsOptions, data.pets, (val) =>
          onChange({ ...data, pets: val })
        )}
        {errors.pets && <p className="inline-error">{errors.pets}</p>}
      </div>

      {/* Sleep Schedule */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Sleep Schedule</label>
        {renderRadioGroup('sleepSchedule', sleepOptions, data.sleepSchedule, (val) =>
          onChange({ ...data, sleepSchedule: val })
        )}
        {errors.sleepSchedule && <p className="inline-error">{errors.sleepSchedule}</p>}
      </div>

      {/* Cleanliness Slider */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">
          Cleanliness Level
        </label>
        <div className="mt-3">
          <input
            type="range"
            min="1"
            max="5"
            value={cleanlinessValue}
            onChange={(e) => onChange({ ...data, cleanliness: parseInt(e.target.value) })}
            className="cleanliness-slider"
          />
          <div className="flex justify-between mt-2">
            {cleanlinessLabels.map((label, idx) => (
              <span
                key={label}
                className={`text-xs transition-all ${
                  cleanlinessValue === idx + 1
                    ? 'text-black font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StepLifestyle;
