// Gestión de haciendas: tabla con filtro por estatus, paginación y CRUD con modales.
import { useState } from 'react';
import { Plus, RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { HaciendaDeleteDialog } from '@/features/haciendas/components/hacienda-delete-dialog.jsx';
import { HaciendaFormModal } from '@/features/haciendas/components/hacienda-form-modal.jsx';
import { HaciendaTable } from '@/features/haciendas/components/hacienda-table.jsx';
import { HaciendasEmpty } from '@/features/haciendas/components/haciendas-empty.jsx';
import { HaciendasPagination } from '@/features/haciendas/components/haciendas-pagination.jsx';
import { useHaciendas } from '@/features/haciendas/hooks/use-haciendas.js';
import { cn } from '@/lib/cn.js';

// Filtros del segmentado.
const FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'Activo', label: 'Activas' },
  { value: 'Inactivo', label: 'Inactivas' },
];

export function HaciendasPage() {
  const { items, pagination, status, error, estatusFilter, setEstatusFilter, setPage, refresh } =
    useHaciendas();

  // Modal de formulario: { mode: 'create' } o { mode: 'edit', hacienda }.
  const [formState, setFormState] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isLoading = status === 'loading' || status === 'idle';
  const isError = status === 'error';
  const isEmpty = status === 'success' && items.length === 0;

  function openCreate() {
    setFormState({ mode: 'create', hacienda: null });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Haciendas</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Crea, edita y desactiva las haciendas registradas
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus aria-hidden className="h-4 w-4" />
          Nueva hacienda
        </Button>
      </div>

      {/* Filtro por estatus */}
      <div
        role="group"
        aria-label="Filtrar por estatus"
        className="flex w-fit gap-1 rounded-lg border border-border bg-surface p-1"
      >
        {FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            aria-pressed={estatusFilter === filter.value}
            onClick={() => setEstatusFilter(filter.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              estatusFilter === filter.value
                ? 'bg-brand text-white'
                : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <Card>
        <div aria-live="polite">
          {isLoading && (
            <div role="status" aria-label="Cargando haciendas" className="flex flex-col gap-3 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <div role="alert" className="flex flex-col items-start gap-3 p-6">
              <p className="flex items-center gap-2 text-sm font-medium text-danger">
                <TriangleAlert aria-hidden className="h-4 w-4 shrink-0" />
                No se pudieron cargar las haciendas
              </p>
              <p className="text-sm text-text-secondary">{error}</p>
              <Button variant="outline" onClick={refresh}>
                <RefreshCw aria-hidden className="h-4 w-4" />
                Reintentar
              </Button>
            </div>
          )}

          {isEmpty && (
            <HaciendasEmpty
              hasFilter={estatusFilter !== ''}
              onCreate={openCreate}
              onClearFilter={() => setEstatusFilter('')}
            />
          )}

          {status === 'success' && items.length > 0 && (
            <>
              <HaciendaTable
                items={items}
                onEdit={(hacienda) => setFormState({ mode: 'edit', hacienda })}
                onDelete={setDeleteTarget}
              />
              <HaciendasPagination pagination={pagination} onPage={setPage} />
            </>
          )}
        </div>
      </Card>

      {formState && (
        <HaciendaFormModal
          mode={formState.mode}
          hacienda={formState.hacienda}
          open
          onClose={() => setFormState(null)}
          onSaved={() => setFormState(null)}
        />
      )}

      {deleteTarget && (
        <HaciendaDeleteDialog
          hacienda={deleteTarget}
          open
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
