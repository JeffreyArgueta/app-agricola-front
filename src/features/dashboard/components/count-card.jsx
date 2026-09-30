// Tarjeta del total de haciendas: carga, error con reintento y valor final.
import { RefreshCw, Sprout, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Skeleton } from '@/components/ui/skeleton.jsx';

export function CountCard({ total, status, error, onRefresh, onRetry }) {
  const isLoading = status === 'loading' || status === 'idle';
  const isError = status === 'error';

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-dark">
            <Sprout aria-hidden className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-sm font-medium text-text-secondary">Total de haciendas</h2>
            <p className="text-xs text-text-secondary">Activas e inactivas</p>
          </div>
        </div>
        {!isLoading && !isError && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            aria-label="Actualizar total de haciendas"
            title="Actualizar"
          >
            <RefreshCw aria-hidden className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div aria-live="polite" className="mt-4">
        {isLoading && (
          <div role="status" aria-label="Cargando total de haciendas">
            <Skeleton className="h-12 w-28" />
            <Skeleton className="mt-2 h-4 w-44" />
          </div>
        )}

        {isError && (
          <div role="alert" className="rounded-md bg-danger-muted px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-medium text-danger">
              <TriangleAlert aria-hidden className="h-4 w-4 shrink-0" />
              No se pudo cargar el total
            </p>
            <p className="mt-1 text-sm text-danger/90">{error}</p>
            <Button variant="outline" size="default" onClick={onRetry} className="mt-3">
              <RefreshCw aria-hidden className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        )}

        {status === 'success' && (
          <p className="animate-enter text-5xl font-semibold tabular-nums text-text-primary">
            {total}
          </p>
        )}
      </div>
    </Card>
  );
}
