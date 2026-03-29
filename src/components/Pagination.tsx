interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-5 text-dv-text bg-dv-surface/60 border border-dv-border rounded-xl px-4 py-3">
      <div className="text-sm text-dv-textMuted">
        Mostrando {startItem} a {endItem} de {totalItems} resultados
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-dv-border rounded-lg bg-dv-surfaceAlt text-dv-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-dv-surface transition-colors"
        >
          Anterior
        </button>
        <span className="px-3 py-2 text-dv-text text-sm">
          Pagina {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-dv-border rounded-lg bg-dv-surfaceAlt text-dv-text disabled:opacity-40 disabled:cursor-not-allowed hover:bg-dv-surface transition-colors"
        >
          Proxima
        </button>
      </div>
    </div>
  );
};
