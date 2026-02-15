import React from 'react';

const BudgetRangeSlider = ({ min = 1000, max = 15000, step = 500, budgetMin, budgetMax, onChange }) => {
  const handleMinChange = (e) => {
    const val = parseInt(e.target.value);
    if (val <= budgetMax - step) {
      onChange({ budgetMin: val, budgetMax });
    }
  };

  const handleMaxChange = (e) => {
    const val = parseInt(e.target.value);
    if (val >= budgetMin + step) {
      onChange({ budgetMin, budgetMax: val });
    }
  };

  // Calculate fill bar percentages
  const minPercent = ((budgetMin - min) / (max - min)) * 100;
  const maxPercent = ((budgetMax - min) / (max - min)) * 100;

  return (
    <div className="budget-range-slider">
      <div className="budget-range-display">
        <div className="budget-range-value">
          <span className="budget-range-label">Min</span>
          <span className="budget-range-amount">{budgetMin.toLocaleString()} EGP</span>
        </div>
        <span className="budget-range-separator">—</span>
        <div className="budget-range-value">
          <span className="budget-range-label">Max</span>
          <span className="budget-range-amount">{budgetMax.toLocaleString()} EGP</span>
        </div>
      </div>

      <div className="dual-slider-container">
        <div className="slider-track">
          <div
            className="slider-fill"
            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={budgetMin}
          onChange={handleMinChange}
          className="dual-slider dual-slider-min"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={budgetMax}
          onChange={handleMaxChange}
          className="dual-slider dual-slider-max"
        />
      </div>

      <div className="slider-labels">
        <span>{min.toLocaleString()} EGP</span>
        <span>{max.toLocaleString()} EGP</span>
      </div>
    </div>
  );
};

export default BudgetRangeSlider;
