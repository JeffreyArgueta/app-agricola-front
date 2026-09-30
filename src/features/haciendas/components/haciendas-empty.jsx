// Estado vacío: sin haciendas o sin resultados para el filtro activo.
import { Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

export function HaciendasEmpty({ hasFilter, onCreate, onClearFilter }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-text-secondary">
        <Sprout aria-hidden className="h-6 w-6" />
      </span>
      <div>
        <p className="font-medium text-text-primary">
          {hasFilter ? 'Sin resultados para este filtro' : 'Aún no hay haciendas'}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          {hasFilter
            ? 'Prueba con otro estatus o limpia el filtro.'
            : 'Crea la primera hacienda para empezar.'}
        </p>
      </div>
      {hasFilter ? (
        <Button variant="outline" onClick={onClearFilter}>
          Limpiar filtro
        </Button>
      ) : (
        <Button onClick={onCreate}>Nueva hacienda</Button>
      )}
    </div>
  );
}
