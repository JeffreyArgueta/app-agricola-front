// Sello de estatus: verde para Activo, ámbar para Inactivo.
import { cn } from '@/lib/cn.js';

const styles = {
  Activo: 'bg-success-muted text-success',
  Inactivo: 'bg-warning-muted text-warning',
};

export function EstatusBadge({ value }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[value] ?? 'bg-surface-muted text-text-secondary'
      )}
    >
      {value}
    </span>
  );
}
