
import React, { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import TextInput from '../components/auth/TextInput';
import PasswordInput from '../components/auth/PasswordInput';
import OAuthButtons from '../components/auth/OAuthButtons';
import '../styles/auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  // TODO: auth context ve navigate ekle

  function validateEmail(val: string) {
    if (!val) return 'Email gerekli';
    // Basit email regex
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) return 'Geçerli bir email girin';
    return null;
  }
  function validatePassword(val: string) {
    if (!val) return 'Şifre gerekli';
    if (val.length < 8) return 'En az 8 karakter';
    if (!/[A-Z]/.test(val)) return 'En az 1 büyük harf';
    if (!/[0-9]/.test(val)) return 'En az 1 sayı';
    if (!/[^A-Za-z0-9]/.test(val)) return 'En az 1 sembol';
    return null;
  }

  React.useEffect(() => {
    setEmailError(validateEmail(email));
  }, [email]);
  React.useEffect(() => {
    setPasswordError(validatePassword(password));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) {
      setError('Lütfen hataları düzeltin');
      return;
    }
    setLoading(true);
    setError(null);
    // TODO: login işlemi
    setTimeout(() => {
      setLoading(false);
      setError('Demo: Giriş başarısız!');
    }, 1200);
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center py-8 lg:py-16">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 px-4">
        {/* Glass Panel */}
        <div className="backdrop-blur-xl bg-white/10 dark:bg-neutral-900/30 border border-white/20 rounded-2xl shadow-2xl max-w-[460px] w-full p-8 md:p-10 flex flex-col gap-6">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white text-center">Giriş Yap</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center text-base mb-2">Bitodo ile görevlerini kolayca yönet!</p>
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-200 rounded px-3 py-2 text-sm mb-2" role="alert">{error}</div>
          )}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextInput
              id="email"
              label="Email"
              type="email"
              icon={FiMail}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              error={emailError || undefined}
              helpText="Kurumsal email adresinizi girin."
            />
            <PasswordInput
              id="password"
              label="Şifre"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              error={passwordError || undefined}
              helpText="En az 8 karakter, 1 büyük harf, 1 sayı, 1 sembol."
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input type="checkbox" className="accent-blue-600 rounded" /> Beni hatırla
              </label>
              <button type="button" className="text-blue-600 hover:underline text-sm font-medium" tabIndex={0} aria-label="Şifremi unuttum">Şifremi unuttum?</button>
            </div>
            <button
              type="submit"
              className="mt-2 w-full py-2 rounded-lg bg-blue-600 text-white font-semibold text-base shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-150 focus-visible:ring-2 ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? <span className="animate-spin">⏳</span> : 'Giriş Yap'}
            </button>
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-700" />
              <span className="text-xs text-gray-400">veya</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-neutral-700" />
            </div>
            <OAuthButtons />
          </form>
          <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
            Hesabın yok mu?{' '}
            <a href="/register" className="text-blue-600 font-semibold hover:underline">Kayıt ol</a>
          </div>
        </div>
        {/* Illustration Area */}
        <div className="hidden lg:flex flex-col items-center max-w-md w-full">
          <img src="/assets/todo-illustration.svg" alt="To Do Illustration" className="w-full max-w-xs mb-4 drop-shadow-xl" />
          <div className="text-lg text-gray-700 dark:text-gray-200 font-medium text-center">Hayatını kolaylaştır, Bitodo ile organize ol!</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
