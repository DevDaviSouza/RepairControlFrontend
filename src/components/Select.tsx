import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-dv-textMuted mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl bg-dv-surfaceAlt/95 text-dv-text border ${
            error ? 'border-dv-red' : 'border-dv-border'
          } focus:outline-none focus:ring-2 focus:ring-dv-blue/50 focus:border-dv-blue ${className}`}
          {...props}
        >
          <option value="">Selecione...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-dv-red">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

