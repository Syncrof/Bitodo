import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebarBadge } from '../context/SidebarBadgeContext';
import { FiInbox, FiCalendar, FiClock, FiCheckCircle, FiTrash2 } from 'react-icons/fi';

const Sidebar = () => {
  const { badges } = useSidebarBadge();
  const navItems = [
    { name: 'Inbox', path: '/inbox', icon: <FiInbox />, key: 'inbox' },
    { name: 'Today', path: '/today', icon: <FiCalendar />, key: 'today' },
    { name: 'Upcoming', path: '/upcoming', icon: <FiClock />, key: 'upcoming' },
    { name: 'Completed', path: '/completed', icon: <FiCheckCircle />, key: 'completed' },
    { name: 'Trash', path: '/trash', icon: <FiTrash2 />, key: 'trash' },
  ];

  return (
    <aside className="bg-white/50 backdrop-blur-sm border-r border-slate-200/60 w-64 p-4 h-[calc(100vh-4rem)] overflow-y-auto hidden md:block">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm shadow-brand-100'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:translate-x-1'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-xl transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-500'} relative`}>
                  {item.icon}
                  {badges[item.key] && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
                    </span>
                  )}
                </span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;