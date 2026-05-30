import matchService from './matchService';

export const defaultSearchFilters = {
  gender: 'All',
  budgetRange: { min: 500, max: 9000 },
  smoking: 'Any',
  pets: 'Any',
  sleepSchedule: 'Any',
  roommateType: 'Any',
};

export const buildSearchPayload = (filters) => {
  const payload = {
    gender: filters.gender !== 'All' ? filters.gender : undefined,
    minBudget: filters.budgetRange?.min,
    maxBudget: filters.budgetRange?.max,
    smoking: filters.smoking !== 'Any' ? filters.smoking : undefined,
    pets: filters.pets !== 'Any' ? filters.pets : undefined,
    sleepSchedule: filters.sleepSchedule !== 'Any' ? filters.sleepSchedule : undefined,
    roommateType: filters.roommateType !== 'Any' ? filters.roommateType : undefined,
  };
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
};

export const searchMatches = async (filters) => {
  const payload = buildSearchPayload(filters);
  const items = await matchService.getAllMatches(filters);
  return {
    items: Array.isArray(items) ? items : [],
    meta: {
      total: Array.isArray(items) ? items.length : 0,
      payload,
      hasActiveFilters: Object.keys(payload).length > 0,
    },
  };
};

export const getSearchFilterOptions = () => ({
  smoking: ['Any', 'NON_SMOKER', 'SOMETIMES', 'SMOKE_OFTEN'],
  pets: ['Any', 'NO_PETS', 'HAVE_PETS'],
  sleepSchedule: ['Any', 'EARLY_BIRD', 'NIGHT_OWL', 'FLEXIBLE'],
  roommateType: ['Any', 'STUDENT', 'WORKING_PROFESSIONAL', 'DONT_MIND'],
});

export default { defaultSearchFilters, buildSearchPayload, searchMatches, getSearchFilterOptions };
