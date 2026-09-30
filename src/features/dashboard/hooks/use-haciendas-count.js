import { useEffect } from 'react';
import { useHaciendaStore } from '@/stores/hacienda.store.js';

export function useHaciendasCount() {
  const total = useHaciendaStore((state) => state.total);
  const status = useHaciendaStore((state) => state.countStatus);
  const error = useHaciendaStore((state) => state.countError);
  const fetchCount = useHaciendaStore((state) => state.fetchCount);
  const refreshCount = useHaciendaStore((state) => state.refreshCount);

  useEffect(() => {
    const controller = new AbortController();
    fetchCount(controller.signal);
    return () => controller.abort();
  }, [fetchCount]);

  return { total, status, error, refresh: refreshCount };
}
