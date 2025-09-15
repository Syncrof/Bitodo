import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Inbox from './pages/Inbox';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import Completed from './pages/Completed';

function App() {
  const handleNewTask = () => {
    // Focus on the input field in the current page
    const input = document.querySelector('input[type="text"]');
    if (input) {
      input.focus();
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Topbar onNewTask={handleNewTask} />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/inbox" replace />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/today" element={<Today />} />
              <Route path="/upcoming" element={<Upcoming />} />
              <Route path="/completed" element={<Completed />} />
              <Route path="/trash" element={
                <div className="flex-1 p-6">
                  <div className="max-w-4xl mx-auto text-center py-12">
                    <div className="text-6xl mb-4">🗑️</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Trash</h1>
                    <p className="text-gray-600">Deleted tasks will appear here.</p>
                  </div>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
