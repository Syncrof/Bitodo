import React, { useState } from 'react';

const QuickAdd = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask({
        id: Date.now(),
        title: taskTitle.trim(),
        status: 'todo',
        priority: 'medium',
        dueDate: null,
      });
      setTaskTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!taskTitle.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default QuickAdd;