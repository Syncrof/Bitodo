import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onUndo?: () => void;
}

const Toast = ({ message, show, onUndo }: ToastProps) => {
  const [visible, setVisible] = useState(show);
  useEffect(() => {
    setVisible(show);
    if (!show) return;
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-8 py-4 rounded-2xl shadow-2xl animate-fade-in-out font-medium text-white text-lg"
      style={{
        background: '#222C3A',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'
      }}
    >
      <span>{message}</span>
      {onUndo && (
        <button
          onClick={onUndo}
          className="px-7 py-2 rounded-xl border border-white/40 bg-white/10 text-white text-base font-bold shadow hover:bg-white/80 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-transparent"
          style={{ minWidth: '110px', height: '44px', backdropFilter: 'blur(4px)', letterSpacing: '0.02em' }}
        >
          <span className="inline-flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block align-middle opacity-80"><path d="M7.5 3L3 7.5L7.5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Geri Al
          </span>
        </button>
      )}
      
    </div>
  );
};
export default Toast;
