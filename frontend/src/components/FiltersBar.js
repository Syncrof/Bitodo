import React from 'react';

const FiltersBar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'todo', label: 'Todo' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex gap-2">
        {filters.map((filter) => (
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
  );
};

export default FiltersBar;