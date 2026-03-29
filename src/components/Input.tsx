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
          <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-dv-textMuted mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl bg-dv-surfaceAlt/95 text-dv-text placeholder:text-dv-textSoft border ${
            error ? 'border-dv-red' : 'border-dv-border'
          } focus:outline-none focus:ring-2 focus:ring-dv-blue/50 focus:border-dv-blue ${className}`}
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

