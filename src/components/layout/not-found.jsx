// Página 404 con retorno al dashboard.
import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import { Card } from '@/components/ui/card.jsx';
import { useDocumentTitle } from '@/hooks/use-document-title.js';

export function NotFound() {
  useDocumentTitle('Página no encontrada');
  return (
    <div className="flex min-h-svh items-center justify-center bg-surface-muted px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <TriangleAlert aria-hidden className="mx-auto h-10 w-10 text-warning" />
        <h1 className="mt-4 text-xl font-semibold text-text-primary">Página no encontrada</h1>
        <p className="mt-2 text-sm text-text-secondary">
          La ruta que buscas no existe o fue movida.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-brand px-4 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Volver al dashboard
        </Link>
      </Card>
    </div>
  );
}
