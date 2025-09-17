import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import ToastRenderer from './components/ToastRenderer';
import { setOnError } from './apiClient';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const Root = () => {
  const { showToast } = useToast();
  // register error handler once
  React.useEffect(() => {
    setOnError((err) => {
      if (err && err.message) showToast(err.message);
    });
  }, [showToast]);
  return (
    <AuthProvider>
      <App />
      <ToastRenderer />
    </AuthProvider>
  );
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <Root />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
