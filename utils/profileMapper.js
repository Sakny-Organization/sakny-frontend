const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=e5e7eb&color=374151&size=200&name=U';

const SMOKING_LABELS = {
  NON_SMOKER: 'Non-smoker',
  SOMETIMES: 'Occasional smoker',
  SMOKE_OFTEN: 'Smoker',
};

const PETS_LABELS = {
  NO_PETS: 'No pets',
  HAVE_PETS: 'Has pets',
};

const SLEEP_LABELS = {
  EARLY_BIRD: 'Early bird',
  NIGHT_OWL: 'Night owl',
  FLEXIBLE: 'Flexible schedule',
};

export const buildTags = (profile) => {
  const tags = [];
  if (profile.personalityTraits?.length) {
    tags.push(...profile.personalityTraits.slice(0, 3));
  }
  if (profile.smoking && SMOKING_LABELS[profile.smoking]) {
    tags.push(SMOKING_LABELS[profile.smoking]);
  }
  if (profile.pets && PETS_LABELS[profile.pets]) {
    tags.push(PETS_LABELS[profile.pets]);
  }
  if (profile.sleepSchedule && SLEEP_LABELS[profile.sleepSchedule]) {
    tags.push(SLEEP_LABELS[profile.sleepSchedule]);
  }
  return tags.slice(0, 6);
};

export const getProfileLocation = (profile) => {
  if (profile.preferredAreas?.length) {
    const first = profile.preferredAreas[0];
    const city = first.city?.nameEn || first.cityName;
    const gov = first.governorate?.nameEn || first.governorateName;
    if (city) return gov ? `${city}, ${gov}` : city;
  }
  if (profile.currentCity?.nameEn) {
    return profile.currentGovernorate?.nameEn
      ? `${profile.currentCity.nameEn}, ${profile.currentGovernorate.nameEn}`
      : profile.currentCity.nameEn;
  }
  return 'Egypt';
};

const budgetOverlapScore = (my, their) => {
  if (my.budgetMin == null || their.budgetMin == null) return { score: 0, max: 0 };
  const overlapStart = Math.max(my.budgetMin, their.budgetMin);
  const overlapEnd = Math.min(my.budgetMax || my.budgetMin, their.budgetMax || their.budgetMin);
  const overlap = Math.max(0, overlapEnd - overlapStart);
  const totalRange = Math.max(
    (my.budgetMax || my.budgetMin) - my.budgetMin,
    (their.budgetMax || their.budgetMin) - their.budgetMin,
    1
  );
  return { score: Math.min(1, overlap / totalRange) * 20, max: 20 };
};

const smokingScore = (my, their) => {
  if (!my.smoking && !my.prefSmoking && !their.smoking) return { score: 0, max: 0 };
  const myPref = my.prefSmoking || my.smoking;
  const theirActual = their.smoking;
  if (!myPref || !theirActual) return { score: 0, max: 0 };

  let s = 0;
  if (myPref === theirActual) s = 12;
  else if (myPref === 'DONT_MIND' || theirActual === 'SOMETIMES') s = 8;
  else if (myPref === 'SOMETIMES' || theirActual === 'DONT_MIND') s = 6;

  return { score: s, max: 12 };
};

const petsScore = (my, their) => {
  if (!my.pets && !my.prefPets && !their.pets) return { score: 0, max: 0 };
  const myPref = my.prefPets || my.pets;
  const theirActual = their.pets;
  if (!myPref || !theirActual) return { score: 0, max: 0 };

  return { score: myPref === theirActual || myPref === 'DONT_MIND' ? 8 : 0, max: 8 };
};

const sleepScore = (my, their) => {
  if (!my.sleepSchedule && !my.prefSleepSchedule && !their.sleepSchedule) return { score: 0, max: 0 };
  const myPref = my.prefSleepSchedule || my.sleepSchedule;
  const theirActual = their.sleepSchedule;
  if (!myPref || !theirActual) return { score: 0, max: 0 };

  const compatible = myPref === theirActual || myPref === 'FLEXIBLE' || theirActual === 'FLEXIBLE';
  return { score: compatible ? 10 : 0, max: 10 };
};

const genderScore = (my, their) => {
  const pref = my.roommateGender || my.preferredGender;
  if (!pref || pref === 'DONT_MIND' || pref === 'Any') return { score: 12, max: 12 };
  if (!their.gender) return { score: 6, max: 12 };
  return { score: pref === their.gender ? 12 : 0, max: 12 };
};

const personalityScore = (my, their) => {
  const myTraits = new Set(my.personalityTraits || []);
  const theirTraits = their.personalityTraits || [];
  if (myTraits.size === 0 || theirTraits.length === 0) return { score: 0, max: 0 };

  const union = new Set([...myTraits, ...theirTraits]);
  const shared = theirTraits.filter((t) => myTraits.has(t)).length;
  const jaccard = union.size > 0 ? shared / union.size : 0;
  return { score: jaccard * 15, max: 15 };
};

const cleanlinessScore = (my, their) => {
  if (my.cleanlinessLevel == null || their.cleanlinessLevel == null) return { score: 0, max: 0 };
  const diff = Math.abs(my.cleanlinessLevel - their.cleanlinessLevel);
  return { score: (1 - diff / 4) * 8, max: 8 };
};

const locationScore = (my, their) => {
  const myAreas = (my.preferredAreas || []).map(a => (a.city?.nameEn || a.cityName || '').toLowerCase());
  const theirAreas = (their.preferredAreas || []).map(a => (a.city?.nameEn || a.cityName || '').toLowerCase());
  if (myAreas.length === 0 || theirAreas.length === 0) return { score: 0, max: 0 };

  const hasSharedCity = myAreas.some(c => theirAreas.includes(c));
  if (hasSharedCity) return { score: 15, max: 15 };

  const myGovs = (my.preferredAreas || []).map(a => (a.governorate?.nameEn || a.governorateName || '').toLowerCase());
  const theirGovs = (their.preferredAreas || []).map(a => (a.governorate?.nameEn || a.governorateName || '').toLowerCase());
  const hasSharedGov = myGovs.some(g => theirGovs.includes(g));
  return { score: hasSharedGov ? 8 : 0, max: 15 };
};

export const computeMatch = (myProfile, theirProfile) => {
  if (!myProfile || !theirProfile) return 70;

  const factors = [
    budgetOverlapScore(myProfile, theirProfile),
    smokingScore(myProfile, theirProfile),
    petsScore(myProfile, theirProfile),
    sleepScore(myProfile, theirProfile),
    genderScore(myProfile, theirProfile),
    personalityScore(myProfile, theirProfile),
    cleanlinessScore(myProfile, theirProfile),
    locationScore(myProfile, theirProfile),
  ];

  const totalScore = factors.reduce((sum, f) => sum + f.score, 0);
  const totalMax = factors.reduce((sum, f) => sum + f.max, 0);

  if (totalMax === 0) return 70;
  return Math.round(50 + (totalScore / totalMax) * 50);
};

export const computeMatchBreakdown = (myProfile, theirProfile) => {
  if (!myProfile || !theirProfile) return [];

  const factors = [
    { key: 'budget', label: 'Budget Overlap', ...budgetOverlapScore(myProfile, theirProfile) },
    { key: 'smoking', label: 'Smoking Preference', ...smokingScore(myProfile, theirProfile) },
    { key: 'pets', label: 'Pet Preference', ...petsScore(myProfile, theirProfile) },
    { key: 'sleep', label: 'Sleep Schedule', ...sleepScore(myProfile, theirProfile) },
    { key: 'gender', label: 'Gender Match', ...genderScore(myProfile, theirProfile) },
    { key: 'personality', label: 'Personality Traits', ...personalityScore(myProfile, theirProfile) },
    { key: 'cleanliness', label: 'Cleanliness Level', ...cleanlinessScore(myProfile, theirProfile) },
    { key: 'location', label: 'Location Overlap', ...locationScore(myProfile, theirProfile) },
  ];

  return factors.filter(f => f.max > 0);
};

export const profileToCard = (profile, myProfile = null) => {
  // Prefer server-side match score if available
  const matchPercentage = profile.matchScore != null
    ? profile.matchScore
    : computeMatch(myProfile, profile);

  return {
    id: profile.userId,
    name: profile.name,
    age: profile.age,
    gender: profile.gender,
    budget: profile.budgetMin != null
      ? `${profile.budgetMin.toLocaleString()}–${profile.budgetMax.toLocaleString()} EGP`
      : 'N/A',
    budgetMin: profile.budgetMin,
    budgetMax: profile.budgetMax,
    location: getProfileLocation(profile),
    matchPercentage,
    matchBreakdown: profile.matchBreakdown || null,
    strengths: profile.strengths || null,
    conflicts: profile.conflicts || null,
    explanation: profile.explanation || null,
    discussionTopics: profile.discussionTopics || null,
    image: profile.profilePhotoUrl || `${DEFAULT_AVATAR}&name=${encodeURIComponent(profile.name || 'U')}`,
    occupation: profile.occupation,
    bio: profile.bio,
    tags: buildTags(profile),
    verified: Boolean(profile.isVerified),
    isOnline: profile.isOnline !== undefined ? profile.isOnline : (profile.userId ? profile.userId % 3 !== 0 : true),
    _raw: profile,
  };
};
