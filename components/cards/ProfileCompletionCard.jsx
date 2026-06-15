import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileCompletionCard = ({ user }) => {
    const navigate = useNavigate();

    const percentage = user?.profileCompletion ?? 0;
    const missingSteps = user?.missingSteps ?? [];

    const allSteps = [
        'Basic info (age & gender)',
        'Lifestyle (smoking, pets & sleep schedule)',
        'Personality traits',
        'Budget range',
        'At least one preferred location',
        'Roommate preferences',
        'Profile photo',
        'Contact verified',
        'ID Verification',
    ];

    const missingSet = new Set(missingSteps);
    const steps = allSteps.map((label) => {
        if (label === 'ID Verification') {
            return { label, completed: user?.isVerified === true };
        }
        if (label === 'Contact verified') {
            return { label, completed: user?.isEmailVerified === true || user?.isPhoneVerified === true };
        }
        return { label, completed: !missingSet.has(label) };
    });

    const completedCount = steps.filter((s) => s.completed).length;

    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-lg p-6 shadow-lg"
        >
            <h3 className="text-xl font-bold text-black mb-6">Profile completion</h3>

            <div className="flex items-center gap-6 mb-6">
                <motion.div
                    className="progress-circle relative"
                    style={{ width: 80, height: 80 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                    <svg width="80" height="80">
                        <circle className="progress-circle-bg" cx="40" cy="40" r={radius} />
                        <motion.circle
                            className="progress-circle-fill"
                            cx="40" cy="40" r={radius}
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                    </svg>
                    <div className="progress-circle-text">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                        >
                            {percentage}%
                        </motion.span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    <p className="text-sm font-semibold text-black">
                        {completedCount} of {steps.length} steps done
                    </p>
                    {missingSteps.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                            {missingSteps.length} step{missingSteps.length > 1 ? 's' : ''} remaining
                        </p>
                    )}
                </motion.div>
            </div>

            <div className="space-y-3">
                {steps.map((step, idx) => (
                    <motion.div
                        key={step.label}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.07, duration: 0.3 }}
                    >
                        <motion.div
                            className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                step.completed ? 'bg-black border-black' : 'border-gray-300'
                            }`}
                            whileHover={step.completed ? { scale: 1.1 } : {}}
                        >
                            {step.completed && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 + idx * 0.07, duration: 0.2 }}
                                >
                                    <Check size={14} className="text-white" />
                                </motion.div>
                            )}
                        </motion.div>
                        <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                        </span>
                    </motion.div>
                ))}
            </div>

            {missingSteps.length > 0 && (
                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                >
                    <button
                        onClick={() => navigate('/profile-setup', { state: { edit: true } })}
                        className="w-full py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Complete profile
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ProfileCompletionCard;
