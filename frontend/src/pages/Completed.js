import React, { useState } from 'react';
import TaskCard from '../components/TaskCard';

const Completed = () => {
  const [tasks] = useState([
    {
      id: 1,
      title: 'Team meeting preparation',
      status: 'done',
      priority: 'low',
      dueDate: '2025-09-15',
    },
    {
      id: 2,
      title: 'Weekly report submission',
      status: 'done',
      priority: 'medium',
      dueDate: '2025-09-14',
    },
    {
      id: 3,
      title: 'Client call follow-up',
      status: 'done',
      priority: 'high',
      dueDate: '2025-09-13',
    },
  ]);

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Completed</h1>
        
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No completed tasks</h2>
            <p className="text-gray-600">Complete some tasks to see them here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                🎉 Great job! You've completed {tasks.length} task{tasks.length !== 1 ? 's' : ''}.
              </p>
            </div>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Completed;