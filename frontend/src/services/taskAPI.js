// Simple API service for backend integration
import { API_BASE_URL } from '../apiConfig';

class TaskAPI {
  async getTasks() {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      return { success: true, data: result.data || [] };
    } catch (error) {
      console.error('getTasks error:', error);
      return { success: false, error: error.message };
    }
  }

  async createTask(taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
      }
      
      const result = await response.json();
      return { success: true, data: result.data || result };
    } catch (error) {
      console.error('createTask error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateTask(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
      }
      
      const result = await response.json();
      return { success: true, data: result.data || result };
    } catch (error) {
      console.error('updateTask error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteTask(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('deleteTask error:', error);
      return { success: false, error: error.message };
    }
  }

  // Move to trash (preferred method)
  async moveToTrash(id) {
    return this.updateTask(id, { status: 'TRASH' });
  }

  // Check if backend is available
  async checkConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch (error) {
      console.warn('Backend connection failed:', error.message);
      return false;
    }
  }
}

// Export singleton instance
export const taskAPI = new TaskAPI();