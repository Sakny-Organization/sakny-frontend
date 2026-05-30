const SMOKING_LABELS = {
    NON_SMOKER: 'Non-smoker',
    SOMETIMES: 'Sometimes',
    SMOKE_OFTEN: 'Smoke often',
    NON_SMOKER_ONLY: 'Non-smoker only',
    DONT_MIND: "Don't mind",
};

const PETS_LABELS = {
    NO_PETS: 'No pets',
    HAVE_PETS: 'Have pets',
    OKAY_WITH_PETS: 'Okay with pets',
    NO_PETS_PREFERRED: 'No pets preferred',
};

const SLEEP_LABELS = {
    EARLY_BIRD: 'Early bird',
    NIGHT_OWL: 'Night owl',
    FLEXIBLE: 'Flexible',
    DONT_MIND: "Don't mind",
};

const GENDER_LABELS = {
    MALE: 'Male',
    FEMALE: 'Female',
    ANY: 'Any',
    DONT_MIND: "Don't mind",
};

const ROOMMATE_TYPE_LABELS = {
    STUDENT: 'Student',
    WORKING_PROFESSIONAL: 'Working Professional',
    DONT_MIND: "Don't mind",
};

const CLEANLINESS_LABELS = {
    VERY_CLEAN: 'Very clean',
    AVERAGE_OR_ABOVE: 'Average or above',
    DONT_MIND: "Don't mind",
};

const lookup = (map, value) => {
    if (!value) return 'Not specified';
    return map[value] ?? value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const formatSmoking = (v) => lookup(SMOKING_LABELS, v);
export const formatPets = (v) => lookup(PETS_LABELS, v);
export const formatSleep = (v) => lookup(SLEEP_LABELS, v);
export const formatGender = (v) => lookup(GENDER_LABELS, v);
export const formatRoommateType = (v) => lookup(ROOMMATE_TYPE_LABELS, v);
export const formatCleanliness = (v) => lookup(CLEANLINESS_LABELS, v);

export const formatCleanlinessLevel = (level) => {
    const labels = ['', 'Very messy', 'A bit messy', 'Average', 'Clean', 'Very clean'];
    const n = parseInt(level);
    return labels[n] ?? `Level ${n}`;
};
