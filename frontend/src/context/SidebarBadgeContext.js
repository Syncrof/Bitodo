import React, { createContext, useContext, useState } from 'react';

const SidebarBadgeContext = createContext(null);

export function SidebarBadgeProvider({ children }) {
  // { completed: false, trash: false, inbox: false, ... }
  const [badges, setBadges] = useState({});

  const triggerBadge = (section) => {
    setBadges((prev) => ({ ...prev, [section]: true }));
    setTimeout(() => setBadges((prev) => ({ ...prev, [section]: false })), 4000);
  };

  return (
    <SidebarBadgeContext.Provider value={{ badges, triggerBadge }}>
      {children}
    </SidebarBadgeContext.Provider>
  );
}

export function useSidebarBadge() {
  const ctx = useContext(SidebarBadgeContext);
  if (!ctx) throw new Error('useSidebarBadge must be used within SidebarBadgeProvider');
  return ctx;
}
