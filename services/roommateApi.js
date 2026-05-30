import { apiRequest, buildAuthHeaders } from './apiClient';

export const fetchRoommates = (filters = {}, page = 0, size = 20, token) => {
  const params = new URLSearchParams({ page, size });
  if (filters.gender && filters.gender !== 'All') params.append('gender', filters.gender);
  if (filters.minBudget) params.append('minBudget', filters.minBudget);
  if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
  if (filters.smoking) params.append('smoking', filters.smoking);
  if (filters.pets) params.append('pets', filters.pets);
  if (filters.sleepSchedule) params.append('sleepSchedule', filters.sleepSchedule);
  if (filters.roommateType) params.append('roommateType', filters.roommateType);

  return apiRequest(`/v1/profile/roommates?${params.toString()}`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
};

export const fetchProfileById = (userId, token) =>
  apiRequest(`/v1/profile/${userId}`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });

export const saveProfileApi = (userId, token) =>
  apiRequest(`/v1/profile/${userId}/save`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
  });

export const unsaveProfileApi = (userId, token) =>
  apiRequest(`/v1/profile/${userId}/save`, {
    method: 'DELETE',
    headers: buildAuthHeaders(token),
  });

export const fetchSavedProfiles = (token) =>
  apiRequest('/v1/profile/saved', {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
