import { apiRequest } from './apiClient';

export const authenticate = async ({ email, password }) => {
  return apiRequest('/v1/auth/authenticate', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async ({ name, email, password, phone, housingRole }) => {
  return apiRequest('/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone, housingRole }),
  });
};
