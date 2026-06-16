import { apiRequest, buildAuthHeaders } from './apiClient';

export const fetchNotifications = (page = 0, size = 20, token) =>
  apiRequest(`/v1/notifications?page=${page}&size=${size}`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });

export const fetchUnreadCount = (token) =>
  apiRequest('/v1/notifications/unread-count', {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });

export const markNotificationRead = (id, token) =>
  apiRequest(`/v1/notifications/${id}/read`, {
    method: 'PATCH',
    headers: buildAuthHeaders(token),
  });

export const markAllNotificationsRead = (token) =>
  apiRequest('/v1/notifications/read-all', {
    method: 'PATCH',
    headers: buildAuthHeaders(token),
  });
