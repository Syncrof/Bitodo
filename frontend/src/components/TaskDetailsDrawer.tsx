import React, { useState } from 'react';
import { Task, Step, ID } from './TaskItem';

interface TaskDetailsDrawerProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (id: ID, updates: Partial<Task>) => void;
  onAddStep: (taskId: ID, title: string) => void;
  onUpdateStep: (taskId: ID, stepId: ID, updates: Partial<Step>) => void;
  onDeleteStep: (taskId: ID, stepId: ID) => void;
}

const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({
  task,
  onClose,
  onUpdateTask,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
}) => {
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [newStep, setNewStep] = useState('');

  if (!task) return null;

  return (
    <div
      className="fixed top-0 right-0 h-full w-[440px] bg-white dark:bg-neutral-900 shadow-2xl z-50 transition-transform duration-200"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="p-6 flex flex-col gap-4 h-full">
        <input
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={() => editTitle.trim() && onUpdateTask(task.id, { title: editTitle.trim() })}
          className="text-2xl font-bold bg-transparent outline-none border-b border-gray-200 dark:border-gray-700 pb-2"
        />
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onBlur={() => onUpdateTask(task.id, { notes })}
          className="w-full min-h-[64px] bg-transparent outline-none border-b border-gray-200 dark:border-gray-700 pb-2"
          placeholder="Not ekle..."
        />
        <div>
          <div className="font-semibold mb-2">Adımlar</div>
          <ul className="space-y-2">
            {task.steps.map(step => (
              <li key={step.id} className="flex items-center gap-2">
                <button
                  role="checkbox"
                  aria-checked={step.done}
                  onClick={() => onUpdateStep(task.id, step.id, { done: !step.done })}
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
                  onClick={() => onDeleteStep(task.id, step.id)}
                  className="text-red-500 text-xs ml-2"
                  aria-label="Adımı sil"
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (newStep.trim()) {
                onAddStep(task.id, newStep.trim());
                setNewStep('');
              }
            }}
            className="flex gap-2 mt-2"
          >
            <input
              type="text"
              value={newStep}
              onChange={e => setNewStep(e.target.value)}
              className="flex-1 px-2 py-1 border rounded"
              placeholder="Yeni adım..."
            />
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Ekle</button>
          </form>
        </div>
        <div className="mt-auto flex gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded">Kapat</button>
          <button onClick={() => onUpdateTask(task.id, { status: 'TRASH' })} className="px-4 py-2 bg-red-600 text-white rounded">Çöpe Taşı</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsDrawer;
