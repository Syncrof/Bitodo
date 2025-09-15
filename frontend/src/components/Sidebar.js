import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: 'Inbox', path: '/inbox', icon: '📥' },
    { name: 'Today', path: '/today', icon: '📅' },
    { name: 'Upcoming', path: '/upcoming', icon: '⏰' },
    { name: 'Completed', path: '/completed', icon: '✅' },
    { name: 'Trash', path: '/trash', icon: '🗑️' },
  ];

  return (
    <aside className="bg-gray-50 border-r border-gray-200 w-64 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;