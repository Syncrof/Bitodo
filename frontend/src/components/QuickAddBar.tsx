import React, { useState } from 'react';
// React tipleri global olarak mevcut, ayrıca import etmeye gerek yok

type QuickAddBarProps = {
  onSubmit: (title: string) => void;
};

const QuickAddBar = ({ onSubmit }: QuickAddBarProps) => {
  const [title, setTitle] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (title.trim()) {
        onSubmit(title.trim());
        setTitle('');
      }
    }
    if (e.key === 'Escape') {
      setTitle('');
    }
  };

  return (
    <form
      role="form"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(900px,92vw)] h-16 rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-neutral-900/30 border border-white/30 dark:border-white/10 shadow-2xl flex items-center px-4"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if (title.trim()) { onSubmit(title.trim()); setTitle(''); } }}
    >
      <span className="mr-3 text-2xl text-white/60 dark:text-white/40 select-none">+</span>
      <input
        type="text"
        aria-label="Yeni görev"
        className="w-full h-full bg-transparent outline-none placeholder-white/80 dark:placeholder-white/50 px-5 text-lg"
        placeholder="Görev ekle…"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {/* Sağda due/priority kısa ikonları opsiyonel olarak eklenebilir */}
    </form>
  );
};

export default QuickAddBar;
