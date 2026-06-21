import { apiRequest, buildAuthHeaders } from './apiClient';

export const fetchProperties = (filters = {}, page = 0, size = 12, token) => {
  const params = new URLSearchParams({ page, size });
  if (filters.governorateId) params.append('governorateId', filters.governorateId);
  if (filters.cityId) params.append('cityId', filters.cityId);
  if (filters.propertyType) params.append('propertyType', filters.propertyType);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.furnished !== undefined && filters.furnished !== '') {
    params.append('furnished', filters.furnished);
  }
  return apiRequest(`/v1/properties?${params.toString()}`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
};

export const fetchProperty = (id, token) =>
  apiRequest(`/v1/properties/${id}`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });

export const fetchMyProperties = (token) =>
  apiRequest('/v1/properties/my', {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });

export const createProperty = (propertyData, images, token) => {
  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(propertyData)], { type: 'application/json' });
  formData.append('request', jsonBlob);
  if (images && images.length > 0) {
    images.forEach((img) => formData.append('images', img));
  }
  return apiRequest('/v1/properties', {
    method: 'POST',
    body: formData,
    headers: {
      ...buildAuthHeaders(token),
      'Content-Type': undefined,
    },
  });
};

export const updateProperty = (id, propertyData, token) =>
  apiRequest(`/v1/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(propertyData),
    headers: buildAuthHeaders(token),
  });

export const deleteProperty = (id, token) =>
  apiRequest(`/v1/properties/${id}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(token),
  });

export const togglePropertyStatus = (id, token) =>
  apiRequest(`/v1/properties/${id}/status`, {
    method: 'PATCH',
    headers: buildAuthHeaders(token),
  });

export const fetchAmenities = () =>
  apiRequest('/v1/amenities', { method: 'GET' });

export const createReservation = (reservationData, token) =>
  apiRequest('/v1/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData),
    headers: buildAuthHeaders(token),
  });

export const fetchMyReservations = (token) =>
  apiRequest('/v1/reservations/my', {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
