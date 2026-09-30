// Estado global de haciendas (Zustand).
// Fase 2: contador para el dashboard.
// Fase 3: listado, paginación y acciones CRUD.
import { create } from 'zustand';
import { getHaciendasCount } from '@/services/api.js';
import { toUserMessage } from '@/services/toast.js';

// Identificador: solo la petición más reciente escribe el estado.
// Evita que una cancelación (doble efecto de StrictMode o desmontaje) bloquee el estado en "loading".
let countRequestId = 0;

export const useHaciendaStore = create((set, get) => ({
  // Contador del dashboard (incluye activas e inactivas).
  total: null,
  countStatus: 'idle', // idle | loading | success | error
  countError: null,

  // Pide el total al backend. Acepta signal para cancelar al desmontar.
  // Solo la petición más reciente escribe el estado.
  fetchCount: async (signal) => {
    const requestId = ++countRequestId;
    set({ countStatus: 'loading', countError: null });
    try {
      const total = await getHaciendasCount({ signal });
      if (requestId !== countRequestId) return;
      set({ total, countStatus: 'success' });
    } catch (error) {
      if (requestId !== countRequestId) return;
      // Cancelación por desmontaje: libera el estado sin mostrar error.
      if (signal?.aborted) {
        set({ countStatus: 'idle', countError: null });
        return;
      }
      set({ countStatus: 'error', countError: toUserMessage(error) });
    }
  },

  // Reintento manual (botón de actualizar o de reintentar).
  refreshCount: () => get().fetchCount(),
}));
