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
  const baseStyles =
    'px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dv-surface active:scale-[0.98]';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-dv-blue to-[#7CA8FF] text-white hover:brightness-110 shadow-glow-blue',
    secondary: 'bg-dv-surfaceAlt text-dv-text hover:bg-dv-surface border border-dv-border',
    danger: 'bg-gradient-to-r from-dv-red to-[#F0677D] text-white hover:brightness-110 shadow-card-dark',
    success: 'bg-gradient-to-r from-dv-green to-[#66CB88] text-white hover:brightness-110 shadow-card-dark',
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

