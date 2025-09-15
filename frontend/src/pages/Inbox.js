// src/pages/Inbox.js
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';
import QuickAdd from '../components/QuickAdd';
import FiltersBar from '../components/FiltersBar';
import TaskCard from '../components/TaskCard';

const Inbox = () => {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'PENDING' | 'DONE' | 'TRASH' (ör.)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // İlk yüklemede görevleri çek
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tasks`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setTasks(data.data || []);
      } catch (e) {
        console.error(e);
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Yeni görev ekle
  const handleAddTask = async (newTask) => {
    const payload = {
      title: newTask?.title?.trim(),
      status: 'TODO',   // backend enum'una uygun!
      priority: 'MEDIUM',
    };
    if (!payload.title) return;

    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Create task failed', res.status, err);
        throw new Error('Create task failed');
      }
      const created = await res.json();
      // API {data: {...}} döndürüyorsa ona göre alalım
      const createdTask = created.data ?? created;
      setTasks((prev) => [...prev, createdTask]);
    } catch (e) {
      setError('Failed to add task');
    }
  };

  // Filtre
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Inbox</h1>

        <QuickAdd onAddTask={handleAddTask} />
        <FiltersBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Hiç görev yok</h2>
            <p className="text-gray-600 mb-6">Yeni bir görev ekleyerek başlayabilirsin.</p>
            <button
              onClick={() => document.querySelector('input')?.focus()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Add Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id ?? `${task.title}-${task.createdAt ?? ''}`} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
