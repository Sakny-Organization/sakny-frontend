import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { completeProfile, updateProfileData } from '../slices/authSlice';
import { createProfile, updateProfile } from '../services/profileApi';
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
    const totalSteps = 6;
    const isEditing = location.state?.edit || false;
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token, user: authUser } = useSelector((state) => state.auth);

    const [profileData, setProfileData] = useState({
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
            setIsSubmitting(true);
            setSubmitError('');

            // Map frontend state to backend ProfileRequest
            const profileRequest = {
                age: parseInt(profileData.age),
                gender: profileData.gender,
                occupation: profileData.occupation,
                currentGovernorateId: 1, // To be replaced with real selection
                currentCityId: 1, // To be replaced with real selection
                bio: profileData.bio,
                universityOrSchool: profileData.universityOrSchool,
                companyName: profileData.companyName,
                instagram: profileData.socialLinks.instagram,
                linkedin: profileData.socialLinks.linkedin,
                personalityTraits: profileData.personality,
                smoking: profileData.smoking, // Backend SmokingStatus enum
                pets: profileData.pets, // Backend PetStatus enum
                sleepSchedule: profileData.sleepSchedule, // Backend SleepSchedule enum
                cleanliness: profileData.cleanliness,
                budgetMin: profileData.budgetMin,
                budgetMax: profileData.budgetMax,
                preferredAreas: profileData.preferredAreas.map(area => ({
                    governorateId: 1, // To be replaced
                    cityId: 1, // To be replaced
                    areaName: area
                })),
                roommateType: profileData.roommateType, // Backend RoommateType enum
                prefSmoking: profileData.prefSmoking || 'ANY_STATUS',
                prefPets: profileData.prefPets || 'ANY_STATUS',
                prefSleepSchedule: profileData.prefSleepSchedule || 'ANY_SCHEDULE',
                prefCleanliness: profileData.prefCleanliness || 'ANY_LEVEL'
            };

            try {
                if (isEditing) {
                    await updateProfile(profileRequest, token);
                    dispatch(updateProfileData(profileData));
                } else {
                    // Profile image currently not in profileData state
                    await createProfile(profileRequest, null, token);
                    dispatch(updateProfileData(profileData));
                    dispatch(completeProfile());
                }
                navigate('/profile');
            } catch (error) {
                setSubmitError(error.message || 'Failed to save profile. Please try again.');
            } finally {
                setIsSubmitting(false);
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
        <div className="py-6 md:py-8">
          <div className="app-container">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
              {/* Sidebar */}
              <aside className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 h-fit lg:sticky lg:top-24">
                <div className="mb-6">
                  <h1 className="text-lg font-bold text-black">
                    {isEditing ? 'Edit Profile' : 'Profile Setup Wizard'}
                  </h1>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-black mb-2">
                      {isEditing ? 'Update your profile' : 'Complete your profile'}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {isEditing
                        ? 'Modify your preferences and information.'
                        : 'Improve your roommate matches by sharing how you live.'}
                    </p>
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Step {currentStep} of {totalSteps}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-black rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desktop step nav */}
                  <nav className="hidden lg:flex flex-col gap-2">
                    {steps.map((step) => {
                      const isClickable = step.number <= highestVisited;
                      const completed = isStepComplete(step.number);
                      return (
                        <button
                          key={step.number}
                          className={`flex items-center gap-3 p-3 rounded-md transition-all text-left border-none ${
                            currentStep === step.number
                              ? 'bg-black text-white'
                              : isClickable
                                ? 'bg-transparent hover:bg-gray-50 cursor-pointer'
                                : 'bg-transparent cursor-not-allowed opacity-50'
                          }`}
                          onClick={() => handleStepClick(step.number)}
                          disabled={!isClickable}
                        >
                          <div
                            className={`flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full flex-shrink-0 transition-all ${
                              currentStep === step.number
                                ? 'bg-white text-black'
                                : completed
                                  ? 'bg-black text-white'
                                  : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {completed ? <Check size={14} /> : step.number}
                          </div>
                          <div className="flex-1">
                            <div
                              className={`text-sm font-medium mb-0.5 ${
                                currentStep === step.number ? 'text-white' : 'text-black'
                              }`}
                            >
                              {step.title}
                            </div>
                            <div
                              className={`text-xs ${
                                currentStep === step.number
                                  ? 'text-white/70'
                                  : 'text-gray-600'
                              }`}
                            >
                              {step.subtitle}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </nav>

                  {/* Mobile step dots */}
                  <div className="flex lg:hidden items-center justify-center gap-2">
                    {steps.map((step) => (
                      <button
                        key={step.number}
                        onClick={() => handleStepClick(step.number)}
                        disabled={step.number > highestVisited}
                        className={`w-8 h-8 rounded-full text-xs font-semibold transition-all flex items-center justify-center border-none ${
                          currentStep === step.number
                            ? 'bg-black text-white'
                            : isStepComplete(step.number)
                              ? 'bg-black text-white'
                              : step.number <= highestVisited
                                ? 'bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isStepComplete(step.number) ? <Check size={12} /> : step.number}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <div>
                <AnimatePresence mode="wait">
                  <React.Fragment key={currentStep}>
                    {renderStepContent()}
                  </React.Fragment>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 pt-6 border-t border-gray-200">
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
                    disabled={!isCurrentStepValid || isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (
                      currentStep === totalSteps
                        ? isEditing
                          ? 'Save Changes'
                          : 'Finish profile'
                        : 'Save & continue'
                    )}
                  </Button>
                </div>
                {submitError && (
                  <p className="text-sm text-red-500 mt-2 text-center">
                    {submitError}
                  </p>
                )}
                {!isCurrentStepValid && Object.keys(stepErrors).length > 0 && (
                  <p className="text-sm text-red-500 mt-2 text-center">
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
