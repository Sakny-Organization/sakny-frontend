import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { completeProfile, updateProfileData } from '../slices/authSlice';
import apiService from '../services/api';
import Button from '../components/common/Button';
import { Check } from 'lucide-react';

import StepBasics from '../components/profile-setup/StepBasics';
import StepPersonality from '../components/profile-setup/StepPersonality';
import StepLifestyle from '../components/profile-setup/StepLifestyle';
import StepBudget from '../components/profile-setup/StepBudget';
import StepLocation from '../components/profile-setup/StepLocation';
import StepRoommatePrefs from '../components/profile-setup/StepRoommatePrefs';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});
  const [highestVisited, setHighestVisited] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 6;
  const isEditing = location.state?.edit || false;

  const [profileData, setProfileData] = useState({
    // Avatar
    avatar: '',
    // Basics
    age: '',
    gender: '',
    occupation: '',
    currentGovernorate: '',
    currentCity: '',
    bio: '',
    universityOrSchool: '',
    companyName: '',
    socialLinks: { instagram: '', linkedin: '' },
    // Personality
    personality: [],
    customPersonalityTraits: [],
    // Lifestyle
    smoking: '',
    pets: '',
    sleepSchedule: '',
    cleanliness: 3,
    // Budget
    budgetMin: 2000,
    budgetMax: 6000,
    // Location
    preferredAreas: [],
    // Roommate Preferences
    roommateType: '',
    prefSmoking: '',
    prefPets: '',
    prefSleepSchedule: '',
    prefCleanliness: '',
    additionalNotes: '',
  });

  // Load existing user data if editing
  useEffect(() => {
    if (isEditing && user) {
      setProfileData(prev => ({
        ...prev,
        avatar: user.avatar || '',
        age: user.age || '',
        gender: user.gender || '',
        occupation: user.occupation || '',
        currentGovernorate: user.currentGovernorate || '',
        currentCity: user.currentCity || '',
        bio: user.bio || '',
        universityOrSchool: user.universityOrSchool || '',
        companyName: user.companyName || '',
        socialLinks: user.socialLinks || { instagram: '', linkedin: '' },
        personality: user.personality || [],
        customPersonalityTraits: user.customPersonalityTraits || [],
        smoking: user.smoking || '',
        pets: user.pets || '',
        sleepSchedule: user.sleepSchedule || '',
        cleanliness: user.cleanliness || 3,
        budgetMin: user.budgetMin || 2000,
        budgetMax: user.budgetMax || 6000,
        preferredAreas: user.preferredAreas || [],
        roommateType: user.roommateType || '',
        prefSmoking: user.prefSmoking || '',
        prefPets: user.prefPets || '',
        prefSleepSchedule: user.prefSleepSchedule || '',
        prefCleanliness: user.prefCleanliness || '',
        additionalNotes: user.additionalNotes || '',
      }));
      setHighestVisited(totalSteps);
    }
  }, [isEditing, user]);

  const steps = [
    { number: 1, title: 'Basics', subtitle: 'Tell us about yourself' },
    { number: 2, title: 'Personality', subtitle: 'Your traits & vibe' },
    { number: 3, title: 'Lifestyle', subtitle: 'Smoking, pets, sleep' },
    { number: 4, title: 'Budget', subtitle: 'Monthly range in EGP' },
    { number: 5, title: 'Location', subtitle: 'Preferred areas' },
    { number: 6, title: 'Roommate prefs', subtitle: 'Describe your ideal' },
  ];

  const validateStep = (step) => {
    const errors = {};
    switch (step) {
      case 1: {
        const age = parseInt(profileData.age);
        if (isNaN(age) || age < 18) errors.age = 'You must be at least 18 years old';
        if (!profileData.gender) errors.gender = 'Please select your gender';
        break;
      }
      case 2:
        if (profileData.personality.length === 0) errors.personality = 'Select at least one trait';
        break;
      case 3:
        if (!profileData.smoking) errors.smoking = 'Please select a smoking option';
        if (!profileData.pets) errors.pets = 'Please select a pets option';
        if (!profileData.sleepSchedule) errors.sleepSchedule = 'Please select your sleep schedule';
        break;
      case 4:
        break; // Budget always valid with defaults
      case 5:
        if (profileData.preferredAreas.length === 0) errors.preferredAreas = 'Add at least one preferred area';
        break;
      case 6:
        if (!profileData.roommateType) errors.roommateType = 'Please select a roommate type';
        break;
      default:
        break;
    }
    return errors;
  };

  const isCurrentStepValid = useMemo(() => {
    const errors = validateStep(currentStep);
    return Object.keys(errors).length === 0;
  }, [currentStep, profileData]);

  const handleNext = async () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});

    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep > highestVisited) setHighestVisited(nextStep);
    } else {
      // Final submit
      setIsLoading(true);
      const submissionData = {
        ...profileData,
        roommateGender: profileData.gender, // Auto same-gender
      };

      try {
        // Save to backend API
        const updatedUser = await apiService.updateUser(submissionData);

        // Update local Redux state
        dispatch(updateProfileData(updatedUser));
        dispatch(completeProfile());

        navigate('/profile');
      } catch (error) {
        console.error('Failed to save profile:', error);
        setStepErrors({ submit: 'Failed to save profile. Please check your connection.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStepErrors({});
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= highestVisited) {
      setStepErrors({});
      setCurrentStep(stepNumber);
    }
  };

  const isStepComplete = (stepNumber) => {
    if (stepNumber >= currentStep) return false;
    const errors = validateStep(stepNumber);
    return Object.keys(errors).length === 0;
  };

  const renderStepContent = () => {
    const stepProps = {
      data: profileData,
      onChange: setProfileData,
      errors: stepErrors,
    };

    switch (currentStep) {
      case 1: return <StepBasics {...stepProps} />;
      case 2: return <StepPersonality {...stepProps} />;
      case 3: return <StepLifestyle {...stepProps} />;
      case 4: return <StepBudget {...stepProps} />;
      case 5: return <StepLocation {...stepProps} />;
      case 6: return <StepRoommatePrefs {...stepProps} />;
      default: return null;
    }
  };

  // Progress percentage
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="profile-setup-shell py-6 md:py-8">
      <div className="app-container">
        <div className="profile-setup-grid">
          {/* Sidebar */}
          <aside className="profile-setup-sidebar">
            <div className="mb-6">
              <h1 className="text-lg font-bold text-black">
                {isEditing ? 'Edit Profile' : 'Profile Setup Wizard'}
              </h1>
            </div>

            <div className="profile-setup-sidebar-content">
              <div className="profile-setup-progress-card">
                <h3 className="text-base font-semibold text-black mb-2">
                  {isEditing ? 'Update your profile' : 'Complete your profile'}
                </h3>
                <p className="profile-setup-progress-copy">
                  {isEditing
                    ? 'Modify your preferences and information.'
                    : 'Improve your roommate matches by sharing how you live.'}
                </p>
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="profile-setup-progress-meta">
                    <span>Step {currentStep} of {totalSteps}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="profile-setup-progress-track">
                    <motion.div
                      className="profile-setup-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* Desktop step nav */}
              <nav className="profile-setup-steps profile-setup-steps--desktop">
                {steps.map((step) => {
                  const isClickable = step.number <= highestVisited;
                  const completed = isStepComplete(step.number);
                  return (
                    <button
                      key={step.number}
                      className={`profile-setup-step ${currentStep === step.number ? 'is-active' : ''} ${completed ? 'is-complete' : ''} ${!isClickable ? 'is-disabled' : ''}`}
                      onClick={() => handleStepClick(step.number)}
                      disabled={!isClickable}
                    >
                      <div className="profile-setup-step-number">
                        {completed ? <Check size={14} /> : step.number}
                      </div>
                      <div className="profile-setup-step-copy">
                        <div className="profile-setup-step-title">{step.title}</div>
                        <div className="profile-setup-step-subtitle">{step.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile step dots */}
              <div className="profile-setup-dots">
                {steps.map((step) => (
                  <button
                    key={step.number}
                    onClick={() => handleStepClick(step.number)}
                    disabled={step.number > highestVisited}
                    className={`profile-setup-dot ${currentStep === step.number ? 'is-active' : ''} ${isStepComplete(step.number) ? 'is-complete' : ''} ${step.number > highestVisited ? 'is-disabled' : ''}`}
                  >
                    {isStepComplete(step.number) ? <Check size={12} /> : step.number}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="profile-setup-main">
            <AnimatePresence mode="wait">
              <React.Fragment key={currentStep}>
                {renderStepContent()}
              </React.Fragment>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="profile-setup-actions-bar">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!isCurrentStepValid}
              >
                {currentStep === totalSteps
                  ? isEditing
                    ? 'Save Changes'
                    : 'Finish profile'
                  : 'Save & continue'}
              </Button>
            </div>
            {stepErrors.submit && (
              <p className="profile-setup-error-message">{stepErrors.submit}</p>
            )}
            {!stepErrors.submit && !isCurrentStepValid && Object.keys(stepErrors).length > 0 && (
              <p className="profile-setup-error-message">
                Please fill in all required fields to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
