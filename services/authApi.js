import { apiRequest } from './apiClient';

export const register = (request) => {
  return apiRequest('/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const authenticate = (request) => {
  return apiRequest('/v1/auth/authenticate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

