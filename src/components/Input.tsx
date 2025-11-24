import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dv-text mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 rounded-lg bg-[#EBEBEB] text-[#1C1C1C] placeholder:text-[#6B6B6B] border ${
            error ? 'border-dv-red' : 'border-transparent'
          } focus:outline-none focus:ring-2 focus:ring-dv-green focus:border-dv-green ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-dv-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

