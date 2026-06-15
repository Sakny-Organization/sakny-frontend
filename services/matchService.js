import { MOCK_ROOMMATES } from "../data/mockData";

const MATCH_FIXTURES = {
  r1: {
    city: "Cairo",
    locationLabel: "Downtown, Cairo",
    budgetRange: { min: 1100, max: 1500 },
    smoking: "Non-smoker",
    pets: "Pet friendly",
    cleanliness: 4,
    sleepSchedule: "Early bird",
    lifestyle: ["Quiet evenings", "Gym routine", "Weekend brunch"],
    matchBreakdown: {
      budget: 90,
      location: 86,
      lifestyle: 88,
      smoking: 100,
      pets: 82,
      cleanliness: 94,
    },
    bio: "Designer working hybrid between Zamalek and Downtown. Prefers calm evenings, clean shared spaces, and a roommate who communicates clearly.",
    responseTime: "Replies within the hour",
    housing: {
      type: "Private room in a 3-bedroom apartment",
      roommates: "2 male roommates",
      availableFrom: "1 May 2026",
      minimumStay: "6 months",
    },
  },
  r2: {
    city: "Giza",
    locationLabel: "Dokki, Giza",
    budgetRange: { min: 1300, max: 1700 },
    smoking: "Non-smoker",
    pets: "No pets",
    cleanliness: 5,
    sleepSchedule: "Night owl",
    lifestyle: ["Remote work setup", "Gaming nights", "Deep cleaning Sundays"],
    matchBreakdown: {
      budget: 84,
      location: 91,
      lifestyle: 86,
      smoking: 96,
      pets: 76,
      cleanliness: 98,
    },
    bio: "Software engineer with a structured work rhythm, strong internet requirements, and a preference for a tidy, quiet apartment during weekdays.",
    responseTime: "Usually replies in a few hours",
    housing: {
      type: "Large room in a modern apartment",
      roommates: "1 male roommate",
      availableFrom: "15 May 2026",
      minimumStay: "9 months",
    },
  },
  r3: {
    city: "Cairo",
    locationLabel: "Nasr City, Cairo",
    budgetRange: { min: 800, max: 1200 },
    smoking: "Non-smoker",
    pets: "No pets",
    cleanliness: 3,
    sleepSchedule: "Flexible",
    lifestyle: ["Study-focused", "Quiet mornings", "Meal prep"],
    matchBreakdown: {
      budget: 79,
      location: 72,
      lifestyle: 83,
      smoking: 100,
      pets: 90,
      cleanliness: 70,
    },
    bio: "Student balancing university and a part-time internship, looking for a respectful home environment and roommates who appreciate quiet study time.",
    responseTime: "Replies later in the day",
    housing: {
      type: "Shared room in a student-friendly flat",
      roommates: "2 female roommates",
      availableFrom: "Immediately",
      minimumStay: "4 months",
    },
  },
  r4: {
    city: "Giza",
    locationLabel: "Sheikh Zayed, Giza",
    budgetRange: { min: 1600, max: 2100 },
    smoking: "Sometimes",
    pets: "Pet friendly",
    cleanliness: 4,
    sleepSchedule: "Early bird",
    lifestyle: [
      "Outdoor weekends",
      "Hosting occasionally",
      "Structured routine",
    ],
    matchBreakdown: {
      budget: 88,
      location: 94,
      lifestyle: 89,
      smoking: 72,
      pets: 85,
      cleanliness: 92,
    },
    bio: "Architect with an early schedule and a preference for organized common areas, occasional guests, and a polished apartment setup.",
    responseTime: "Replies within a few hours",
    housing: {
      type: "Private ensuite room in a spacious flat",
      roommates: "2 male roommates",
      availableFrom: "1 June 2026",
      minimumStay: "12 months",
    },
  },
  r5: {
    city: "Cairo",
    locationLabel: "Heliopolis, Cairo",
    budgetRange: { min: 1200, max: 1500 },
    smoking: "Sometimes",
    pets: "No pets",
    cleanliness: 3,
    sleepSchedule: "Night owl",
    lifestyle: ["Social dinners", "Weekend trips", "Flexible work"],
    matchBreakdown: {
      budget: 87,
      location: 84,
      lifestyle: 81,
      smoking: 74,
      pets: 88,
      cleanliness: 76,
    },
    bio: "Marketing professional who enjoys an active social life and a relaxed but respectful apartment dynamic with clear boundaries.",
    responseTime: "Replies in the evening",
    housing: {
      type: "Private room in a renovated apartment",
      roommates: "1 male roommate",
      availableFrom: "10 May 2026",
      minimumStay: "6 months",
    },
  },
  r6: {
    city: "Alexandria",
    locationLabel: "Stanley, Alexandria",
    budgetRange: { min: 950, max: 1250 },
    smoking: "Non-smoker",
    pets: "Okay with pets",
    cleanliness: 5,
    sleepSchedule: "Early bird",
    lifestyle: ["Calm evenings", "Music practice", "Very tidy"],
    matchBreakdown: {
      budget: 82,
      location: 80,
      lifestyle: 91,
      smoking: 100,
      pets: 93,
      cleanliness: 97,
    },
    bio: "Teacher with a calm daily rhythm, strong cleanliness standards, and a warm, low-drama shared-living style.",
    responseTime: "Replies quickly during the day",
    housing: {
      type: "Bright room with sea-facing balcony access",
      roommates: "1 female roommate",
      availableFrom: "20 May 2026",
      minimumStay: "8 months",
    },
  },
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const averageScore = (breakdown) => {
  const values = Object.values(breakdown);
  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
};

const enrichMatch = (roommate) => {
  const fixture = MATCH_FIXTURES[roommate.id] || {};
  const breakdown = fixture.matchBreakdown || {
    budget: roommate.matchPercentage,
    location: roommate.matchPercentage,
    lifestyle: roommate.matchPercentage,
    smoking: roommate.matchPercentage,
    pets: roommate.matchPercentage,
    cleanliness: roommate.matchPercentage,
  };

  return {
    ...roommate,
    ...fixture,
    city: fixture.city || roommate.location,
    locationLabel: fixture.locationLabel || roommate.location,
    budgetRange: fixture.budgetRange || {
      min: roommate.budget - 200,
      max: roommate.budget + 200,
    },
    smoking: fixture.smoking || "Non-smoker",
    pets: fixture.pets || "No pets",
    cleanliness: fixture.cleanliness || 3,
    sleepSchedule: fixture.sleepSchedule || "Flexible",
    lifestyle: fixture.lifestyle || roommate.tags || [],
    matchBreakdown: breakdown,
    matchPercentage: averageScore(breakdown),
    bio:
      fixture.bio ||
      roommate.bio ||
      "Looking for a compatible roommate and a calm, well-managed home.",
    responseTime: fixture.responseTime || "Replies within the day",
    housing: fixture.housing || {
      type: "Private room in a shared apartment",
      roommates: "2 roommates",
      availableFrom: "Immediately",
      minimumStay: "6 months",
    },
  };
};

export const getAllMatches = async () => {
  await delay(350);
  return MOCK_ROOMMATES.map(enrichMatch);
};

export const getRecommendedMatches = async (limit = 4) => {
  const matches = await getAllMatches();
  return [...matches]
    .sort((left, right) => right.matchPercentage - left.matchPercentage)
    .slice(0, limit);
};

export const getMatchById = async (id) => {
  const matches = await getAllMatches();
  return matches.find((match) => match.id === id) || null;
};

export const getMatchFactors = () => [
  { key: "budget", label: "Budget similarity" },
  { key: "location", label: "Preferred location" },
  { key: "lifestyle", label: "Lifestyle compatibility" },
  { key: "smoking", label: "Smoking preference" },
  { key: "pets", label: "Pet preference" },
  { key: "cleanliness", label: "Cleanliness level" },
];

export default {
  getAllMatches,
  getRecommendedMatches,
  getMatchById,
  getMatchFactors,
};
