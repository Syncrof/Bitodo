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
        background: 'linear-gradient(90deg, #ff00cc, #3333ff, #00ffcc, #ffcc00, #ff00cc)',
        backgroundSize: '400% 400%',
        animation: 'rgb-gradient 6s ease-in-out infinite',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}
    >
      <span>{message}</span>
      {onUndo && (
        <button
          onClick={onUndo}
          className="px-3 py-1 rounded-md border border-white/60 bg-white/20 text-white text-sm font-semibold shadow-sm hover:bg-white/80 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-transparent"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <span className="inline-flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline-block align-middle opacity-80"><path d="M7.5 3L3 7.5L7.5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Geri Al
          </span>
        </button>
      )}
      <style>{`
        @keyframes rgb-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
