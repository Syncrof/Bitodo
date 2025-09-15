import React from 'react';

const FiltersBar = ({ activeFilter, onFilterChange, activePriority, onPriorityChange, showAllStatuses = false }) => {
  const statusFilters = showAllStatuses ? [
    { key: 'all', label: 'All' },
    { key: 'TODO', label: 'Todo' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'DONE', label: 'Done' },
    { key: 'TRASH', label: 'Trash' },
  ] : [
    { key: 'all', label: 'All' },
    { key: 'TODO', label: 'Todo' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
  ];

  const priorityFilters = [
    { key: 'all', label: 'All', color: 'bg-gray-100' },
    { key: 'LOW', label: 'Low', color: 'bg-green-100 text-green-800' },
    { key: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'HIGH', label: 'High', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
      {/* Status Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <div className="flex gap-2 flex-wrap">
          {priorityFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onPriorityChange(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePriority === filter.key
                  ? 'bg-blue-600 text-white'
                  : filter.color || 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;