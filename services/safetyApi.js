import { apiRequest, buildAuthHeaders } from './apiClient';

export const blockUser = (userId, token) =>
  apiRequest(`/v1/safety/block/${userId}`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
  });

export const unblockUser = (userId, token) =>
  apiRequest(`/v1/safety/block/${userId}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(token),
  });

export const getBlockedUsers = (token) =>
  apiRequest('/v1/safety/blocked', {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });

export const reportUser = (userId, reason, description, token) => {
  const params = new URLSearchParams({ reason });
  if (description) params.append('description', description);
  return apiRequest(`/v1/safety/report/${userId}?${params.toString()}`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
  });
};
