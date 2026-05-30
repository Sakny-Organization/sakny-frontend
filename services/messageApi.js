import { apiRequest, buildAuthHeaders } from './apiClient';

export const getConversations = (page = 0, size = 20, token) =>
  apiRequest(`/v1/messages/conversations?page=${page}&size=${size}`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });

export const getMessages = (otherUserId, page = 0, size = 20, token) =>
  apiRequest(`/v1/messages/${otherUserId}?page=${page}&size=${size}&sort=sentAt,desc`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });

export const sendMessageRest = (receiverId, content, token) =>
  apiRequest('/v1/messages', {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify({ receiverId, content }),
  });

export const markMessageRead = (messageId, token) =>
  apiRequest(`/v1/messages/${messageId}/read`, {
    method: 'PATCH',
    headers: buildAuthHeaders(token),
  });
