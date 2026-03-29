import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  surface?: boolean;
}

export const Card = ({ title, children, className = '', surface = true }: CardProps) => {
  const surfaceClasses = surface
    ? 'bg-gradient-to-b from-dv-surface to-dv-backgroundSoft border border-dv-border/80'
    : '';

  return (
    <div className={`${surfaceClasses} rounded-2xl shadow-card-dark p-6 ${className}`}>
      {title && (
        <h3 className="text-sm uppercase tracking-[0.16em] font-semibold text-dv-textMuted mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

