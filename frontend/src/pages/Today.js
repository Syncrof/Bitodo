import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/taskAPI';
import QuickAdd from '../components/QuickAdd';
import FiltersBar from '../components/FiltersBar';
import TaskCard from '../components/TaskCard';

const Today = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await taskAPI.getTasks({ date: 'today' });
        if (!mounted) return;
        if (res.success) setTasks(res.data || []);
        else setError(res.error || 'Failed to fetch tasks');
      } catch (e) {
        if (!mounted) return;
        setError('Failed to fetch tasks: ' + e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleAddTask = async (newTask) => {
    const taskWithTodayDate = {
      ...newTask,
      dueDate: new Date().toISOString(),
    };
    try {
      const res = await taskAPI.createTask(taskWithTodayDate);
      if (res.success) setTasks((prev) => [...prev, res.data]);
      else setError(res.error || 'Failed to add task');
    } catch (e) {
      setError('Failed to add task: ' + e.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Today</h1>
        <QuickAdd onAddTask={handleAddTask} />
        <FiltersBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No tasks for today</h2>
            <p className="text-gray-600 mb-6">Enjoy your day or add a task to get started!</p>
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
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Today;