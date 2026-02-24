import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import { governorates, citiesByGovernorate } from '../../data/egyptLocations';
import { ChevronDown, Camera, User } from 'lucide-react';

const occupationOptions = ['Student', 'Working professional', 'Freelancer', 'Other'];

const StepBasics = ({ data, onChange, errors = {} }) => {
  const [showCustomOccupation, setShowCustomOccupation] = useState(
    data.occupation && !occupationOptions.slice(0, 3).includes(data.occupation)
  );

  // Local state for avatar preview
  const [avatarPreview, setAvatarPreview] = useState(data.avatar || '');

  const filteredCities = useMemo(() => {
    if (!data.currentGovernorate) return [];
    return citiesByGovernorate[data.currentGovernorate] || [];
  }, [data.currentGovernorate]);

  const handleOccupationSelect = (option) => {
    if (option === 'Other') {
      setShowCustomOccupation(true);
      onChange({ ...data, occupation: '' });
    } else {
      setShowCustomOccupation(false);
      onChange({ ...data, occupation: option });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        onChange({ ...data, avatar: reader.result });
      };
      reader.readAsDataURL(file);
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
      <h2 className="step-title">Step 1. Basics</h2>
      <p className="step-description">
        Fill in a bit about yourself. This helps us show your profile correctly and calculate better matches.
      </p>

      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-gray-400 mt-7 mx-auto" />
            )}
          </div>
          <label
            htmlFor="avatar-upload-step"
            className="absolute bottom-0 right-0 w-9 h-9 bg-black rounded-full flex items-center justify-center cursor-pointer border-2 border-white hover:bg-gray-800 transition-colors"
          >
            <Camera size={18} className="text-white" />
          </label>
          <input
            id="avatar-upload-step"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">Upload a profile photo</p>
      </div>

      {/* Age */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">
          Age <span className="text-gray-500 font-normal">Required</span>
        </label>
        <Input
          type="number"
          min="18"
          max="100"
          value={data.age}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (isNaN(val)) {
              onChange({ ...data, age: '' });
            } else if (val >= 0 && val <= 100) {
              onChange({ ...data, age: val.toString() });
            }
          }}
          placeholder="24"
          error={errors.age}
        />
        <p className="text-xs text-gray-500 leading-relaxed mt-2">You must be at least 18 years old.</p>
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">
          Gender <span className="text-gray-500 font-normal">Required</span>
        </label>
        <div className="flex flex-col gap-2">
          {['Male', 'Female'].map((option) => (
            <label
              key={option}
              className="flex flex-row items-center gap-3 p-4 border border-gray-200 rounded-md cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 has-[:checked]:border-black has-[:checked]:bg-gray-50 w-full"
            >
              <input
                type="radio"
                name="gender"
                checked={data.gender === option}
                onChange={() => onChange({ ...data, gender: option })}
                className="w-5 h-5 m-0 cursor-pointer accent-black"
              />
              <span className="text-base text-black leading-none">{option}</span>
            </label>
          ))}
        </div>
        {errors.gender && <p className="inline-error">{errors.gender}</p>}
        <p className="text-xs text-gray-500 leading-relaxed mt-2">
          We match you with roommates of the same gender only.
        </p>
      </div>

      {/* Occupation */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Occupation</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {occupationOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-all border ${
                (option === 'Other' && showCustomOccupation) ||
                (option !== 'Other' && data.occupation === option)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => handleOccupationSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {showCustomOccupation && (
          <Input
            type="text"
            value={data.occupation === 'Other' ? '' : data.occupation}
            onChange={(e) => onChange({ ...data, occupation: e.target.value })}
            placeholder="e.g. Pharmacy student, Freelance designer..."
          />
        )}

        {/* Conditional: University/School for Student, Company for Working/Freelancer */}
        {data.occupation === 'Student' && (
          <div className="mt-3">
            <Input
              type="text"
              value={data.universityOrSchool || ''}
              onChange={(e) => onChange({ ...data, universityOrSchool: e.target.value })}
              placeholder="University or school name (optional)"
            />
          </div>
        )}
        {(data.occupation === 'Working professional' || data.occupation === 'Freelancer') && (
          <div className="mt-3">
            <Input
              type="text"
              value={data.companyName || ''}
              onChange={(e) => onChange({ ...data, companyName: e.target.value })}
              placeholder="Company name (optional)"
            />
          </div>
        )}
      </div>

      {/* Current Location - Governorate + City */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Current Location</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="select-wrapper">
            <select
              value={data.currentGovernorate || ''}
              onChange={(e) => onChange({ ...data, currentGovernorate: e.target.value, currentCity: '' })}
              className="location-select"
            >
              <option value="">Governorate...</option>
              {governorates.map((gov) => (
                <option key={gov.id} value={gov.id}>{gov.nameEn}</option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
          <div className="select-wrapper">
            <select
              value={data.currentCity || ''}
              onChange={(e) => onChange({ ...data, currentCity: e.target.value })}
              className="location-select"
              disabled={!data.currentGovernorate}
            >
              <option value="">{data.currentGovernorate ? 'City...' : 'Select governorate first'}</option>
              {filteredCities.map((city) => (
                <option key={city.id} value={city.id}>{city.nameEn}</option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>
      </div>

      {/* Bio / About Me */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">
          Bio / About Me <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <textarea
          value={data.bio || ''}
          onChange={(e) => onChange({ ...data, bio: e.target.value })}
          placeholder="Tell potential roommates a bit about yourself, your daily routine, hobbies..."
          className="bio-textarea"
          rows={3}
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{(data.bio || '').length}/500 characters</p>
      </div>

      {/* Social Links */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">
          Social Links <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="flex flex-col gap-3">
          <Input
            type="text"
            value={data.socialLinks?.instagram || ''}
            onChange={(e) =>
              onChange({
                ...data,
                socialLinks: { ...data.socialLinks, instagram: e.target.value },
              })
            }
            placeholder="Instagram username"
            icon={<span className="text-gray-400 text-sm">@</span>}
          />
          <Input
            type="text"
            value={data.socialLinks?.linkedin || ''}
            onChange={(e) =>
              onChange({
                ...data,
                socialLinks: { ...data.socialLinks, linkedin: e.target.value },
              })
            }
            placeholder="LinkedIn profile URL"
          />
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mt-2">
          Optional — helps roommates connect with you.
        </p>
      </div>
    </motion.div>
  );
};

export default StepBasics;
