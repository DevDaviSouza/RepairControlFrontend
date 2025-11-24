import { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
}

export const Table = ({ headers, children }: TableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-dv-border shadow-card-dark bg-dv-surface">
      <table className="min-w-full divide-y divide-dv-border">
        <thead className="bg-dv-surfaceAlt">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-dv-textMuted uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-dv-surface divide-y divide-dv-border">
          {children}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
}

export const TableRow = ({ children, onClick }: TableRowProps) => {
  return (
    <tr
      className={`${onClick ? 'hover:bg-dv-surfaceAlt cursor-pointer transition-colors' : ''}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

export const TableCell = ({ children, className = '', colSpan }: TableCellProps) => {
  return (
    <td colSpan={colSpan} className={`px-6 py-4 whitespace-nowrap text-sm text-dv-text ${className}`}>
      {children}
    </td>
  );
};

