import React, { useState } from 'react';
import QuickAdd from '../components/QuickAdd';
import FiltersBar from '../components/FiltersBar';
import TaskCard from '../components/TaskCard';

const Today = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Team meeting preparation',
      status: 'done',
      priority: 'low',
      dueDate: '2025-09-15',
    },
    {
      id: 2,
      title: 'Review project proposals',
      status: 'todo',
      priority: 'high',
      dueDate: '2025-09-15',
    },
  ]);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleAddTask = (newTask) => {
    const taskWithTodayDate = {
      ...newTask,
      dueDate: new Date().toISOString().split('T')[0],
    };
    setTasks([...tasks, taskWithTodayDate]);
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
        
        {filteredTasks.length === 0 ? (
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