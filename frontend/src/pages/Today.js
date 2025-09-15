import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';
import QuickAdd from '../components/QuickAdd';
import FiltersBar from '../components/FiltersBar';
import TaskCard from '../components/TaskCard';

const Today = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tasks?date=today`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch tasks');
        setLoading(false);
      });
  }, []);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleAddTask = (newTask) => {
    const taskWithTodayDate = {
      ...newTask,
      dueDate: new Date().toISOString(),
    };
    fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskWithTodayDate),
    })
      .then((res) => res.json())
      .then((created) => {
        setTasks((prev) => [...prev, created]);
      })
      .catch(() => setError('Failed to add task'));
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