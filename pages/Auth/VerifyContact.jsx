import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import OTPInput from '../../components/common/OTPInput';
import Button from '../../components/common/Button';
import apiService from '../../services/api';
import { isLandlordUser } from '../../utils/userRole';
import { Mail, Phone, CheckCircle } from 'lucide-react';

const RESEND_COOLDOWN = 60;

const maskEmail = (email) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    const masked = local.length <= 3 ? local[0] + '***' : local.slice(0, 3) + '***';
    return masked + '@' + domain;
};

const maskPhone = (phone) => {
    if (!phone) return '';
    return phone.slice(0, 4) + '****' + phone.slice(-3);
};

const VerifyContact = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const [channel, setChannel] = useState(null);
    const [step, setStep] = useState('pick'); // 'pick' | 'otp' | 'done'
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);

    const preselectedChannel = location.state?.channel;
    const preselectedIdentifier = location.state?.identifier;
    // When coming from the profile page the identifier is always passed explicitly
    const fromProfile = Boolean(preselectedIdentifier);
    const destination = fromProfile ? '/profile' : (isLandlordUser(user) ? '/landlord/dashboard' : '/profile-setup');

    // Prefer identifier from navigate state; fall back to Redux user (populated after registration)
    const resolveIdentifier = (ch) => {
        if (preselectedIdentifier) return preselectedIdentifier;
        return ch === 'EMAIL' ? user?.email : user?.phone;
    };

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    // Set the preselected channel but don't auto-send
    useEffect(() => {
        if (preselectedChannel) {
            setChannel(preselectedChannel);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSendOtp = async () => {
        if (!channel) return;
        setError('');
        setLoading(true);
        try {
            const identifier = resolveIdentifier(channel);
            await apiService.sendOtp({ identifier, channel, purpose: 'REGISTRATION' });
            setStep('otp');
            setCooldown(RESEND_COOLDOWN);
        } catch (err) {
            setError(err.message || 'Failed to send code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChannel = (ch) => {
        setChannel(ch);
        setError('');
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setError('');
        setLoading(true);
        try {
            const identifier = resolveIdentifier(channel);
            await apiService.sendOtp({ identifier, channel, purpose: 'REGISTRATION' });
            setCooldown(RESEND_COOLDOWN);
        } catch (err) {
            setError(err.message || 'Failed to resend code.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!otpCode || otpCode.length < 6) {
            setError('Please enter the 6-digit code.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const identifier = resolveIdentifier(channel);
            await apiService.verifyOtp({ identifier, code: otpCode, channel, purpose: 'REGISTRATION' });
            setStep('done');
            setTimeout(() => navigate(destination), 1800);
        } catch (err) {
            setError(err.message || 'Invalid or expired code.');
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
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    {fromProfile ? `${channel === 'EMAIL' ? 'Email' : 'Phone'} Verified!` : 'Account Verified!'}
                </h2>
                <p style={{ color: 'var(--color-gray-500)' }}>
                    {fromProfile ? 'Taking you back to your profile…' : 'Taking you to set up your profile…'}
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1rem' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Verify your account</h1>
                <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9375rem' }}>
                    We'll send a 6-digit code to confirm your contact info.
                </p>
            </div>

            <AnimatePresence mode="wait">
                {step === 'pick' && (
                    <motion.div
                        key="pick"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                    >
                        {!preselectedChannel ? (
                            <>
                                <p style={{ fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
                                    How would you like to verify?
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                                    <button
                                        onClick={() => handleSelectChannel('EMAIL')}
                                        disabled={loading}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '1rem 1.25rem',
                                            border: channel === 'EMAIL' ? '2px solid #111' : '2px solid #e5e7eb',
                                            borderRadius: 12, background: 'white', cursor: 'pointer',
                                            textAlign: 'left', transition: 'border-color 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = channel === 'EMAIL' ? '#111' : '#e5e7eb'}
                                    >
                                        <div style={{ background: '#f3f4f6', borderRadius: 8, padding: 10 }}>
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>Email</div>
                                            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
                                                {maskEmail(resolveIdentifier('EMAIL'))}
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleSelectChannel('PHONE')}
                                        disabled={loading}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '1rem 1.25rem',
                                            border: channel === 'PHONE' ? '2px solid #111' : '2px solid #e5e7eb',
                                            borderRadius: 12, background: 'white', cursor: 'pointer',
                                            textAlign: 'left', transition: 'border-color 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = '#111'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = channel === 'PHONE' ? '#111' : '#e5e7eb'}
                                    >
                                        <div style={{ background: '#f3f4f6', borderRadius: 8, padding: 10 }}>
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>Phone</div>
                                            <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
                                                {maskPhone(resolveIdentifier('PHONE'))}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ marginBottom: '2rem' }}>
                                <p style={{ textAlign: 'center', color: 'var(--color-gray-500)', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                                    We'll send a code to verify your {channel === 'EMAIL' ? 'email' : 'phone number'}:
                                </p>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '1rem 1.25rem', border: '2px solid #111',
                                    borderRadius: 12, background: '#f9fafb', marginBottom: '1.5rem'
                                }}>
                                    <div style={{ background: '#fff', borderRadius: 8, padding: 10 }}>
                                        {channel === 'EMAIL' ? <Mail size={20} /> : <Phone size={20} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{channel === 'EMAIL' ? 'Email' : 'Phone'}</div>
                                        <div style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
                                            {channel === 'EMAIL'
                                                ? maskEmail(resolveIdentifier('EMAIL'))
                                                : maskPhone(resolveIdentifier('PHONE'))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <p style={{ color: '#dc2626', textAlign: 'center', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                {error}
                            </p>
                        )}

                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleSendOtp}
                            disabled={loading || !channel}
                            style={{ marginBottom: '1rem' }}
                        >
                            {loading ? 'Sending...' : `Send verification code`}
                        </Button>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={() => navigate(destination)}
                                style={{ color: 'var(--color-gray-400)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Skip for now
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'otp' && (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                    >
                        <p style={{ textAlign: 'center', color: 'var(--color-gray-500)', marginBottom: '2rem', fontSize: '0.9375rem' }}>
                            Code sent to{' '}
                            <strong>
                                {channel === 'EMAIL' ? maskEmail(resolveIdentifier('EMAIL')) : maskPhone(resolveIdentifier('PHONE'))}
                            </strong>
                        </p>

                        <div style={{ marginBottom: '2rem' }}>
                            <OTPInput onChange={setOtpCode} />
                        </div>

                        {error && (
                            <p style={{ color: '#dc2626', textAlign: 'center', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                {error}
                            </p>
                        )}

                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleVerify}
                            disabled={loading || otpCode.length < 6}
                            style={{ marginBottom: '1.25rem' }}
                        >
                            {loading ? 'Verifying…' : 'Verify'}
                        </Button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={cooldown > 0 || loading}
                                style={{
                                    fontSize: '0.875rem', background: 'none', border: 'none', cursor: cooldown > 0 ? 'default' : 'pointer',
                                    color: cooldown > 0 ? 'var(--color-gray-300)' : 'var(--color-gray-500)', textDecoration: 'underline',
                                }}
                            >
                                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(destination)}
                                style={{ color: 'var(--color-gray-400)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Skip for now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default VerifyContact;
