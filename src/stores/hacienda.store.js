// Estado global de haciendas (Zustand).
// Contador para el dashboard + listado, paginación y acciones CRUD.
import { create } from 'zustand';
import {
  createHacienda as createHaciendaApi,
  deleteHacienda as deleteHaciendaApi,
  getHaciendasCount,
  listHaciendas,
  updateHacienda as updateHaciendaApi,
} from '@/services/api.js';
import { toUserMessage } from '@/services/toast.js';

// Identificador: solo la petición más reciente escribe el estado.
// Evita que una cancelación (doble efecto de StrictMode o desmontaje) bloquee el estado en "loading".
let countRequestId = 0;
let listRequestId = 0;

// Filas por página de la tabla de haciendas.
const PAGE_SIZE = 8;

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

  // Listado paginado con filtro por estatus ('' = todas).
  items: [],
  pagination: null, // { total, limit, offset, currentPage, totalPages, hasNextPage, hasPrevPage }
  listStatus: 'idle', // idle | loading | success | error
  listError: null,
  estatusFilter: '',
  limit: PAGE_SIZE,
  offset: 0,

  // Pide la página actual al backend. Solo la petición más reciente escribe.
  fetchHaciendas: async (signal) => {
    const requestId = ++listRequestId;
    const { estatusFilter, limit, offset } = get();
    set({ listStatus: 'loading', listError: null });
    try {
      const { items, pagination } = await listHaciendas({
        limit,
        offset,
        estatus: estatusFilter || undefined,
        signal,
      });
      if (requestId !== listRequestId) return;
      set({ items, pagination, listStatus: 'success' });
    } catch (error) {
      if (requestId !== listRequestId) return;
      if (signal?.aborted) {
        set({ listStatus: 'idle', listError: null });
        return;
      }
      set({ listStatus: 'error', listError: toUserMessage(error) });
    }
  },

  // Cambia el filtro y vuelve a la primera página (el hook re-pide).
  setEstatusFilter: (estatus) => {
    set({ estatusFilter: estatus ?? '', offset: 0 });
  },

  // Salta a la página indicada (base 1).
  setPage: (page) => {
    const { limit, pagination } = get();
    const totalPages = pagination?.totalPages ?? 1;
    const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
    set({ offset: (safePage - 1) * limit });
  },

  // Crea y refresca: vuelve a la primera página y actualiza el contador.
  // Lanza el HttpError para que el formulario mapee 409/422 a los campos.
  createHacienda: async (values) => {
    const created = await createHaciendaApi(values);
    set({ offset: 0 });
    await get().fetchHaciendas();
    await get().fetchCount();
    return created;
  },

  // Actualiza y refresca la página actual. Lanza el HttpError al formulario.
  updateHacienda: async (id, patch) => {
    const updated = await updateHaciendaApi(id, patch);
    await get().fetchHaciendas();
    return updated;
  },

  // Lógica (estatus -> Inactivo) y refresca.
  // Si la página queda vacía, retrocede a la anterior. Lanza el HttpError al diálogo.
  removeHacienda: async (id) => {
    const removed = await deleteHaciendaApi(id);
    await get().fetchHaciendas();
    const { items, offset, limit } = get();
    if (items.length === 0 && offset > 0) {
      set({ offset: Math.max(0, offset - limit) });
      await get().fetchHaciendas();
    }
    return removed;
  },
}));
