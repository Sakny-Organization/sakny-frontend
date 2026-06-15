import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
const ProfileCompletionCard = ({ user }) => {
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
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.320, 1] }} whileHover={{ y: -4 }} className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold text-black mb-6">Profile completion</h3>

      <div className="flex items-center gap-6 mb-6">
        {/* Circular Progress */}
        <motion.div className="progress-circle relative" style={{ width: '80px', height: '80px' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: [0.23, 1, 0.320, 1] }}>
          <svg width="80" height="80">
            <circle className="progress-circle-bg" cx="40" cy="40" r={radius}/>
            <motion.circle className="progress-circle-fill" cx="40" cy="40" r={radius} strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.5, ease: "easeOut" }}/>
          </svg>
          <div className="progress-circle-text">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.3 }}>
              {percentage}%
            </motion.span>
          </div>
        </motion.div>

        {/* Progress Text */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
          <p className="text-sm text-gray-600">
            {completedSteps} of {steps.length} completed
          </p>
        </motion.div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {steps.map((step, idx) => (<motion.div key={idx} className="flex items-start gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.1, duration: 0.3 }}>
            <motion.div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${step.completed
                ? 'bg-black border-black'
                : 'border-gray-300'}`} whileHover={step.completed ? { scale: 1.1 } : {}}>
              {step.completed && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + idx * 0.1, duration: 0.2 }}>
                  <Check size={14} className="text-white"/>
                </motion.div>)}
            </motion.div>
            <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </motion.div>))}
      </div>
    </motion.div>);
};
export default ProfileCompletionCard;
