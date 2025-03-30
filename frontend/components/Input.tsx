import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-300 mb-2 font-semibold">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-white/10 border ${
          error ? 'border-red-500' : 'border-white/20'
        } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-400 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}


