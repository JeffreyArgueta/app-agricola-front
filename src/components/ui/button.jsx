// Acepta className y reenvía ref.
import { forwardRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/cn.js';

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark focus-visible:ring-brand',
  outline:
    'border border-border bg-surface text-text-primary hover:border-brand hover:text-brand-dark',
  ghost: 'text-text-secondary hover:bg-surface-muted hover:text-text-primary',
  danger: 'bg-danger text-white hover:brightness-95',
};

const sizes = {
  default: 'h-10 px-4 text-sm',
  large: 'h-11 px-6 text-base',
  icon: 'h-10 w-10',
};

export const Button = forwardRef(
  (
    { variant = 'primary', size = 'default', className, loading = false, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={props.type ?? 'button'}
      disabled={props.disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
