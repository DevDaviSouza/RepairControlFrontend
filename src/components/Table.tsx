import { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
}

export const Table = ({ headers, children }: TableProps) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-dv-border/80 shadow-card-dark bg-gradient-to-b from-dv-surface to-dv-backgroundSoft">
      <table className="min-w-full divide-y divide-dv-border">
        <thead className="bg-dv-surfaceAlt/90">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-xs font-semibold text-dv-textMuted uppercase tracking-[0.14em]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-dv-border/70">
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
      className={`${onClick ? 'hover:bg-dv-surfaceAlt/50 cursor-pointer transition-colors' : ''}`}
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

