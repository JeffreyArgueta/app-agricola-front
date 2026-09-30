// Indicador de carga para los Suspense de las rutas.
import { LoaderCircle } from 'lucide-react';

export function PageLoader({ message = 'Cargando…' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50svh] items-center justify-center"
    >
      <p className="flex items-center gap-2 text-sm text-text-secondary">
        <LoaderCircle aria-hidden className="h-5 w-5 animate-spin text-brand" />
        {message}
      </p>
    </div>
  );
}
