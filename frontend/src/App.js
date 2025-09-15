import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Inbox from './pages/Inbox';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import Completed from './pages/Completed';
import Trash from './pages/Trash';

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
              <Route path="/trash" element={<Trash />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
