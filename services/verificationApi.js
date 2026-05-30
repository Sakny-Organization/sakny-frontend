import { apiRequest, buildAuthHeaders } from './apiClient';

export const submitVerification = async (frontId, backId, selfie, token) => {
  const formData = new FormData();
  formData.append('frontId', frontId);
  formData.append('backId', backId);
  formData.append('selfie', selfie);

  return apiRequest('/v1/verification/submit', {
    method: 'POST',
    body: formData,
    headers: {
      ...buildAuthHeaders(token),
      'Content-Type': undefined,
    },
  });
};

export const getVerificationStatus = async (token) => {
  return apiRequest('/v1/verification/status', {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
};
