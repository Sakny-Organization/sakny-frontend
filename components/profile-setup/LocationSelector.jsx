import React, { useState, useMemo } from 'react';
import { governorates, citiesByGovernorate, getGovernorateName, getCityName } from '../../data/egyptLocations';
import { MapPin, X, ChevronDown, Plus } from 'lucide-react';

const LocationSelector = ({ selectedAreas = [], onChange, maxAreas = 5 }) => {
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [street, setStreet] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filteredCities = useMemo(() => {
    if (!selectedGovernorate) return [];
    return citiesByGovernorate[selectedGovernorate] || [];
  }, [selectedGovernorate]);

  const handleAddArea = () => {
    if (!selectedGovernorate || !selectedCity) return;
    
    const isDuplicate = selectedAreas.some(
      (a) => a.governorateId === selectedGovernorate && a.cityId === selectedCity
    );
    if (isDuplicate) return;

    const newArea = {
      governorateId: selectedGovernorate,
      cityId: selectedCity,
      governorateName: getGovernorateName(selectedGovernorate),
      cityName: getCityName(selectedCity),
      street: street.trim() || '',
    };

    onChange([...selectedAreas, newArea]);
    setSelectedGovernorate('');
    setSelectedCity('');
    setStreet('');
    setIsAdding(false);
  };

  const handleRemoveArea = (index) => {
    onChange(selectedAreas.filter((_, i) => i !== index));
  };

  return (
    <div className="location-selector">
      {/* Selected Areas List */}
      {selectedAreas.length > 0 && (
        <div className="selected-areas">
          {selectedAreas.map((area, index) => (
            <div key={`${area.governorateId}-${area.cityId}-${index}`} className="selected-area-tag">
              <MapPin size={14} />
              <span>
                {area.cityName}, {area.governorateName}
                {area.street && ` - ${area.street}`}
              </span>
              <button
                type="button"
                className="remove-area-btn"
                onClick={() => handleRemoveArea(index)}
                aria-label="Remove area"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Area Form */}
      {isAdding ? (
        <div className="add-area-form">
          {/* Governorate Select */}
          <div className="location-field">
            <label className="block text-sm font-semibold text-black mb-2">Governorate</label>
            <div className="select-wrapper">
              <select
                value={selectedGovernorate}
                onChange={(e) => {
                  setSelectedGovernorate(e.target.value);
                  setSelectedCity('');
                }}
                className="location-select"
              >
                <option value="">Select governorate...</option>
                {governorates.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {gov.nameEn}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          {/* City Select */}
          <div className="location-field">
            <label className="block text-sm font-semibold text-black mb-2">City / Area</label>
            <div className="select-wrapper">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="location-select"
                disabled={!selectedGovernorate}
              >
                <option value="">
                  {selectedGovernorate ? 'Select city...' : 'Select governorate first'}
                </option>
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.nameEn}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          {/* Optional Street */}
          <div className="location-field">
            <label className="block text-sm font-semibold text-black mb-2">
              Street <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="location-input"
              placeholder="Street name or landmark..."
            />
          </div>

          {/* Action buttons */}
          <div className="location-actions">
            <button
              type="button"
              className="pill-button active"
              onClick={handleAddArea}
              disabled={!selectedGovernorate || !selectedCity}
            >
              <Plus size={14} /> Add Area
            </button>
            <button
              type="button"
              className="pill-button"
              onClick={() => {
                setIsAdding(false);
                setSelectedGovernorate('');
                setSelectedCity('');
                setStreet('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        selectedAreas.length < maxAreas && (
          <button
            type="button"
            className="add-area-trigger"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={18} />
            <span>Add preferred area</span>
          </button>
        )
      )}

      {selectedAreas.length >= maxAreas && (
        <p className="text-xs text-gray-500 mt-2">Maximum of {maxAreas} areas reached.</p>
      )}
    </div>
  );
};

export default LocationSelector;
