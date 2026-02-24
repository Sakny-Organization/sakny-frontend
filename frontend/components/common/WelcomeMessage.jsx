import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { X, CheckCircle } from 'lucide-react';
import { clearWelcomeMessage } from '../../slices/authSlice';

const WelcomeMessage = () => {
    const dispatch = useDispatch();
    const { user, showWelcomeMessage } = useSelector((state) => state.auth);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (showWelcomeMessage && user) {
            setIsVisible(true);
            // Auto dismiss after 5 seconds
            const timer = setTimeout(() => {
                handleDismiss();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showWelcomeMessage, user]);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            dispatch(clearWelcomeMessage());
        }, 300);
    };

    if (!showWelcomeMessage || !user) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="fixed top-24 right-4 z-50 max-w-sm w-full"
                >
                    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-start p-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle size={20} className="text-green-600" />
                                </div>
                            </div>
                            <div className="flex-1 ml-3">
                                <p className="text-sm font-semibold text-gray-900">
                                    Welcome back{user.name ? `, ${user.name}` : ''}! 👋
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Glad to have you with us at Sakny
                                </p>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="h-1 bg-gray-100">
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: 5, ease: 'linear' }}
                                className="h-full bg-green-500"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeMessage;
