import { apiRequest } from './apiClient';

export const authenticate = async ({ email, password }) => {
  // MOCK LOGIN FOR LOCAL TESTING
  return {
    token: "mock-jwt-token-12345",
    refreshToken: "mock-refresh-token-67890",
    userId: 1,
    housingRole: "ROOMMATE",
    profileCompleted: true
  };
};

export const register = async ({ name, email, password, phone, housingRole }) => {
  // MOCK REGISTER FOR LOCAL TESTING
  return {
    token: "mock-jwt-token-12345",
    refreshToken: "mock-refresh-token-67890",
    userId: 1,
    housingRole: housingRole || "ROOMMATE",
    profileCompleted: false
  };
};
