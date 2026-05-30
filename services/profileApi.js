import { apiRequest, buildAuthHeaders } from './apiClient';

/**
 * Create a user profile.
 * Uses FormData for multipart/form-data request.
 *
 * @param {Object} profileData - The profile request data.
 * @param {File} profileImage - Optional profile image file.
 * @param {string} token - The auth token.
 */
export const createProfile = async (profileData, profileImage, token) => {
  const formData = new FormData();

  // Backend expects a @RequestPart("request") for the JSON data
  const jsonBlob = new Blob([JSON.stringify(profileData)], {
    type: 'application/json',
  });
  formData.append('request', jsonBlob);

  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  return apiRequest('/v1/profile', {
    method: 'POST',
    body: formData,
    headers: {
      ...buildAuthHeaders(token),
      // Important: Let the browser set the boundary for multipart/form-data
      'Content-Type': undefined,
    },
  });
};

export const getMyProfile = async (token) => {
  return apiRequest('/v1/profile', {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
};

export const getMyContactInfo = async (token) => {
  return apiRequest('/v1/profile/contact', {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
};

export const updateProfile = async (profileData, token) => {
  return apiRequest('/v1/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
    headers: buildAuthHeaders(token),
  });
};
