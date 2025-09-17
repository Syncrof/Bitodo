import React from 'react';
import { Step, ID } from './TaskItem';

interface StepRowProps {
  step: Step;
  onToggle: (stepId: ID) => void;
  onDelete: (stepId: ID) => void;
}

const StepRow = ({ step, onToggle, onDelete }: StepRowProps) => {
  return (
    <div className="flex items-center gap-2 py-1">
      <button
        role="checkbox"
        aria-checked={step.done}
        onClick={() => onToggle(step.id)}
        className={`size-4 rounded-full border ${step.done ? 'bg-emerald-500' : 'border-white/30'} flex items-center justify-center`}
      >
        {step.done && (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-white">
            <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <span className={`flex-1 ${step.done ? 'line-through opacity-60' : ''}`}>{step.title}</span>
      <button
        onClick={() => onDelete(step.id)}
        className="text-red-500 text-xs ml-2"
        aria-label="Adımı sil"
      >
        Sil
      </button>
    </div>
  );
};

export default StepRow;
