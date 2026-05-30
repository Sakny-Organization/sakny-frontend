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

export const computeMatch = (myProfile, theirProfile) => {
  if (!myProfile || !theirProfile) return 0;
  let score = 0;
  let total = 0;

  // Shared personality traits
  const myTraits = new Set(myProfile.personalityTraits || []);
  const theirTraits = theirProfile.personalityTraits || [];
  if (myTraits.size > 0 && theirTraits.length > 0) {
    const shared = theirTraits.filter((t) => myTraits.has(t)).length;
    score += (shared / Math.max(myTraits.size, theirTraits.length)) * 40;
    total += 40;
  }

  // Lifestyle overlaps
  if (myProfile.smoking && theirProfile.smoking) {
    if (myProfile.smoking === theirProfile.smoking) score += 15;
    total += 15;
  }
  if (myProfile.pets && theirProfile.pets) {
    if (myProfile.pets === theirProfile.pets) score += 10;
    total += 10;
  }
  if (myProfile.sleepSchedule && theirProfile.sleepSchedule) {
    const compatible =
      myProfile.sleepSchedule === theirProfile.sleepSchedule ||
      myProfile.sleepSchedule === 'FLEXIBLE' ||
      theirProfile.sleepSchedule === 'FLEXIBLE';
    if (compatible) score += 15;
    total += 15;
  }

  // Budget overlap
  if (myProfile.budgetMin != null && theirProfile.budgetMin != null) {
    const overlap =
      Math.min(myProfile.budgetMax, theirProfile.budgetMax) -
      Math.max(myProfile.budgetMin, theirProfile.budgetMin);
    if (overlap >= 0) score += 20;
    total += 20;
  }

  if (total === 0) return 70; // Default when no data to compare
  return Math.round(50 + (score / total) * 50);
};

export const profileToCard = (profile, myProfile = null) => ({
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
  matchPercentage: computeMatch(myProfile, profile),
  image: profile.profilePhotoUrl || `${DEFAULT_AVATAR}&name=${encodeURIComponent(profile.name || 'U')}`,
  occupation: profile.occupation,
  tags: buildTags(profile),
  verified: Boolean(profile.isVerified),
  isOnline: false,
});
