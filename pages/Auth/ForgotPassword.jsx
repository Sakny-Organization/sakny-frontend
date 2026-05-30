import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OTPInput from '../../components/common/OTPInput';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import apiService from '../../services/api';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

const RESEND_COOLDOWN = 60;

const detectChannel = (value) => {
    const phoneRegex = /^(\+20|0020|0)?1[0125][0-9]{8}$/;
    const stripped = value.replace(/\s/g, '');
    return phoneRegex.test(stripped) ? 'PHONE' : 'EMAIL';
};

const maskContact = (value, channel) => {
    if (!value) return '';
    if (channel === 'PHONE') {
        return value.slice(0, 4) + '****' + value.slice(-3);
    }
    const [local, domain] = value.split('@');
    const masked = local.length <= 3 ? local[0] + '***' : local.slice(0, 3) + '***';
    return masked + '@' + domain;
};

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState('identify'); // 'identify' | 'reset' | 'done'
    const [identifier, setIdentifier] = useState('');
    const [channel, setChannel] = useState('EMAIL');
    const [identifierError, setIdentifierError] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleIdentifierChange = (e) => {
        const val = e.target.value;
        setIdentifier(val);
        setIdentifierError('');
        if (val) setChannel(detectChannel(val));
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!identifier.trim()) {
            setIdentifierError('Please enter your email or phone number.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await apiService.sendOtp({ identifier: identifier.trim(), channel, purpose: 'PASSWORD_RESET' });
            setStep('reset');
            setCooldown(RESEND_COOLDOWN);
        } catch (err) {
            setError(err.message || 'Failed to send code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setError('');
        setLoading(true);
        try {
            await apiService.sendOtp({ identifier: identifier.trim(), channel, purpose: 'PASSWORD_RESET' });
            setCooldown(RESEND_COOLDOWN);
        } catch (err) {
            setError(err.message || 'Failed to resend code.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (!otpCode || otpCode.length < 6) {
            setError('Please enter the 6-digit code.');
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await apiService.resetPassword({
                identifier: identifier.trim(),
                code: otpCode,
                channel,
                newPassword,
            });
            setStep('done');
            setTimeout(() => navigate('/login', { state: { resetSuccess: true } }), 2000);
        } catch (err) {
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'done') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: 440, margin: '6rem auto', textAlign: 'center', padding: '0 1rem' }}
            >
                <CheckCircle size={56} style={{ color: '#16a34a', margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Password Reset!</h2>
                <p style={{ color: 'var(--color-gray-500)' }}>Taking you to login…</p>
            </motion.div>
        );
    }

    return (
        <div className="min-h-[80vh] flex flex-col justify-center py-12 bg-gray-50">
            <div className="container-sm mx-auto px-4">
                <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Login
                </Link>

                <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">Forgot password?</h1>
                        <p className="text-gray-600 text-sm">
                            {step === 'identify'
                                ? "Enter your email or phone and we'll send you a reset code."
                                : `Enter the 6-digit code sent to ${maskContact(identifier.trim(), channel)}`}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'identify' && (
                            <motion.form
                                key="identify"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleSendCode}
                                className="space-y-5"
                            >
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-900">Email or phone</label>
                                    <Input
                                        name="identifier"
                                        type="text"
                                        value={identifier}
                                        onChange={handleIdentifierChange}
                                        error={identifierError}
                                        placeholder="hello@gmail.com or 01000000000"
                                        className="bg-gray-50 border-gray-200 focus:bg-white h-12"
                                        noLabel
                                    />
                                    {identifier && (
                                        <p className="text-xs text-gray-400">
                                            Will send via: <strong>{channel === 'PHONE' ? 'SMS' : 'Email'}</strong>
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                <Button type="submit" fullWidth variant="primary" size="lg" disabled={loading}>
                                    {loading ? 'Sending code…' : 'Send reset code'}
                                </Button>
                            </motion.form>
                        )}

                        {step === 'reset' && (
                            <motion.form
                                key="reset"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleReset}
                                className="space-y-5"
                            >
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label className="text-sm font-semibold text-gray-900 block mb-3">
                                        Enter verification code
                                    </label>
                                    <OTPInput onChange={setOtpCode} />
                                    <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={cooldown > 0 || loading}
                                            style={{
                                                fontSize: '0.8125rem',
                                                background: 'none', border: 'none',
                                                cursor: cooldown > 0 ? 'default' : 'pointer',
                                                color: cooldown > 0 ? '#9ca3af' : '#6b7280',
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-900">New password</label>
                                        <Input
                                            name="newPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="bg-gray-50 border-gray-200 focus:bg-white h-12"
                                            noLabel
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute right-4 top-[34px] text-gray-400 hover:text-black"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-900">Confirm password</label>
                                        <Input
                                            name="confirmPassword"
                                            type={showConfirm ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="bg-gray-50 border-gray-200 focus:bg-white h-12"
                                            noLabel
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute right-4 top-[34px] text-gray-400 hover:text-black"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    >
                                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                <Button type="submit" fullWidth variant="primary" size="lg" disabled={loading}>
                                    {loading ? 'Resetting…' : 'Reset password'}
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => { setStep('identify'); setError(''); setOtpCode(''); }}
                                    className="w-full text-sm text-gray-500 hover:text-black text-center block transition-colors"
                                >
                                    ← Change email / phone
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
