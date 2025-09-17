import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Inbox from './pages/Inbox';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import Completed from './pages/Completed';
import Trash from './pages/Trash';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
// Layouts
const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    {children}
  </div>
);

const MainLayout = ({ children, onNewTask }) => (
  <div className="min-h-screen bg-gray-50">
    <Topbar onNewTask={onNewTask} />
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  </div>
);

function App() {
  const handleNewTask = () => {
    const input = document.querySelector('input[type="text"]');
    if (input) input.focus();
  };

  return (
    <Routes>
      {/* Auth pages: no sidebar/topbar */}
      <Route path="/login" element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      } />
      <Route path="/register" element={
        <AuthLayout>
          <Register />
        </AuthLayout>
      } />

      {/* Main app: sidebar/topbar only for protected routes */}
      <Route path="/" element={<Navigate to="/inbox" replace />} />
      <Route path="/inbox" element={
        <MainLayout onNewTask={handleNewTask}>
          <ProtectedRoute><Inbox /></ProtectedRoute>
        </MainLayout>
      } />
      <Route path="/today" element={
        <MainLayout onNewTask={handleNewTask}>
          <ProtectedRoute><Today /></ProtectedRoute>
        </MainLayout>
      } />
      <Route path="/upcoming" element={
        <MainLayout onNewTask={handleNewTask}>
          <ProtectedRoute><Upcoming /></ProtectedRoute>
        </MainLayout>
      } />
      <Route path="/completed" element={
        <MainLayout onNewTask={handleNewTask}>
          <ProtectedRoute><Completed /></ProtectedRoute>
        </MainLayout>
      } />
      <Route path="/trash" element={
        <MainLayout onNewTask={handleNewTask}>
          <ProtectedRoute><Trash /></ProtectedRoute>
        </MainLayout>
      } />
    </Routes>
  );
}

export default App;
