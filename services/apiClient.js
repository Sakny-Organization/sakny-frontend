const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const AUTH_STORAGE_KEY = 'sakny_auth_session';

export const buildAuthHeaders = (token) => {
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

const getStoredSession = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const updateStoredTokens = (token, refreshToken) => {
  const session = getStoredSession();
  if (session) {
    session.token = token;
    session.refreshToken = refreshToken;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }
};

const clearStoredSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const attemptTokenRefresh = async () => {
  const session = getStoredSession();
  if (!session?.refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!response.ok) {
      clearStoredSession();
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
      return null;
    }

    const data = await response.json();
    updateStoredTokens(data.token, data.refreshToken);
    return data.token;
  } catch {
    clearStoredSession();
    window.dispatchEvent(new CustomEvent('auth:session-expired'));
    return null;
  }
};

export const apiRequest = async (path, options = {}) => {
  const { headers = {}, body, ...restOptions } = options;

  const finalHeaders = { ...headers };

  if (body) {
    if (body instanceof FormData) {
      delete finalHeaders['Content-Type'];
    } else if (!finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json';
    }
  }

  if (headers && Object.prototype.hasOwnProperty.call(headers, 'Content-Type') && headers['Content-Type'] === undefined) {
    delete finalHeaders['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    body,
    headers: finalHeaders,
  });

  if (response.status === 401 && finalHeaders.Authorization) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addRefreshSubscriber(async (newToken) => {
          if (!newToken) {
            reject(new Error('Session expired. Please log in again.'));
            return;
          }
          finalHeaders.Authorization = `Bearer ${newToken}`;
          try {
            const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
              ...restOptions,
              body,
              headers: finalHeaders,
            });
            const retryPayload = await retryResponse.json().catch(() => null);
            if (!retryResponse.ok) {
              reject(new Error(retryPayload?.message || 'Request failed'));
            } else {
              resolve(retryPayload);
            }
          } catch (err) {
            reject(err);
          }
        });
      });
    }

    isRefreshing = true;
    const newToken = await attemptTokenRefresh();
    isRefreshing = false;
    onRefreshed(newToken);

    if (!newToken) {
      throw new Error('Session expired. Please log in again.');
    }

    finalHeaders.Authorization = `Bearer ${newToken}`;
    const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
      ...restOptions,
      body,
      headers: finalHeaders,
    });

    let retryPayload = null;
    try {
      retryPayload = await retryResponse.json();
    } catch {
      retryPayload = null;
    }

    if (!retryResponse.ok) {
      const message = retryPayload?.message || retryPayload?.error || 'Request failed.';
      throw new Error(message);
    }

    return retryPayload;
  }

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
