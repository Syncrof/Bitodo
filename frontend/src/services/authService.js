import apiFetch from '../apiClient';

class AuthService {
  async register({ email, password }) {
    try {
      const { data } = await apiFetch('/auth/register', { method: 'POST', body: { email, password } });
      return { success: true, data };
    } catch (error) {
      console.error('register error:', error);
      return { success: false, error: error.message, status: error.status };
    }
  }

  async login({ email, password }) {
    try {
      const { data } = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
      return { success: true, data };
    } catch (error) {
      console.error('login error:', error);
      return { success: false, error: error.message, status: error.status };
    }
  }

  async logout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
      return { success: true };
    } catch (error) {
      console.error('logout error:', error);
      return { success: false, error: error.message, status: error.status };
    }
  }

  async me() {
    try {
      const { data } = await apiFetch('/auth/me', { method: 'GET' });
      return { success: true, data };
    } catch (error) {
      console.error('me error:', error);
      return { success: false, error: error.message, status: error.status };
    }
  }
}

export const authService = new AuthService();
