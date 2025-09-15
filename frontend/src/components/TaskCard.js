import React, { useState } from 'react';

const TaskCard = ({ task, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title || '');

  console.log('TaskCard rendered with task:', task);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'TODO':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      case 'TRASH':
        return 'bg-gray-400 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 opacity-75">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-500 line-through">{task.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 text-xs rounded-full bg-gray-400 text-gray-800">
                Trash
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
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Restore
            </button>
            <button
              onClick={() => {
                console.log('Delete forever:', task.id);
                if (onDeleteTask) {
                  onDeleteTask(task.id);
                }
              }}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete Forever
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Task Title - Editable */}
          {isEditing ? (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleTitleSave}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h3
              className={`font-medium cursor-pointer hover:text-blue-600 ${
                task.status === 'DONE' ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </h3>
          )}

          {/* Status and Priority Badges */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <select
              value={task.status || 'TODO'}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-2 py-1 text-xs rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.status)}`}
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <select
              value={task.priority || 'MEDIUM'}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className={`px-2 py-1 text-xs rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${
                task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                task.priority === 'LOW' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            {task.dueDate && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                📅 {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-4">
          <button
            onClick={handleToggleDone}
            className={`text-sm font-medium ${
              task.status === 'DONE'
                ? 'text-orange-600 hover:text-orange-800'
                : 'text-green-600 hover:text-green-800'
            }`}
          >
            {task.status === 'DONE' ? 'Undo' : 'Done'}
          </button>
          <button
            onClick={handleMoveToTrash}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Trash
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;