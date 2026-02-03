import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { completeProfile } from '../slices/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

interface ProfileData {
  // Step 1: Basics
  age: string;
  gender: 'Male' | 'Female' | '';
  occupation: string;
  currentCity: string;
  levelDescription: string;

  // Step 2: Personality
  personality: string[];

  // Step 3: Lifestyle
  smoking: 'Non-smoker' | 'Sometimes' | 'Smoke often' | '';
  pets: 'No pets' | 'Cats' | 'Dogs' | '';
  sleepSchedule: 'Early sleeper' | 'Flexible' | 'Night owl' | '';
  cleanliness: number;

  // Step 4: Budget
  monthlyBudget: number;

  // Step 5: Preferred locations
  preferredLocations: string[];

  // Step 6: Roommate preferences
  roommateGender: 'Same gender only' | 'Open to any gender' | '';
  additionalPreferences: string[];
}

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [profileData, setProfileData] = useState<ProfileData>({
    age: '',
    gender: '',
    occupation: '',
    currentCity: '',
    levelDescription: '',
    personality: [],
    smoking: '',
    pets: '',
    sleepSchedule: '',
    cleanliness: 50,
    monthlyBudget: 3000,
    preferredLocations: [],
    roommateGender: '',
    additionalPreferences: [],
  });

  const steps = [
    { number: 1, title: 'Basics', subtitle: 'Tell us about yourself' },
    { number: 2, title: 'Personality', subtitle: 'How you like at home' },
    { number: 3, title: 'Lifestyle', subtitle: 'Smoking, pets, sleep' },
    { number: 4, title: 'Budget', subtitle: 'How much in EGP' },
    { number: 5, title: 'Location', subtitle: 'Anywhere in Egypt' },
    { number: 6, title: 'Roommate prefs', subtitle: 'Describe your ideal' },
  ];

  const personalityTraits = [
    'Calm', 'Social', 'Introvert', 'Extrovert', 'Organized',
    'Spontaneous', 'Homebody', 'Often out', 'Talkative', 'Quiet'
  ];

  const egyptianCities = [
    'Nasr city', 'New cairo', 'Maadi', 'Zamalek', 'Giza',
    'Mohandessin', 'Heliopolis', 'Sheikh zayed', '6th october', 'Alexandria'
  ];

  const additionalPrefs = [
    'Non-smoker', 'Quiet', 'Clean', 'Student', 'Works from home'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Profile completed:', profileData);
      dispatch(completeProfile());
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">Step 1. Basics</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              Fill in a bit about yourself. This helps us show your profile correctly and calculate better matches.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">Age</label>
              <Input
                type="number"
                min="18"
                max="100"
                value={profileData.age}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val)) {
                    setProfileData({ ...profileData, age: '' });
                  } else if (val >= 0 && val <= 100) {
                    setProfileData({ ...profileData, age: val.toString() });
                  }
                }}
                placeholder="24"
              />
              <p className="text-xs text-gray-500 leading-relaxed mt-2">You must be at least 18 years old.</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                Gender <span className="text-gray-500 font-normal">Required</span>
              </label>
              <div className="flex flex-col gap-2">
                {['Male', 'Female', 'Prefer not to say'].map((option) => (
                  <label key={option} className="flex flex-row items-center gap-3 p-4 border border-gray-200 rounded-md cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 has-[:checked]:border-black has-[:checked]:bg-gray-50 w-full">
                    <input
                      type="radio"
                      name="gender"
                      checked={profileData.gender === option}
                      onChange={() => setProfileData({ ...profileData, gender: option as any })}
                      className="w-5 h-5 m-0 cursor-pointer accent-black"
                    />
                    <span className="text-base text-black leading-none">{option}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mt-2">
                We generally do not allow mixed-gender living settings, but can still choose some gender in city-
                gender matching later.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">Occupation</label>
              <Input
                type="text"
                value={profileData.occupation}
                onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                placeholder="Software engineer, pharmacy student, etc."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">What best describes you?</label>
              <div className="flex flex-wrap gap-2">
                {['Student', 'Working professional', 'Both / Other'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-all border ${profileData.levelDescription === option
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    onClick={() => setProfileData({ ...profileData, levelDescription: option })}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">Current city</label>
              <Input
                type="text"
                value={profileData.currentCity}
                onChange={(e) => setProfileData({ ...profileData, currentCity: e.target.value })}
                placeholder="Cairo, Giza, Alexandria..."
              />
              <p className="text-xs text-gray-500 leading-relaxed mt-2">
                You can update these basics anytime from settings / Account.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-card">
            <h2 className="step-title">Step 2. Personality</h2>
            <p className="step-description">
              Select a few traits that best describe you. We use these to suggest compatible roommates.
            </p>

            <div className="pill-group">
              {personalityTraits.map((trait) => (
                <button
                  key={trait}
                  type="button"
                  className={`pill-button ${profileData.personality.includes(trait) ? 'active' : ''}`}
                  onClick={() => setProfileData({
                    ...profileData,
                    personality: toggleArrayItem(profileData.personality, trait)
                  })}
                >
                  {trait}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">Step 3. Lifestyle</h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              Tell us about your lifestyle to find better roommate matches.
            </p>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-black mb-4">Smoking</label>
              <div className="flex flex-col gap-3">
                {['Non-smoker', 'Sometimes', 'Smoke often'].map((option) => (
                  <label key={option} className="flex flex-row items-center gap-3 p-4 border border-gray-200 rounded-md cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 has-[:checked]:border-black has-[:checked]:bg-gray-50 w-full">
                    <input
                      type="radio"
                      name="smoking"
                      checked={profileData.smoking === option}
                      onChange={() => setProfileData({ ...profileData, smoking: option as any })}
                      className="w-5 h-5 m-0 cursor-pointer accent-black flex-shrink-0"
                    />
                    <span className="text-base text-black">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-black mb-4">Pets at home</label>
              <div className="flex flex-col gap-3">
                {['No pets', 'Cats', 'Dogs'].map((option) => (
                  <label key={option} className="flex flex-row items-center gap-3 p-4 border border-gray-200 rounded-md cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 has-[:checked]:border-black has-[:checked]:bg-gray-50 w-full">
                    <input
                      type="radio"
                      name="pets"
                      checked={profileData.pets === option}
                      onChange={() => setProfileData({ ...profileData, pets: option as any })}
                      className="w-5 h-5 m-0 cursor-pointer accent-black flex-shrink-0"
                    />
                    <span className="text-base text-black">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-black mb-4">Sleep schedule</label>
              <div className="flex flex-col gap-3">
                {['Early sleeper', 'Flexible', 'Night owl'].map((option) => (
                  <label key={option} className="flex flex-row items-center gap-3 p-4 border border-gray-200 rounded-md cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 has-[:checked]:border-black has-[:checked]:bg-gray-50 w-full">
                    <input
                      type="radio"
                      name="sleepSchedule"
                      checked={profileData.sleepSchedule === option}
                      onChange={() => setProfileData({ ...profileData, sleepSchedule: option as any })}
                      className="w-5 h-5 m-0 cursor-pointer accent-black flex-shrink-0"
                    />
                    <span className="text-base text-black">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-4">Cleanliness</label>
              <div className="flex flex-col gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={profileData.cleanliness}
                  onChange={(e) => setProfileData({ ...profileData, cleanliness: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Messy</span>
                  <span>Average</span>
                  <span>Very clean</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-card">
            <h2 className="step-title">Step 4. Budget</h2>
            <p className="step-description">Monthly rent range (EGP)</p>

            <div className="form-group">
              <div className="budget-display">
                <span className="budget-value">{profileData.monthlyBudget.toLocaleString()} EGP</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="100"
                value={profileData.monthlyBudget}
                onChange={(e) => setProfileData({ ...profileData, monthlyBudget: parseInt(e.target.value) })}
                className="slider"
              />
              <div className="slider-labels">
                <span>1,000 EGP</span>
                <span>10,000 EGP</span>
              </div>
              <p className="field-hint">Shared with potential of roommates</p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-card">
            <h2 className="step-title">Step 5. Preferred locations</h2>
            <p className="step-description">
              Choose the areas in Egypt where you're open to live.
            </p>

            <div className="pill-group">
              {egyptianCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  className={`pill-button ${profileData.preferredLocations.includes(city) ? 'active' : ''}`}
                  onClick={() => setProfileData({
                    ...profileData,
                    preferredLocations: toggleArrayItem(profileData.preferredLocations, city)
                  })}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-card">
            <h2 className="step-title">Step 6. Roommate preferences</h2>

            <div className="form-group">
              <label className="form-label">Roommate gender matching</label>
              <p className="field-description">
                Choose whether you want to match only with roommates of the same gender or if you're open to any gender.
              </p>
              <div className="pill-group">
                {['Same gender only', 'Open to any gender'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`pill-button ${profileData.roommateGender === option ? 'active' : ''}`}
                    onClick={() => setProfileData({ ...profileData, roommateGender: option as any })}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Additional preferences</label>
              <div className="pill-group">
                {additionalPrefs.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    className={`pill-button ${profileData.additionalPreferences.includes(pref) ? 'active' : ''}`}
                    onClick={() => setProfileData({
                      ...profileData,
                      additionalPreferences: toggleArrayItem(profileData.additionalPreferences, pref)
                    })}
                  >
                    {pref}
                  </button>
                ))}
              </div>
              <p className="field-hint">
                If you choose "Same gender only", you will only be send to roommates of the same gender. Choosing "open to any gender" allows broader matches.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="bg-white border-r border-gray-200 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-lg font-bold text-black">Profile Setup Wizard</h1>
          </div>

          <div className="flex flex-col gap-8">
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-base font-semibold text-black mb-2">Complete your profile</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Improve your roommate matches by sharing how you live.
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              {steps.map((step) => (
                <button
                  key={step.number}
                  className={`flex items-center gap-3 p-3 rounded-md transition-all text-left ${currentStep === step.number
                    ? 'bg-black text-white'
                    : 'bg-transparent hover:bg-gray-50'
                    }`}
                  onClick={() => setCurrentStep(step.number)}
                >
                  <div className={`flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full flex-shrink-0 transition-all ${currentStep === step.number
                    ? 'bg-white text-black'
                    : currentStep > step.number
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600'
                    }`}>
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium mb-0.5 ${currentStep === step.number ? 'text-white' : 'text-black'
                      }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs ${currentStep === step.number ? 'text-white/70' : 'text-gray-600'
                      }`}>
                      {step.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleNext}
                className="ml-auto"
              >
                {currentStep === totalSteps ? 'Finish profile' : 'Save & continue'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileSetup;
