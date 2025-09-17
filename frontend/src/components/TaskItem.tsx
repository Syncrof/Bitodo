import React from 'react';

export type ID = string;
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'TRASH';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | null;
export type Step = {
  id: ID;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};
export type Task = {
  id: ID;
  title: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  notes?: string | null;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
};

interface TaskItemProps {
  task: Task;
  onToggleDone: (id: ID) => void;
  onOpenDetails: (task: Task) => void;
}

const TaskItem = ({ task, onToggleDone, onOpenDetails }: TaskItemProps) => {
  const checked = task.status === 'DONE';

  return (
    <li className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5">
      <button
        role="checkbox"
        aria-checked={checked}
  onClick={(e: any) => { e.stopPropagation(); onToggleDone(task.id); }}
        className={`size-5 rounded-full border ${checked ? 'bg-emerald-500' : 'border-white/30'} flex items-center justify-center transition-transform duration-150`}
      >
        {checked && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
            <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div
        onClick={() => onOpenDetails(task)}
        className={`flex-1 truncate cursor-pointer ${checked ? 'line-through opacity-60' : ''}`}
      >
        {task.title}
      </div>
    </li>
  );
};

export default TaskItem;
