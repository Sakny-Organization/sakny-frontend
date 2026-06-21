import { apiRequest, buildAuthHeaders } from './apiClient';

const token = () => {
  try {
    const session = JSON.parse(localStorage.getItem('sakny_auth_session'));
    return session?.token || null;
  } catch {
    return null;
  }
};

export const getMatchedProperties = () =>
  apiRequest('/v1/tenant/properties/matched', {
    method: 'GET',
    headers: buildAuthHeaders(token()),
  });

export const getPropertyCompatibility = (propertyId) =>
  apiRequest(`/v1/tenant/properties/${propertyId}/compatibility`, {
    method: 'GET',
    headers: buildAuthHeaders(token()),
  });