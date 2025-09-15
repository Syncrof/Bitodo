import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';
import TaskCard from '../components/TaskCard';

const Completed = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/tasks?status=DONE`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch tasks');
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Completed</h1>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : tasks.length === 0 ? (
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