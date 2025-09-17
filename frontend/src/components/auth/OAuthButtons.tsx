import React from 'react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

interface OAuthButtonsProps {
  onGoogle?: () => void;
  onGitHub?: () => void;
  loadingProvider?: 'google' | 'github' | null;
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ onGoogle, onGitHub, loadingProvider }) => (
  <div className="flex flex-col gap-3 my-4">
    <button
      type="button"
      onClick={onGoogle}
      className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white/80 dark:bg-neutral-900/60 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus-visible:ring-2 ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-60"
      disabled={loadingProvider === 'google'}
      aria-label="Google ile devam et"
    >
      <FaGoogle className="text-lg" />
      Google ile devam et
      {loadingProvider === 'google' && <span className="ml-2 animate-spin">⏳</span>}
    </button>
    <button
      type="button"
      onClick={onGitHub}
      className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white/80 dark:bg-neutral-900/60 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus-visible:ring-2 ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-60"
      disabled={loadingProvider === 'github'}
      aria-label="GitHub ile devam et"
    >
      <FaGithub className="text-lg" />
      GitHub ile devam et
      {loadingProvider === 'github' && <span className="ml-2 animate-spin">⏳</span>}
    </button>
  </div>
);

export default OAuthButtons;
