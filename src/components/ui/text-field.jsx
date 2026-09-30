// Campo de texto accesible: siempre con label, aria-invalid y mensaje de error descrito.
import { forwardRef } from 'react';
import { cn } from '@/lib/cn.js';

export const TextField = forwardRef(
  ({ id, label, error, className, inputClassName, ...props }, ref) => {
    const errorId = `${id}-error`;
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <label htmlFor={id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-10 rounded-md border border-border bg-surface px-3 text-sm text-text-primary',
            'placeholder:text-text-secondary/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            inputClassName
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }
);
TextField.displayName = 'TextField';
