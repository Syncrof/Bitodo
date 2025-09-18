// frontend/src/pages/Today.js
import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/taskAPI'; // Projendeki mevcut export'a uygun bıraktım

const Today = () => {
  const [tasks, setTasks] = useState([]);
  const [focusedTask, setFocusedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // defansif normalize
  const normalize = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .filter(Boolean)
      .map((t) => ({
        id: t?.id,
        title: t?.title ?? '',
        description: t?.description ?? '',
        status: t?.status ?? 'today',
        dueAt: t?.dueAt ?? null,
        ...t,
      }));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await taskAPI.getTasks({ date: 'today' });
        if (!mounted) return;
        if (res?.success) setTasks(normalize(res.data));
        else setError(res?.error || 'Failed to fetch tasks');
      } catch (e) {
        if (!mounted) return;
        setError('Failed to fetch tasks: ' + (e?.message || e));
        setTasks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const safeTasks = normalize(tasks);
  const filteredTasks = safeTasks; // şimdilik bugünün hepsi

  const handleFocusTask = (task) => setFocusedTask(task);
  const handleCloseFocus = () => setFocusedTask(null);

  return (
    <>
      <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-0">
        <div className="max-w-3xl mx-auto py-12">
          <div className="flex items-center justify-center mb-8">
            <span className="text-5xl mr-4">🌞</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow-lg animate-fade-in">
              Bugünün Görevleri
            </h1>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xl text-blue-500 animate-pulse">Yükleniyor...</div>
          ) : error ? (
            <div className="text-center py-16 text-red-600 text-lg">{error}</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-4">📅</div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Bugün için görev yok</h2>
              <p className="text-gray-600 mb-6">Günü keyifle geçir! 🎉</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {filteredTasks.map((task, idx) => (
                <div
                  key={task.id || idx}
                  className="bg-white rounded-xl shadow-md px-4 py-4 flex items-center gap-3 border-l-4 border-blue-300 hover:border-pink-400 transition-all duration-200 cursor-pointer"
                  onClick={() => handleFocusTask(task)}
                >
                  <span className="text-2xl md:text-3xl select-none">
                    {['📝','✅','📌','🚀','🎯','🔔','💡'][idx % 7]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-base md:text-lg font-bold text-gray-800 mb-1 truncate"
                      title={task.title}
                    >
                      {task.title?.length > 32 ? task.title.slice(0, 32) + '...' : task.title}
                    </div>
                    {task.description && (
                      <div
                        className="text-gray-500 text-xs md:text-sm mb-2 truncate"
                        title={task.description}
                      >
                        {task.description.length > 48
                          ? task.description.slice(0, 48) + '...'
                          : task.description}
                      </div>
                    )}
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                      Bugün
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <style>{`
          .animate-fade-in { animation: fadeIn 1.2s ease; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
      </div>

      {focusedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-all"
            onClick={handleCloseFocus}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl px-8 py-10 max-w-md w-full mx-4 animate-fade-in-up flex flex-col items-center">
            <span className="text-5xl mb-4">📝</span>
            <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center break-words">
              {focusedTask?.title || ''}
            </h2>
            {focusedTask?.description && (
              <p className="text-gray-600 text-base mb-4 text-center break-words">
                {focusedTask.description}
              </p>
            )}
            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold mb-2">
              Bugün
            </span>
            <button
              onClick={handleCloseFocus}
              className="mt-4 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Kapat
            </button>
          </div>

          <style>{`
            .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(.4,0,.2,1); }
            @keyframes fadeInUp {
              from { opacity: 0; transform: scale(.8) translateY(40px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Today;
