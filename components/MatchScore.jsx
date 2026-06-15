import React from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import matchService from '../services/matchService';
import { premiumEase } from '../utils/animations';

const scoreTone = (value) => {
  if (value >= 90) return 'excellent';
  if (value >= 75) return 'strong';
  return 'good';
};

const MatchScore = ({ score = 0, breakdown = {}, compact = false, title = 'Compatibility score' }) => {
  const progress = Math.max(0, Math.min(score, 100));
  const radius = compact ? 30 : 42;
  const circumference = 2 * Math.PI * radius;
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [animatedScore, setAnimatedScore] = React.useState(0);
  const factorLabels = React.useMemo(() => {
    const labelMap = Object.fromEntries(matchService.getMatchFactors().map((factor) => [factor.key, factor.label]));
    return Object.entries(breakdown).map(([key, value]) => ({ key, label: labelMap[key] || key, value }));
  }, [breakdown]);

  useMotionValueEvent(rounded, 'change', (latest) => {
    setAnimatedScore(Math.round(latest));
  });

  React.useEffect(() => {
    const controls = animate(motionValue, progress, {
      duration: 0.9,
      ease: premiumEase,
    });

    return () => controls.stop();
  }, [motionValue, progress]);

  return (
    <div className={`match-score match-score--${compact ? 'compact' : 'full'} tone-${scoreTone(progress)}`}>
      <div className="match-score__summary">
        <div className="match-score__ring">
          <svg viewBox={`0 0 ${radius * 2 + 20} ${radius * 2 + 20}`}>
            <circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              className="match-score__track"
            />
            <motion.circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              className="match-score__progress"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
              transition={{ duration: 0.9, ease: premiumEase }}
            />
          </svg>
          <div className="match-score__value">
            <strong>{animatedScore}%</strong>
            {compact ? null : <span>match</span>}
          </div>
        </div>
        {!compact && (
          <div className="match-score__copy">
            <span className="match-score__eyebrow">{title}</span>
            <h3>{progress >= 90 ? 'Excellent alignment' : progress >= 75 ? 'Strong alignment' : 'Promising fit'}</h3>
            <p>Calculated from budget overlap, location preference, lifestyle, smoking, pets, and cleanliness.</p>
          </div>
        )}
      </div>

      {!compact && factorLabels.length > 0 && (
        <div className="match-score__breakdown">
          {factorLabels.map((factor) => (
            <div key={factor.key} className="match-score__factor">
              <div className="match-score__factor-head">
                <span>{factor.label}</span>
                <strong>{factor.value}%</strong>
              </div>
              <div className="match-score__factor-track">
                <motion.div
                  className="match-score__factor-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.value}%` }}
                  transition={{ duration: 0.7, ease: premiumEase }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchScore;