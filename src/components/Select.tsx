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
          <label className="block text-sm font-medium text-dv-text mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-3 py-2 rounded-lg bg-[#EBEBEB] text-[#1C1C1C] border ${
            error ? 'border-dv-red' : 'border-transparent'
          } focus:outline-none focus:ring-2 focus:ring-dv-green ${className}`}
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

