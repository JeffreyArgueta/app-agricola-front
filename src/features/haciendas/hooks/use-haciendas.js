// Listado: lo pide al montar y ante cada cambio de filtro o página.
import { useEffect } from 'react';
import { useHaciendaStore } from '@/stores/hacienda.store.js';

export function useHaciendas() {
  const items = useHaciendaStore((state) => state.items);
  const pagination = useHaciendaStore((state) => state.pagination);
  const status = useHaciendaStore((state) => state.listStatus);
  const error = useHaciendaStore((state) => state.listError);
  const estatusFilter = useHaciendaStore((state) => state.estatusFilter);
  const fetchHaciendas = useHaciendaStore((state) => state.fetchHaciendas);
  const setEstatusFilter = useHaciendaStore((state) => state.setEstatusFilter);
  const setPage = useHaciendaStore((state) => state.setPage);
  const offset = useHaciendaStore((state) => state.offset);

  useEffect(() => {
    const controller = new AbortController();
    fetchHaciendas(controller.signal);
    return () => controller.abort();
  }, [fetchHaciendas, estatusFilter, offset]);

  return {
    items,
    pagination,
    status,
    error,
    estatusFilter,
    setEstatusFilter,
    setPage,
    refresh: () => fetchHaciendas(),
  };
}
