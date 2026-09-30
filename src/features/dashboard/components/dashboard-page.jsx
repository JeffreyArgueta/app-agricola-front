// Vista temporal del dashboard.
import { Card } from '@/components/ui/card.jsx';

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
      <Card className="p-6">
        <p className="text-sm text-text-secondary">Próximamente: total de haciendas.</p>
      </Card>
    </div>
  );
}
