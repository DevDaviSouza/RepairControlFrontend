import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  isLoading = false, 
  children, 
  disabled,
  className = '',
  ...props 
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dv-surface';
  
  const variantStyles = {
    primary: 'bg-dv-green text-white hover:bg-dv-green-dark shadow-card-dark',
    secondary: 'bg-dv-surfaceAlt text-dv-text hover:bg-dv-surface border border-dv-border',
    danger: 'bg-dv-red text-white hover:bg-dv-red-dark shadow-card-dark',
    success: 'bg-dv-gold text-white hover:bg-dv-gold-dark shadow-card-dark',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
};

