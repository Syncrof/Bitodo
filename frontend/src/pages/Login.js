import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/inbox';
  const { user, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalı');
      return;
    }
    setSubmitting(true);
    try {
      const res = await login({ email, password });
      if (!res.success) {
        setSubmitting(false);
        setTimeout(() => { window.location.reload(); }, 1200);
        return;
      }
      // Başarılı login'de user state dolana kadar bekle
      setTimeout(() => {
        if (!user) {
          setError('Giriş Yapılamadı... Bilgileri Doğrulayın!');
          setSubmitting(false);
          setTimeout(() => { window.location.reload(); }, 1200);
        }
      }, 2000);
    } catch (err) {
      setError('Giriş Yapılamadı... Bilgileri Doğrulayın!');
      setSubmitting(false);
      setTimeout(() => { window.location.reload(); }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 min-h-screen">
      <div className="w-full max-w-xl bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 flex flex-col justify-center" style={{minHeight:'420px'}}>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">Giriş Yap</h2>
        {submitting && !error && (
          <div className="text-blue-600 mb-3 text-center">Giriş yapılıyor...</div>
        )}
        {error && (
          <div className="text-orange-600 mb-3 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none bg-gray-50 placeholder-gray-400"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none bg-gray-50 placeholder-gray-400"
              placeholder="Şifreniz"
            />
          </div>
          <button
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold text-base shadow hover:bg-blue-700 transition-colors duration-150"
            type="submit"
          >
            Giriş
          </button>
        </form>
        <p className="mt-5 text-sm text-gray-600 text-center">
          Hesabın yok mu?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">Kayıt ol</Link>

        </p>
      </div>
    </div>
  );
};

export default Login;
