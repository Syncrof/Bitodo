import React from 'react';

const Topbar = ({ onNewTask }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-blue-600">Bitodo</h1>
      </div>
      <button
        onClick={onNewTask}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <span className="text-lg">+</span>
        New Task
      </button>
    </header>
  );
};

export default Topbar;