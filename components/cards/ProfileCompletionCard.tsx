import React from 'react';
import { User } from '../../types';
import { Check } from 'lucide-react';

interface ProfileCompletionCardProps {
  user: User;
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ user }) => {
  const steps = [
    { label: 'Basic info completed', completed: true },
    { label: 'Lifestyle & personality added', completed: true },
    { label: 'Add at least 3 preferred locations', completed: user.profileCompletion > 60 },
    { label: 'Upload apartment or room photos', completed: user.profileCompletion > 80 },
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const percentage = user.profileCompletion || 72;

  // Calculate SVG circle properties
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold text-black mb-6">Profile completion</h3>

      <div className="flex items-center gap-6 mb-6">
        {/* Circular Progress */}
        <div className="progress-circle relative" style={{ width: '80px', height: '80px' }}>
          <svg width="80" height="80">
            <circle
              className="progress-circle-bg"
              cx="40"
              cy="40"
              r={radius}
            />
            <circle
              className="progress-circle-fill"
              cx="40"
              cy="40"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="progress-circle-text">
            {percentage}%
          </div>
        </div>

        {/* Progress Text */}
        <div>
          <p className="text-sm text-gray-600">
            {completedSteps} of {steps.length} completed
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${step.completed
                ? 'bg-black border-black'
                : 'border-gray-300'
              }`}>
              {step.completed && <Check size={14} className="text-white" />}
            </div>
            <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCompletionCard;
