// Adaptadores de dominio para el recurso Haciendas (backend: app-agricola-back).
// GET /haciendas?limit&offset&estatus, GET /haciendas/count,
// GET /haciendas/:id, POST /haciendas, PUT /haciendas/:id, DELETE (baja lógica) /haciendas/:id
// http() desenvuelve el envoltorio del backend -> data. Las listas conservan { items, pagination }.
import { http } from '@/services/http.js';

function encodeId(id) {
  return encodeURIComponent(String(id));
}

function toListResult(data) {
  if (Array.isArray(data)) return { items: data, pagination: null };
  if (data && typeof data === 'object') {
    const items = Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.haciendas)
        ? data.haciendas
        : Array.isArray(data.data)
          ? data.data
          : [];
    const pagination = data.pagination ?? null;
    return { items, pagination };
  }
  return { items: [], pagination: null };
}

export async function listHaciendas({ limit = 10, offset = 0, estatus, signal } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (estatus) params.set('estatus', estatus);
  const data = await http(`/haciendas?${params.toString()}`, { signal });
  return toListResult(data);
}

export async function getHaciendasCount({ signal } = {}) {
  const data = await http('/haciendas/count', { signal });
  if (typeof data === 'number') return data;
  if (data && typeof data.total === 'number') return data.total;
  return 0;
}

export async function getHaciendaById(id, { signal } = {}) {
  return http(`/haciendas/${encodeId(id)}`, { signal });
}

export async function createHacienda({ nombre, ubicacion, estatus = 'Activo' }, { signal } = {}) {
  return http('/haciendas', {
    method: 'POST',
    body: { nombre, ubicacion, estatus },
    signal,
  });
}

export async function updateHacienda(id, patch, { signal } = {}) {
  return http(`/haciendas/${encodeId(id)}`, {
    method: 'PUT',
    body: patch,
    signal,
  });
}

// Baja lógica en el backend: pone estatus = 'Inactivo', la fila se conserva.
export async function deleteHacienda(id, { signal } = {}) {
  return http(`/haciendas/${encodeId(id)}`, { method: 'DELETE', signal });
}
