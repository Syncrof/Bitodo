import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebarBadge } from '../context/SidebarBadgeContext';

const Sidebar = () => {
  const { badges } = useSidebarBadge();
  const navItems = [
    { name: 'Inbox', path: '/inbox', icon: '📥', key: 'inbox' },
    { name: 'Today', path: '/today', icon: '📅', key: 'today' },
    { name: 'Upcoming', path: '/upcoming', icon: '⏰', key: 'upcoming' },
    { name: 'Completed', path: '/completed', icon: '✅', key: 'completed' },
    { name: 'Trash', path: '/trash', icon: '🗑️', key: 'trash' },
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
            <span className="text-lg relative">
              {item.icon}
              {badges[item.key] && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"></span>
              )}
            </span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;