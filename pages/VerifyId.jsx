import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import { CheckCircle, Upload, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { submitVerification } from '../services/verificationApi';

const STEPS = [
    {
        key: 'frontId',
        label: 'Front of National ID',
        hint: 'Take a clear, well-lit photo of the front side of your Egyptian National ID card. Make sure all text is readable.',
    },
    {
        key: 'backId',
        label: 'Back of National ID',
        hint: 'Take a clear, well-lit photo of the back side of your Egyptian National ID card.',
    },
    {
        key: 'selfie',
        label: 'Selfie',
        hint: 'Take a clear selfie of your face. Look directly at the camera in good lighting.',
    },
];

const VerifyId = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [files, setFiles] = useState({ frontId: null, backId: null, selfie: null });
    const [previews, setPreviews] = useState({ frontId: null, backId: null, selfie: null });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const currentKey = STEPS[currentStep].key;

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (previews[currentKey]) URL.revokeObjectURL(previews[currentKey]);
        setFiles((prev) => ({ ...prev, [currentKey]: file }));
        setPreviews((prev) => ({ ...prev, [currentKey]: URL.createObjectURL(file) }));
        setError(null);
    };

    const handleNext = () => {
        if (!files[currentKey]) {
            setError('Please upload a photo before continuing.');
            return;
        }
        setError(null);
        setCurrentStep((s) => s + 1);
    };

    const handleBack = () => {
        setError(null);
        setCurrentStep((s) => s - 1);
    };

    const handleSubmit = async () => {
        if (!files.selfie) {
            setError('Please upload your selfie before submitting.');
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            await submitVerification(files.frontId, files.backId, files.selfie, token);
            setSubmitted(true);
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="step-card"
                style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'center' }}
            >
                <CheckCircle size={56} style={{ color: '#16a34a', margin: '0 auto 1.5rem' }} />
                <h2 className="section-heading">Verification Submitted</h2>
                <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem' }}>
                    Your documents are under review. We'll update your profile once the
                    verification is complete — this usually takes a few minutes.
                </p>
                <Button variant="primary" onClick={() => navigate('/profile')}>
                    Back to Profile
                </Button>
            </motion.div>
        );
    }

    const step = STEPS[currentStep];
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ maxWidth: 520, margin: '0 auto' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Shield size={28} />
                <div>
                    <h1 className="section-heading" style={{ marginBottom: 0 }}>Verify Your Identity</h1>
                    <p className="section-subtitle">Step {currentStep + 1} of {STEPS.length}</p>
                </div>
            </div>

            <div className="progress-bar" style={{ marginBottom: '2rem' }}>
                <motion.div
                    className="progress-fill"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="step-card"
                >
                    <h2 style={{ marginBottom: '0.5rem' }}>{step.label}</h2>
                    <p className="hint" style={{ marginBottom: '1.5rem' }}>{step.hint}</p>

                    <label
                        htmlFor="doc-upload"
                        style={{
                            display: 'block',
                            border: `2px dashed ${previews[step.key] ? 'var(--color-gray-300)' : 'var(--color-gray-300)'}`,
                            borderRadius: 12,
                            padding: previews[step.key] ? '1rem' : '2.5rem 2rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'var(--color-gray-50)',
                            transition: 'border-color 0.2s',
                        }}
                    >
                        {previews[step.key] ? (
                            <img
                                src={previews[step.key]}
                                alt="preview"
                                style={{ maxHeight: 240, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
                            />
                        ) : (
                            <>
                                <Upload size={32} style={{ color: 'var(--color-gray-400)', marginBottom: '0.75rem' }} />
                                <p style={{ color: 'var(--color-gray-600)', fontWeight: 500, marginBottom: '0.25rem' }}>
                                    Click to upload or drag &amp; drop
                                </p>
                                <p style={{ color: 'var(--color-gray-400)', fontSize: '0.8125rem' }}>
                                    JPEG or PNG, max 5 MB
                                </p>
                            </>
                        )}
                        <input
                            id="doc-upload"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                    </label>

                    {previews[step.key] && (
                        <button
                            type="button"
                            onClick={() => document.getElementById('doc-upload').click()}
                            style={{
                                marginTop: '0.5rem',
                                fontSize: '0.8125rem',
                                color: 'var(--color-gray-500)',
                                textDecoration: 'underline',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Choose a different photo
                        </button>
                    )}

                    {error && (
                        <p style={{ color: '#dc2626', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                            {error}
                        </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
                        <Button
                            variant="outline"
                            onClick={currentStep === 0 ? () => navigate('/profile') : handleBack}
                        >
                            <ArrowLeft size={16} />
                            {currentStep === 0 ? 'Cancel' : 'Back'}
                        </Button>

                        {currentStep < STEPS.length - 1 ? (
                            <Button variant="primary" onClick={handleNext}>
                                Next
                                <ArrowRight size={16} />
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? 'Submitting…' : 'Submit for Verification'}
                            </Button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default VerifyId;
