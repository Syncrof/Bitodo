import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/taskAPI';
import QuickAdd from '../components/QuickAdd';
import FiltersBar from '../components/FiltersBar';
import TaskCard from '../components/TaskCard';

const Upcoming = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    loadUpcomingTasks();
  }, []);

  const loadUpcomingTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await taskAPI.getTasks();
      if (result.success) {
        // Filter tasks that have future due dates
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const upcomingTasks = result.data.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate >= tomorrow && task.status !== 'DONE' && task.status !== 'TRASH';
        });
        
        setTasks(upcomingTasks);
      } else {
        setError('Failed to load tasks');
      }
    } catch (e) {
      console.error('Load upcoming tasks error:', e);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (newTask) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const taskWithFutureDate = {
      ...newTask,
      dueDate: tomorrow.toISOString(),
    };
    
    try {
      const result = await taskAPI.createTask(taskWithFutureDate);
      if (result.success) {
        setTasks(prev => [result.data, ...prev]);
        setError(null);
      } else {
        setError('Failed to add task');
      }
    } catch (e) {
      console.error('Add task error:', e);
      setError('Failed to add task');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const result = await taskAPI.updateTask(id, updates);
      if (result.success) {
        setTasks(prev => prev.map(task => 
          task.id === id ? result.data : task
        ));
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

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Upcoming</h1>
        <QuickAdd onAddTask={handleAddTask} />
        <FiltersBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No upcoming tasks</h2>
            <p className="text-gray-600 mb-6">Plan ahead by adding future tasks!</p>
            <button
              onClick={() => document.querySelector('input').focus()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Add Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
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

export default Upcoming;