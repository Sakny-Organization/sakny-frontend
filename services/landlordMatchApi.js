import { apiRequest, buildAuthHeaders } from './apiClient';

const token = () => {
  try {
    const session = JSON.parse(localStorage.getItem('sakny_auth_session'));
    return session?.token || null;
  } catch {
    return null;
  }
};

export const getTenantMatches = (propertyId) =>
  apiRequest(`/v1/landlord/properties/${propertyId}/tenants`, {
    method: 'GET',
    headers: buildAuthHeaders(token()),
  });

export const getTenantCompatibility = (propertyId, userId) =>
  apiRequest(`/v1/landlord/properties/${propertyId}/tenants/${userId}/compatibility`, {
    method: 'GET',
    headers: buildAuthHeaders(token()),
  });

export const getLandlordRecommendations = (limit = 10) =>
  apiRequest(`/v1/landlord/recommendations?limit=${limit}`, {
    method: 'GET',
    headers: buildAuthHeaders(token()),
  });
