import React, { createContext, useContext, useState, useCallback } from 'react';
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, message: '', undoable: false });
  const [lastAction, setLastAction] = useState(null); // { type, prevTask, id }

  const showToast = useCallback((message, options = {}) => {
    setToast({ show: true, message, undoable: !!options.undoable });
    if (options.action) setLastAction(options.action);
    setTimeout(() => setToast({ show: false, message: '', undoable: false }), 4000);
  }, []);

  const onUndo = useCallback(async () => {
    if (!lastAction) return;
    // Undo logic: call the provided undo function or revert the task
    if (lastAction.onUndo) {
      await lastAction.onUndo();
    }
    setToast({ show: false, message: '', undoable: false });
    setLastAction(null);
  }, [lastAction]);

  return (
    <ToastContext.Provider value={{ toast, showToast, onUndo }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
