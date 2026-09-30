// Controles de paginación por offset con rango visible ("Mostrando X–Y de Z").
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

export function HaciendasPagination({ pagination, onPage }) {
  if (!pagination || pagination.total === 0) return null;

  const { total, limit, offset, currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;
  const from = offset + 1;
  const to = Math.min(offset + limit, total);

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p aria-live="polite" className="text-sm text-text-secondary">
        Mostrando {from}–{to} de {total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="default"
          onClick={() => onPage(currentPage - 1)}
          disabled={!hasPrevPage}
          aria-label="Página anterior"
        >
          <ChevronLeft aria-hidden className="h-4 w-4" />
          Anterior
        </Button>
        <p aria-live="polite" className="px-1 text-sm text-text-secondary">
          Página {currentPage} de {totalPages}
        </p>
        <Button
          variant="outline"
          size="default"
          onClick={() => onPage(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Página siguiente"
        >
          Siguiente
          <ChevronRight aria-hidden className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
