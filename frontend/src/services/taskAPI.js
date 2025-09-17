// Simple API service for backend integration
import apiFetch from '../apiClient';

class TaskAPI {
  // Accept optional query: string (e.g. '?date=today') or object ({ date: 'today' })
  async getTasks(query) {
    try {
      let path = '/tasks';
      if (query) {
        if (typeof query === 'string') path = `${path}${query}`;
        else path = `${path}?${new URLSearchParams(query).toString()}`;
      }
      const { data } = await apiFetch(path, { method: 'GET' });
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('getTasks error:', error);
      return { success: false, error: error.message, status: error.status };
    }
  }

  async createTask(taskData) {
    try {
      const { data } = await apiFetch('/tasks', { method: 'POST', body: taskData });
      return { success: true, data: data || null };
    } catch (error) {
      console.error('createTask error:', error);
      return { success: false, error: error.message, status: error.status };
    }
  }

  async updateTask(id, updates) {
    try {
      const { data } = await apiFetch(`/tasks/${id}`, { method: 'PATCH', body: updates });
      return { success: true, data: data || null };
    } catch (error) {
      console.error('updateTask error:', error);
      return { success: false, error: error.message, status: error.status };
    }
  }

  async deleteTask(id) {
    try {
      await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
      return { success: true };
    } catch (error) {
      console.error('deleteTask error:', error);
      return { success: false, error: error.message, status: error.status };
    }
  }

  async moveToTrash(id) {
    return this.updateTask(id, { status: 'TRASH' });
  }

  async checkConnection() {
    try {
      const { status } = await apiFetch('/health', { method: 'GET' });
      return status === 200;
    } catch (error) {
      console.warn('Backend connection failed:', error.message);
      return false;
    }
  }
}

export const taskAPI = new TaskAPI();