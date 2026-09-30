// Contenedor tipo tarjeta con la sombra y el borde del sistema.
import { cn } from '@/lib/cn.js';

export function Card({ className, children, ...props }) {
  return (
    <section
      className={cn('rounded-lg border border-border bg-surface shadow-card', className)}
      {...props}
    >
      {children}
    </section>
  );
}
