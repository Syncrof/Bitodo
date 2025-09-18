import apiFetch from '../apiClient';

export const AuthService = {
  register: (payload) =>
    apiFetch('/auth/register', { method: 'POST', body: payload }),
  login: (payload) =>
    apiFetch('/auth/login', { method: 'POST', body: payload }),
  me: () => apiFetch('/auth/me'),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
};
