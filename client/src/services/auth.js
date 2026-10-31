const ACCESS_TOKEN_KEY = 'voc_access_token';
const REFRESH_TOKEN_KEY = 'voc_refresh_token';
const USER_KEY = 'voc_user';

export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';
};

export const saveAuthSession = (authData) => {
  const token = authData.access_token || authData.token;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
  if (authData.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, authData.refresh_token);
  }
  const user = {
    id: authData.id,
    name: authData.name,
    email: authData.email,
    role: authData.role,
    avatar: authData.avatar,
    provider: authData.provider,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

export const getStoredTokens = () => {
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    clearAuthSession();
    return null;
  }

  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      }
      if (data.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
      }
      return data.access_token;
    } else {
      clearAuthSession();
      return null;
    }
  } catch (err) {
    console.error('Failed to refresh access token:', err);
    clearAuthSession();
    return null;
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response = await fetch(url, { ...options, headers });

  // If unauthorized and we have a refresh token, try refreshing and retrying once
  if (response.status === 401 && localStorage.getItem(REFRESH_TOKEN_KEY)) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      };
      response = await fetch(url, { ...options, headers: retryHeaders });
    }
  }

  return response;
};
