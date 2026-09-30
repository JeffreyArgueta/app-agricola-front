// Diálogo de confirmación.
// La fila se conserva como Inactiva y que sigue contando en el dashboard.
import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Modal } from '@/components/ui/modal.jsx';
import { useHaciendaStore } from '@/stores/hacienda.store.js';
import { notify, toUserMessage } from '@/services/toast.js';

export function HaciendaDeleteDialog({ hacienda, open, onClose, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const removeHacienda = useHaciendaStore((state) => state.removeHacienda);

  // Evita cerrar a mitad del borrado (Escape, velo o botones).
  function handleClose() {
    if (!isDeleting) onClose();
  }

  // Confirma la baja: desactiva, avisa y cierra. El store ya refresca la lista.
  async function handleConfirm() {
    setIsDeleting(true);
    setError(null);
    try {
      await removeHacienda(hacienda.idHacienda);
      notify.success('Hacienda desactivada correctamente');
      onDeleted();
    } catch (err) {
      const message = toUserMessage(err);
      setError(message);
      notify.error(message);
      setIsDeleting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Desactivar hacienda"
      description={`Esta acción marcará "${hacienda.nombre}" como Inactiva.`}
    >
      <div className="rounded-md bg-warning-muted px-4 py-3">
        <p className="flex items-start gap-2 text-sm text-warning">
          <TriangleAlert aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Se conserva y seguirá contando en el total del dashboard.</span>
        </p>
      </div>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="mt-3 rounded-md bg-danger-muted px-3 py-2 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={handleClose} disabled={isDeleting} data-autofocus>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm} loading={isDeleting}>
          {isDeleting ? 'Desactivando…' : 'Sí, desactivar'}
        </Button>
      </div>
    </Modal>
  );
}
