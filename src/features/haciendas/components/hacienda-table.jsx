// Tabla de haciendas con acciones por fila.
// En móvil la primera columna (Nombre) queda fija y el resto se desplaza.
// Desactivar solo aplica a filas activas.
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { EstatusBadge } from '@/features/haciendas/components/estatus-badge.jsx';

export function HaciendaTable({ items, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">Listado de haciendas con estatus y acciones</caption>
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-secondary">
            <th
              scope="col"
              className="px-4 py-3 font-medium max-md:sticky max-md:left-0 max-md:z-10 max-md:bg-surface max-md:shadow-[2px_0_4px_-2px_rgba(26,46,31,0.2)]"
            >
              Nombre
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Ubicación
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Estatus
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((hacienda) => {
            const isActive = hacienda.estatus === 'Activo';
            return (
              <tr
                key={hacienda.idHacienda}
                className="border-b border-border last:border-0 hover:bg-surface-muted/60"
              >
                <td
                  scope="row"
                  className="px-4 py-3 font-medium text-text-primary max-md:sticky max-md:left-0 max-md:z-10 max-md:bg-surface max-md:shadow-[2px_0_4px_-2px_rgba(26,46,31,0.2)]"
                >
                  {hacienda.nombre}
                </td>
                <td className="px-4 py-3 text-text-secondary">{hacienda.ubicacion}</td>
                <td className="px-4 py-3">
                  <EstatusBadge value={hacienda.estatus} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(hacienda)}
                      aria-label={`Editar ${hacienda.nombre}`}
                      title="Editar"
                    >
                      <Pencil aria-hidden className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(hacienda)}
                      disabled={!isActive}
                      aria-label={`Desactivar ${hacienda.nombre}`}
                      title={isActive ? 'Desactivar' : 'Ya está inactiva'}
                      className="text-danger hover:text-danger disabled:text-text-secondary/50"
                    >
                      <Trash2 aria-hidden className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
