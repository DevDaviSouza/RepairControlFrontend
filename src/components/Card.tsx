import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  surface?: boolean;
}

export const Card = ({ title, children, className = '', surface = true }: CardProps) => {
  const surfaceClasses = surface ? 'bg-dv-surface border border-dv-border' : '';

  return (
    <div className={`${surfaceClasses} rounded-xl shadow-card-dark p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-dv-text mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

