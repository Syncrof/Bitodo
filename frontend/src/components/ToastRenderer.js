import React from 'react';
import Toast from './Toast';
import { useToast } from '../context/ToastContext';

const ToastRenderer = () => {
  const { toast } = useToast();
  const handleUndo = () => {
    // noop for now
  };
  return <Toast message={toast.message} show={toast.show} onUndo={handleUndo} />;
};

export default ToastRenderer;
