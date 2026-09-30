// Vista temporal de haciendas.
import { Card } from '@/components/ui/card.jsx';

export function HaciendasPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-text-primary">Haciendas</h1>
      <Card className="p-6">
        <p className="text-sm text-text-secondary">Próximamente: listado y gestión de haciendas.</p>
      </Card>
    </div>
  );
}
