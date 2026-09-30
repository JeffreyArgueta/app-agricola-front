// Adaptadores de dominio para el recurso Haciendas (backend: app-agricola-back).
// GET /haciendas?limit&offset&estatus, GET /haciendas/count,
// GET /haciendas/:id, POST /haciendas, PUT /haciendas/:id, DELETE /haciendas/:id
// http() desenvuelve el envoltorio del backend -> data. Las listas conservan { items, pagination }.
import { http } from '@/services/http.js';

function encodeId(id) {
  return encodeURIComponent(String(id));
}

// Normaliza la lista del backend a { items, pagination }.
// El backend responde { data: rows[], pagination: { total, limit, offset, ... } }.
function toListResult(payload) {
  const items = Array.isArray(payload) ? payload : (payload?.data ?? []);
  const pagination = payload?.pagination ?? null;
  return { items: Array.isArray(items) ? items : [], pagination };
}

export async function listHaciendas({ limit = 10, offset = 0, estatus, signal } = {}) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (estatus) params.set('estatus', estatus);
  // Sin unwrap para conservar pagination junto a data.
  const payload = await http(`/haciendas?${params.toString()}`, { signal, unwrap: false });
  return toListResult(payload);
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

// estatus = 'Inactivo', la fila se conserva.
export async function deleteHacienda(id, { signal } = {}) {
  return http(`/haciendas/${encodeId(id)}`, { method: 'DELETE', signal });
}
