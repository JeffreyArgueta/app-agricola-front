// Bloque para estados de carga. Reutilizable en dashboard y haciendas.
import { cn } from '@/lib/cn.js';

export function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-md bg-surface-muted', className)}
      {...props}
    />
  );
}
