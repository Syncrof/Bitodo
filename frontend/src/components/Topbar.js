import React from 'react';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ onNewTask }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-blue-600">Bitodo</h1>
        {user && <div className="text-sm text-gray-600">{user.email}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onNewTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span className="text-lg">+</span>
          New Task
        </button>
        {user && (
          <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
        )}
      </div>
    </header>
  );
};

export default Topbar;