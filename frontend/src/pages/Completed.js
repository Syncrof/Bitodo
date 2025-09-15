import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/taskAPI';
import TaskCard from '../components/TaskCard';

const Completed = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompletedTasks();
  }, []);

  const loadCompletedTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await taskAPI.getTasks();
      if (result.success) {
        // Filter only completed tasks
        const completedTasks = result.data.filter(task => task.status === 'DONE');
        setTasks(completedTasks);
      } else {
        setError('Failed to load tasks');
      }
    } catch (e) {
      console.error('Load completed tasks error:', e);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    console.log('Completed page updating task:', id, updates);
    
    try {
      const result = await taskAPI.updateTask(id, updates);
      if (result.success) {
        // Task durumu değiştiyse ilgili sayfaya yönlendir
        if (updates.status) {
          if (updates.status === 'TODO' || updates.status === 'IN_PROGRESS') {
            console.log('Redirecting to Inbox page');
            navigate('/');
          } else if (updates.status === 'TRASH') {
            console.log('Redirecting to Trash page');
            navigate('/trash');
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

  const handleDeleteTask = async (id) => {
    try {
      const result = await taskAPI.deleteTask(id);
      if (result.success) {
        setTasks(prev => prev.filter(task => task.id !== parseInt(id)));
        setError(null);
      } else {
        setError('Failed to delete task');
      }
    } catch (e) {
      console.error('Delete task error:', e);
      setError('Failed to delete task');
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Completed</h1>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No completed tasks</h2>
            <p className="text-gray-600">Complete some tasks to see them here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                🎉 Great job! You've completed {tasks.length} task{tasks.length !== 1 ? 's' : ''}.
              </p>
            </div>
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Completed;