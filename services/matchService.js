import { apiRequest, buildAuthHeaders } from './apiClient';

const token = () => {
  try {
    const session = JSON.parse(localStorage.getItem('sakny_auth_session'));
    return session?.token || null;
  } catch {
    return null;
  }
};

export const getAllMatches = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.gender && filters.gender !== 'All') params.set('gender', filters.gender);
  if (filters.budgetRange?.min != null) params.set('minBudget', filters.budgetRange.min);
  if (filters.budgetRange?.max != null) params.set('maxBudget', filters.budgetRange.max);
  if (filters.smoking && filters.smoking !== 'Any') params.set('smoking', filters.smoking);
  if (filters.pets && filters.pets !== 'Any') params.set('pets', filters.pets);
  if (filters.sleepSchedule && filters.sleepSchedule !== 'Any') params.set('sleepSchedule', filters.sleepSchedule);
  if (filters.roommateType && filters.roommateType !== 'Any') params.set('roommateType', filters.roommateType);

  const qs = params.toString();
  const res = await apiRequest(`/v1/profile/roommates/scored${qs ? '?' + qs : ''}`, {
    method: 'GET',
    headers: buildAuthHeaders(token()),
  });

  const page = res?.data ?? res;
  const content = Array.isArray(page) ? page : (page?.content ?? []);

  // Each item is { score, breakdown, strengths, conflicts, profile }
  return content.map(item => {
    if (item.profile) {
      return { ...item.profile, matchScore: item.score, matchBreakdown: item.breakdown, strengths: item.strengths, conflicts: item.conflicts };
    }
    return item;
  });
};

export const getRecommendedMatches = async (limit = 4) => {
  // Use the same roommates endpoint, just take the first `limit` results
  const all = await getAllMatches();
  return all.slice(0, limit);
};

export const getMatchById = async (id) => {
  const res = await apiRequest(`/v1/profile/${id}`, {
    method: 'GET',
    headers: buildAuthHeaders(token()),
  });
  const profile = res?.data ?? res ?? null;

  // Also fetch compatibility score
  try {
    const scoreRes = await apiRequest(`/v1/profile/${id}/compatibility`, {
      method: 'GET',
      headers: buildAuthHeaders(token()),
    });
    const scoreData = scoreRes?.data ?? scoreRes;
    if (scoreData && profile) {
      profile.matchScore = scoreData.score;
      profile.matchBreakdown = scoreData.breakdown;
      profile.strengths = scoreData.strengths;
      profile.conflicts = scoreData.conflicts;
    }
  } catch {
    // Compatibility endpoint might fail, that's ok
  }

  return profile;
};

export const getMatchFactors = () => [
  { key: 'budget', label: 'Budget similarity' },
  { key: 'location', label: 'Preferred location' },
  { key: 'lifestyle', label: 'Lifestyle compatibility' },
  { key: 'smoking', label: 'Smoking preference' },
  { key: 'pets', label: 'Pet preference' },
  { key: 'cleanliness', label: 'Cleanliness level' },
];

export default { getAllMatches, getRecommendedMatches, getMatchById, getMatchFactors };
