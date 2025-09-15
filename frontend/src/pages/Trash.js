import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/taskAPI';
import TaskCard from '../components/TaskCard';

const Trash = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await taskAPI.getTasks();
      if (result.success) {
        // Filter only trash tasks
        const trashTasks = result.data.filter(task => task.status === 'TRASH');
        setTasks(trashTasks);
      } else {
        setError('Failed to load tasks');
      }
    } catch (e) {
      console.error('Load trash tasks error:', e);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    console.log('Trash page updating task:', id, updates);
    
    try {
      const result = await taskAPI.updateTask(id, updates);
      if (result.success) {
        // Task durumu değiştiyse ilgili sayfaya yönlendir
        if (updates.status) {
          if (updates.status === 'TODO' || updates.status === 'IN_PROGRESS') {
            console.log('Redirecting to Inbox page');
            navigate('/');
          } else if (updates.status === 'DONE') {
            console.log('Redirecting to Completed page');
            navigate('/completed');
          }
        }
        
        // Bu sayfadan kaldır
        setTasks(prev => prev.filter(task => task.id !== parseInt(id)));
        setError(null);
      } else {
        setError('Failed to update task');
      }
    } catch (e) {
      console.error('Update task error:', e);
      setError('Failed to update task');
    }
  };

  const handleDeleteForever = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this task?')) {
      return;
    }
    
    try {
      const result = await taskAPI.deleteTask(id);
      if (result.success) {
        setTasks(prev => prev.filter(task => task.id !== parseInt(id)));
      } else {
        setError('Failed to delete task');
      }
    } catch (e) {
      console.error('Delete task error:', e);
      setError('Failed to delete task');
    }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm('Are you sure you want to permanently delete all items in trash?')) {
      return;
    }

    try {
      const deletePromises = tasks.map(task => taskAPI.deleteTask(task.id));
      await Promise.all(deletePromises);
      setTasks([]);
    } catch (e) {
      console.error('Empty trash error:', e);
      setError('Failed to empty trash');
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Trash</h1>
          {tasks.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Empty Trash
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading trash...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">⚠️ {error}</div>
            <button 
              onClick={loadTasks}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗑️</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Trash is empty</h2>
            <p className="text-gray-600">Deleted tasks will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                Items in trash are automatically deleted after 30 days.
              </p>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {tasks.length} item{tasks.length !== 1 ? 's' : ''} in trash
            </div>
            {tasks.map((task) => (
              <div key={task.id} className="relative">
                <TaskCard 
                  task={task}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteForever}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trash;