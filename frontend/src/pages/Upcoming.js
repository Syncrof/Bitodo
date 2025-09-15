import React, { useState } from 'react';
import QuickAdd from '../components/QuickAdd';
import FiltersBar from '../components/FiltersBar';
import TaskCard from '../components/TaskCard';

const Upcoming = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Bug fixes for mobile app',
      status: 'todo',
      priority: 'high',
      dueDate: '2025-09-17',
    },
    {
      id: 2,
      title: 'Update website content',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2025-09-18',
    },
    {
      id: 3,
      title: 'Quarterly review meeting',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-09-20',
    },
  ]);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleAddTask = (newTask) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const taskWithFutureDate = {
      ...newTask,
      dueDate: tomorrow.toISOString().split('T')[0],
    };
    setTasks([...tasks, taskWithFutureDate]);
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
        
        {filteredTasks.length === 0 ? (
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
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;