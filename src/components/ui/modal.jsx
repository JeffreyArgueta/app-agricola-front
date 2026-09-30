// Modal compartido: velo, panel dialog, cierre con Escape y bloqueo de scroll.
// Al abrir mueve el foco adentro, atrapa el Tab y al cerrar devuelve el foco.
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { cn } from '@/lib/cn.js';

// Elementos enfocables dentro del panel (excluye deshabilitados).
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

export function Modal({ open, onClose, title, description, className, children }) {
  const panelRef = useRef(null);

  // Foco inicial + trampa de Tab + Escape + bloqueo de scroll.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    // Guarda el foco previo (p. ej. el botón que abrió el modal) para devolverlo al cerrar.
    const previousFocus = document.activeElement;

    // Foco inicial: elemento marcado con data-autofocus, o el primero si el foco quedó fuera.
    // Respeta el autoFocus nativo del contenido (p. ej. el primer campo del formulario).
    const initial = panel.querySelector('[data-autofocus]') ?? getFocusableElements(panel)[0];
    if (initial && !panel.contains(document.activeElement)) initial.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      // Atrapa el Tab dentro del diálogo para no recorrer el fondo.
      if (event.key !== 'Tab') return;
      const focusable = getFocusableElements(panel);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const titleId = 'modal-title';
  const descriptionId = 'modal-description';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div aria-hidden className="absolute inset-0 bg-text-primary/50" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-surface p-6 shadow-card',
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-text-secondary">
                {description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar diálogo">
            <X aria-hidden className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
