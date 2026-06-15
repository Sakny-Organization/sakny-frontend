import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';

const defaultTraits = [
  'Calm', 'Social', 'Introvert', 'Extrovert', 'Organized',
  'Spontaneous', 'Homebody', 'Often out', 'Talkative', 'Quiet',
];

const StepPersonality = ({ data, onChange, errors = {} }) => {
  const [customTraitInput, setCustomTraitInput] = useState('');

  const selectedTraits = data.personality || [];
  const customTraits = data.customPersonalityTraits || [];
  const allSelected = [...selectedTraits];

  const toggleTrait = (trait) => {
    if (selectedTraits.includes(trait)) {
      onChange({
        ...data,
        personality: selectedTraits.filter((t) => t !== trait),
      });
    } else {
      onChange({
        ...data,
        personality: [...selectedTraits, trait],
      });
    }
  };

  const addCustomTrait = () => {
    const trimmed = customTraitInput.trim();
    if (!trimmed) return;
    if (allSelected.includes(trimmed) || customTraits.includes(trimmed)) return;

    onChange({
      ...data,
      personality: [...selectedTraits, trimmed],
      customPersonalityTraits: [...customTraits, trimmed],
    });
    setCustomTraitInput('');
  };

  const removeCustomTrait = (trait) => {
    onChange({
      ...data,
      personality: selectedTraits.filter((t) => t !== trait),
      customPersonalityTraits: customTraits.filter((t) => t !== trait),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTrait();
    }
  };

  return (
    <motion.div
      className="step-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="step-title">Step 2. Personality</h2>
      <p className="step-description">
        Pick the traits that describe you. This helps us find roommates who complement you.
      </p>

      {/* Default trait pills */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-3">
          Select your personality traits
        </label>
        <div className="flex flex-wrap gap-2">
          {defaultTraits.map((trait) => (
            <button
              key={trait}
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-all border ${
                selectedTraits.includes(trait)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => toggleTrait(trait)}
            >
              {trait}
            </button>
          ))}
        </div>
        {errors.personality && <p className="inline-error">{errors.personality}</p>}
      </div>

      {/* Custom traits */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">
          Add your own traits <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="custom-tag-input">
          <div className="flex gap-2">
            <input
              type="text"
              value={customTraitInput}
              onChange={(e) => setCustomTraitInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a trait and press Enter..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-black transition-colors"
              maxLength={30}
            />
            <button
              type="button"
              onClick={addCustomTrait}
              disabled={!customTraitInput.trim()}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>

        {/* Custom trait tags */}
        {customTraits.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {customTraits.map((trait) => (
              <span
                key={trait}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 text-black border border-gray-200"
              >
                {trait}
                <button
                  type="button"
                  onClick={() => removeCustomTrait(trait)}
                  className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        Selected: {allSelected.length} trait{allSelected.length !== 1 ? 's' : ''}
      </p>
    </motion.div>
  );
};

export default StepPersonality;
