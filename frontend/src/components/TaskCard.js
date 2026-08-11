import React, { useState } from 'react';
import { FiCheck, FiTrash2, FiRefreshCcw, FiEdit2, FiX, FiCalendar } from 'react-icons/fi';

const TaskCard = ({ task, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title || '');

  console.log('TaskCard rendered with task:', task);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'TODO':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'IN_PROGRESS':
        return 'bg-brand-50 text-brand-600 border-brand-200';
      case 'DONE':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'TRASH':
        return 'bg-slate-100 text-slate-400 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleToggleDone = () => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    console.log('Toggle done:', task.id, 'from', task.status, 'to', newStatus);
    if (onUpdateTask) {
      onUpdateTask(task.id, { status: newStatus });
    }
  };

  const handlePriorityChange = (newPriority) => {
    console.log('Priority change:', task.id, 'to', newPriority);
    if (onUpdateTask) {
      onUpdateTask(task.id, { priority: newPriority });
    }
  };

  const handleStatusChange = (newStatus) => {
    console.log('Status change:', task.id, 'to', newStatus);
    if (onUpdateTask) {
      onUpdateTask(task.id, { status: newStatus });
    }
  };

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      console.log('Title save:', task.id, 'to', editTitle.trim());
      if (onUpdateTask) {
        onUpdateTask(task.id, { title: editTitle.trim() });
      }
    }
    setIsEditing(false);
  };

  const handleMoveToTrash = () => {
    console.log('Move to trash:', task.id);
    if (onUpdateTask) {
      onUpdateTask(task.id, { status: 'TRASH' });
    }
  };

  if (task.status === 'TRASH') {
    return (
      <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 opacity-60 transition-opacity hover:opacity-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-slate-400 line-through text-lg">{task.title}</h3>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-200 text-slate-600 flex items-center gap-1">
                <FiTrash2 /> Trash
              </span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => {
                console.log('Restore task:', task.id);
                if (onUpdateTask) {
                  onUpdateTask(task.id, { status: 'TODO' });
                }
              }}
              className="p-2 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors flex items-center gap-1 text-sm font-medium"
              title="Restore"
            >
              <FiRefreshCcw /> Restore
            </button>
            <button
              onClick={() => {
                console.log('Delete forever:', task.id);
                if (onDeleteTask) {
                  onDeleteTask(task.id);
                }
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1 text-sm font-medium"
              title="Delete Forever"
            >
              <FiX /> Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isDone = task.status === 'DONE';

  return (
    <div className={`group bg-white border ${isDone ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-200'} rounded-2xl p-5 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-0.5 transition-all duration-300`}>
      <div className="flex items-start gap-4">
        
        {/* Custom Checkbox */}
        <button
          onClick={handleToggleDone}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isDone 
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30' 
              : 'border-slate-300 hover:border-brand-500 hover:bg-brand-50 text-transparent'
          }`}
        >
          <FiCheck className={`text-sm ${isDone ? 'opacity-100' : 'opacity-0'}`} />
        </button>

        <div className="flex-1 min-w-0">
          {/* Task Title - Editable */}
          {isEditing ? (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="flex-1 px-3 py-1.5 border-2 border-brand-500 rounded-lg text-lg focus:outline-none shadow-sm shadow-brand-500/20"
                autoFocus
              />
              <button
                onClick={handleTitleSave}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Save"
              >
                <FiCheck />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                title="Cancel"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <h3
              className={`text-lg font-medium transition-colors ${
                isDone ? 'line-through text-slate-400' : 'text-slate-800'
              }`}
            >
              {task.title}
            </h3>
          )}

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <select
              value={task.status || 'TODO'}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-3 py-1 text-xs font-semibold rounded-full border focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer appearance-none ${getStatusColor(task.status)}`}
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <select
              value={task.priority || 'MEDIUM'}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className={`px-3 py-1 text-xs font-semibold rounded-full border border-transparent focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer appearance-none ${
                task.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' :
                task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                task.priority === 'LOW' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                'bg-slate-50 text-slate-600 border-slate-100'
              }`}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            {task.dueDate && (
              <span className="px-3 py-1 text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200 rounded-full flex items-center gap-1">
                <FiCalendar className="text-slate-400" /> {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
              title="Edit"
            >
              <FiEdit2 />
            </button>
          )}
          <button
            onClick={handleMoveToTrash}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Move to Trash"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;