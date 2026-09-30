// Modal de creación y edición con validación zod.
// El 409 del backend (nombre duplicado) se mapea al campo nombre.
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button.jsx';
import { Modal } from '@/components/ui/modal.jsx';
import { TextField } from '@/components/ui/text-field.jsx';
import { useHaciendaStore } from '@/stores/hacienda.store.js';
import { notify } from '@/services/toast.js';
import {
  ESTATUS_OPTIONS,
  createHaciendaSchema,
  updateHaciendaSchema,
} from '@/features/haciendas/schemas/hacienda.schema.js';
import { cn } from '@/lib/cn.js';

export function HaciendaFormModal({ mode, hacienda, open, onClose, onSaved }) {
  const isEdit = mode === 'edit';
  const createHacienda = useHaciendaStore((state) => state.createHacienda);
  const updateHacienda = useHaciendaStore((state) => state.updateHacienda);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isEdit ? updateHaciendaSchema : createHaciendaSchema),
    defaultValues: isEdit
      ? { nombre: hacienda.nombre, ubicacion: hacienda.ubicacion, estatus: hacienda.estatus }
      : { nombre: '', ubicacion: '', estatus: 'Activo' },
    mode: 'onBlur',
  });

  // Guarda en el store. El store ya refresca lista y contador.
  async function onSubmit(values) {
    try {
      if (isEdit) {
        await updateHacienda(hacienda.idHacienda, values);
        notify.success('Hacienda actualizada correctamente');
      } else {
        await createHacienda(values);
        notify.success('Hacienda creada correctamente');
      }
      onSaved();
    } catch (error) {
      // Duplicado de nombre (409) directo al campo. El resto, error general + toast.
      if (error?.status === 409) {
        setError('nombre', { type: 'conflict', message: error.message });
        return;
      }
      const message = error?.message ?? 'No se pudo guardar. Inténtalo de nuevo.';
      setError('root', { type: 'server', message });
      notify.error(message);
    }
  }

  const estatusError = errors.estatus?.message;
  const estatusId = 'hacienda-estatus';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar hacienda' : 'Nueva hacienda'}
      description={
        isEdit
          ? `Modifica los datos de "${hacienda.nombre}".`
          : 'Completa los datos para registrar una hacienda.'
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <TextField
          id="hacienda-nombre"
          label="Nombre"
          autoFocus
          maxLength={150}
          placeholder="Hacienda El Paraíso"
          error={errors.nombre?.message}
          {...register('nombre')}
        />
        <TextField
          id="hacienda-ubicacion"
          label="Ubicación"
          maxLength={255}
          placeholder="Tacuba, Ahuachapán"
          error={errors.ubicacion?.message}
          {...register('ubicacion')}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor={estatusId} className="text-sm font-medium text-text-primary">
            Estatus
          </label>
          <select
            id={estatusId}
            aria-invalid={Boolean(estatusError)}
            aria-describedby={estatusError ? `${estatusId}-error` : undefined}
            className={cn(
              'h-10 rounded-md border border-border bg-surface px-3 text-sm text-text-primary',
              'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30',
              estatusError && 'border-danger focus:border-danger focus:ring-danger/20'
            )}
            {...register('estatus')}
          >
            {ESTATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {estatusError && (
            <p id={`${estatusId}-error`} role="alert" className="text-xs text-danger">
              {estatusError}
            </p>
          )}
        </div>

        {errors.root?.message && (
          <p
            role="alert"
            aria-live="polite"
            className="rounded-md bg-danger-muted px-3 py-2 text-sm text-danger"
          >
            {errors.root.message}
          </p>
        )}

        <div className="mt-1 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear hacienda'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
