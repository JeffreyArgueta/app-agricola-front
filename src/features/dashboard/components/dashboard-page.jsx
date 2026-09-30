import { CountCard } from '@/features/dashboard/components/count-card.jsx';
import { useHaciendasCount } from '@/features/dashboard/hooks/use-haciendas-count.js';
import { useDocumentTitle } from '@/hooks/use-document-title.js';

export function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { total, status, error, refresh } = useHaciendasCount();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">Resumen general de tus haciendas</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CountCard
          total={total}
          status={status}
          error={error}
          onRefresh={refresh}
          onRetry={refresh}
        />
      </div>
    </div>
  );
}
