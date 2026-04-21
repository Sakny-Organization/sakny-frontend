const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const buildAuthHeaders = (token) => {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const apiRequest = async (path, options = {}) => {
  const { headers = {}, body, ...restOptions } = options;

  const finalHeaders = { ...headers };

  // Handle Content-Type based on body type and explicit header overrides
  if (body) {
    if (body instanceof FormData) {
      // For FormData, we must delete Content-Type to let the browser set the multipart boundary
      delete finalHeaders['Content-Type'];
    } else if (!finalHeaders['Content-Type']) {
      // Default to application/json for other body types (like JSON strings) if not explicitly set
      finalHeaders['Content-Type'] = 'application/json';
    }
  }

  // If Content-Type was explicitly set to undefined in options.headers, ensure it is removed
  if (headers && Object.prototype.hasOwnProperty.call(headers, 'Content-Type') && headers['Content-Type'] === undefined) {
    delete finalHeaders['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    body,
    headers: finalHeaders,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      payload?.detail ||
      'Request failed. Please try again.';
    throw new Error(message);
  }

  return payload;
};
