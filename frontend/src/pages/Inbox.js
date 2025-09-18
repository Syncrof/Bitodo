// src/pages/Inbox.js
import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useSidebarBadge } from '../context/SidebarBadgeContext';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/taskAPI';
import QuickAdd from '../components/QuickAdd';
import FiltersBar from '../components/FiltersBar';
import TaskCard from '../components/TaskCard';

const Inbox = () => {
  const { showToast } = useToast();
  const { triggerBadge } = useSidebarBadge();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  // Her zaman güvenli, null olamaz
  const safeTasks = Array.isArray(tasks) ? tasks.filter(Boolean) : [];
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'TODO' | 'IN_PROGRESS' | 'DONE' | 'TRASH'
  const [activePriority, setActivePriority] = useState('all'); // 'all' | 'LOW' | 'MEDIUM' | 'HIGH'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search/input on '/' key
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
      // Open Quick Add on 'N' key
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
  const result = await taskAPI.getTasks();
      console.log('API result:', result);
      
      if (result.success) {
        setTasks(result.data || []);
        console.log('Tasks loaded:', result.data?.length || 0);
      } else {
        setError(result.error || 'Failed to load tasks');
        console.error('Load tasks failed:', result.error);
      }
    } catch (e) {
      console.error('Load tasks exception:', e);
      setError('Failed to load tasks: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const handleAddTask = async (newTask) => {
    const payload = {
      title: newTask?.title?.trim(),
      status: 'TODO',
      priority: 'MEDIUM',
    };
    
    if (!payload.title) {
      setError('Task title is required');
      return;
    }

    console.log('Adding task:', payload);

    try {
      const result = await taskAPI.createTask(payload);
      console.log('Create task result:', result);
      
      if (result.success) {
        setTasks(prev => ([...(Array.isArray(prev) ? prev : []), result.data].filter(Boolean)));
        setError(null); // Clear any previous errors
        console.log('Task added successfully');
        loadTasks();
      } else {
        setError(result.error || 'Failed to add task');
        console.error('Add task failed:', result.error);
      }
    } catch (e) {
      console.error('Add task exception:', e);
      setError('Failed to add task: ' + e.message);
    }
  };

  // Update task
  const handleUpdateTask = async (id, updates) => {
    const prevTask = safeTasks.find(t => t.id === id);
    try {
      const result = await taskAPI.updateTask(id, updates);
      if (result.success) {
        setTasks(prev => (Array.isArray(prev) ? prev.map(task => (task?.id === id ? result.data : task)).filter(Boolean) : []));
        setError(null);
        loadTasks();
        // Bildirim ve badge göster
        if (updates.status) {
          if (updates.status === 'DONE') {
            showToast('Görev tamamlandı!', {
              undoable: true,
              action: {
                onUndo: async () => {
                  await taskAPI.updateTask(id, { status: prevTask.status });
                  loadTasks();
                }
              }
            });
            triggerBadge('completed');
          } else if (updates.status === 'TRASH') {
            showToast('Görev çöp kutusuna taşındı!', {
              undoable: true,
              action: {
                onUndo: async () => {
                  await taskAPI.updateTask(id, { status: prevTask.status });
                  loadTasks();
                }
              }
            });
            triggerBadge('trash');
          } else if (updates.status === 'TODO' || updates.status === 'IN_PROGRESS') {
            showToast('Görev geri alındı!', {
              undoable: true,
              action: {
                onUndo: async () => {
                  await taskAPI.updateTask(id, { status: prevTask.status });
                  loadTasks();
                }
              }
            });
            triggerBadge('inbox');
          }
        }
      } else {
        setError(result.error || 'Failed to update task');
      }
    } catch (e) {
      setError('Failed to update task: ' + e.message);
    }
  };

  // Delete task permanently
  const handleDeleteTask = async (id) => {
    console.log('Deleting task:', id);
    
    try {
      const result = await taskAPI.deleteTask(id);
      console.log('Delete task result:', result);
      
      if (result.success) {
        setTasks(prev => (Array.isArray(prev) ? prev.filter(task => task && task.id !== id) : []));
        setError(null);
        console.log('Task deleted successfully');
        loadTasks();
      } else {
        setError(result.error || 'Failed to delete task');
        console.error('Delete task failed:', result.error);
      }
    } catch (e) {
      console.error('Delete task exception:', e);
      setError('Failed to delete task: ' + e.message);
    }
  };

  // Filter tasks - Inbox sadece active taskları gösterir
 // Yenisi:
  const filteredTasks = safeTasks.filter((task) => {
    if (!task || !task.status) return false;
    if (task.status === 'DONE' || task.status === 'TRASH') return false;
    if (activeFilter !== 'all' && task.status !== activeFilter) return false;
    if (activePriority !== 'all' && task.priority !== activePriority) return false;
    return true;
  });

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
        </div>

        <QuickAdd onAddTask={handleAddTask} />
        <FiltersBar 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          activePriority={activePriority}
          onPriorityChange={setActivePriority}
        />

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading tasks...</p>
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
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              {activeFilter === 'all' ? 'No tasks yet' : `No ${activeFilter.toLowerCase()} tasks`}
            </h2>
            <p className="text-gray-600 mb-6">
              {activeFilter === 'all' 
                ? 'Get organized by adding your first task!' 
                : 'Try changing your filters or add a new task.'
              }
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => document.querySelector('input')?.focus()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Add Task
              </button>
              {activeFilter !== 'all' && (
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    setActivePriority('all');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">/</kbd> to focus search or{' '}
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">N</kbd> to add task
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id ?? `${task.title}-${task.createdAt ?? ''}`} 
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

export default Inbox;
