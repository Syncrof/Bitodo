import React from 'react';
import { IconType } from 'react-icons';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: IconType;
  error?: string;
  helpText?: string;
  id: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, icon: Icon, error, helpText, id, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
          {label}
        </label>
        <div className={`relative flex items-center` + (error ? ' animate-shake' : '')}>
          {Icon && (
            <span className="absolute left-3 text-gray-400 pointer-events-none">
              <Icon size={20} />
            </span>
          )}
          <input
            id={id}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
            className={`w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus-visible:ring-2 ring-offset-2 focus-visible:ring-blue-500 transition-all bg-white/80 dark:bg-neutral-900/60 border-gray-300 dark:border-neutral-700 placeholder-gray-400 dark:placeholder-gray-500 ${error ? 'border-red-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <div id={`${id}-error`} role="alert" className="text-xs text-red-500 mt-1">{error}</div>
        ) : helpText ? (
          <div id={`${id}-help`} className="text-xs text-gray-500 mt-1">{helpText}</div>
        ) : null}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';
export default TextInput;
