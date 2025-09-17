import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onUndo: () => void;
}

const Toast = ({ message, show, onUndo }: ToastProps) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      // Otomatik olarak toastı kapatmak için
    }, 4000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-4">
      <span>{message}</span>
      <button onClick={onUndo} className="bg-white text-gray-900 px-3 py-1 rounded">Geri Al</button>
    </div>
  );
};

export default Toast;
