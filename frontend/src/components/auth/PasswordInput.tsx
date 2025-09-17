import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helpText?: string;
  strength?: number;
  onStrengthChange?: (strength: number) => void;
}

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, id, error, helpText, onStrengthChange, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState('');
    const [capsLock, setCapsLock] = useState(false);
    const strength = getStrength(value);

    React.useEffect(() => {
      if (onStrengthChange) onStrengthChange(strength);
    }, [strength, onStrengthChange]);

    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          {label}
        </label>
        <div className={`relative flex items-center${error ? ' animate-shake' : ''}`}>  
          <span className="absolute left-3 text-gray-400 pointer-events-none">
            <FiLock size={20} />
          </span>
          <input
            id={id}
            ref={ref}
            type={show ? 'text' : 'password'}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyUp={e => setCapsLock(e.getModifierState && e.getModifierState('CapsLock'))}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
            className={`w-full px-4 py-2 pl-10 pr-10 rounded-lg border focus:outline-none focus-visible:ring-2 ring-offset-2 focus-visible:ring-blue-500 transition-all bg-white/80 dark:bg-neutral-900/60 border-gray-300 dark:border-neutral-700 placeholder-gray-400 dark:placeholder-gray-500 ${error ? 'border-red-500' : ''}`}
            {...props}
          />
          <button type="button" tabIndex={-1} className="absolute right-3 text-gray-400 hover:text-blue-500 focus:outline-none" onClick={() => setShow(s => !s)} aria-label={show ? 'Şifreyi gizle' : 'Şifreyi göster'}>
            {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
        <div className="flex items-center mt-1 gap-2">
          <div className="flex-1 h-1 rounded bg-gray-200 dark:bg-neutral-700 overflow-hidden">
            <div className={`h-1 rounded transition-all duration-300 ${strength === 0 ? '' : strength === 1 ? 'bg-red-500 w-1/4' : strength === 2 ? 'bg-yellow-400 w-2/4' : strength === 3 ? 'bg-blue-500 w-3/4' : 'bg-green-500 w-full'}`}></div>
          </div>
          <span className={`text-xs ${strength < 2 ? 'text-red-500' : strength === 2 ? 'text-yellow-500' : strength === 3 ? 'text-blue-500' : 'text-green-500'}`}>
            {strength === 0 ? '' : strength === 1 ? 'Zayıf' : strength === 2 ? 'Orta' : strength === 3 ? 'İyi' : 'Güçlü'}
          </span>
        </div>
        {capsLock && (
          <div className="flex items-center text-xs text-yellow-600 mt-1" role="alert">
            <FiAlertCircle className="mr-1" /> Caps Lock açık!
          </div>
        )}
        {error ? (
          <div id={`${id}-error`} role="alert" className="text-xs text-red-500 mt-1">{error}</div>
        ) : helpText ? (
          <div id={`${id}-help`} className="text-xs text-gray-500 mt-1">{helpText}</div>
        ) : null}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
