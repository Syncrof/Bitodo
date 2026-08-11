import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiLogOut } from 'react-icons/fi';

const Topbar = ({ onNewTask }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
            B
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-slate-800 tracking-tight">
            Bitodo
          </h1>
        </div>
        {user && <div className="hidden sm:block text-sm text-slate-500 font-medium px-3 py-1 bg-slate-100 rounded-full">{user.email}</div>}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onNewTask}
          className="bg-brand-600 hover:bg-brand-500 active:scale-95 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 font-medium"
        >
          <FiPlus className="text-lg" />
          <span className="hidden sm:inline">New Task</span>
        </button>
        {user && (
          <button 
            onClick={handleLogout} 
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Logout"
          >
            <FiLogOut className="text-xl" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;