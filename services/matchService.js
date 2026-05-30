import { apiRequest, buildAuthHeaders } from './apiClient';

const token = () => localStorage.getItem('token');

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
  const res = await apiRequest(`/v1/profile/roommates${qs ? '?' + qs : ''}`, {
    method: 'GET',
    headers: buildAuthHeaders(token()),
  });
  // Response is ApiResponse<Page<ProfileResponse>> — extract content array
  const page = res?.data ?? res;
  return Array.isArray(page) ? page : (page?.content ?? []);
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
  return res?.data ?? res ?? null;
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
