import React from 'react';
import Toast from './Toast';
import { useToast } from '../context/ToastContext';

const ToastRenderer = () => {
  const { toast, onUndo } = useToast();
  return <Toast message={toast.message} show={toast.show} onUndo={toast.undoable ? onUndo : undefined} />;
};

export default ToastRenderer;
