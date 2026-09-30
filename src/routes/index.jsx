// Definición de rutas: login público, shell protegido y 404.
// Todas las páginas van con lazy() + Suspense para dividir el bundle por ruta.
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout.jsx';
import { NotFound } from '@/components/layout/not-found.jsx';
import { PageLoader } from '@/components/layout/page-loader.jsx';
import { RequireAuth } from '@/routes/guards.jsx';

// Carga lazy por feature — Vite genera un chunk por cada límite lazy.
const LoginPage = lazy(() =>
  import('@/features/auth/components/login-page.jsx').then((module) => ({
    default: module.LoginPage,
  }))
);
const DashboardPage = lazy(() =>
  import('@/features/dashboard/components/dashboard-page.jsx').then((module) => ({
    default: module.DashboardPage,
  }))
);
const HaciendasPage = lazy(() =>
  import('@/features/haciendas/components/haciendas-page.jsx').then((module) => ({
    default: module.HaciendasPage,
  }))
);

function withSuspense(Element) {
  return <Suspense fallback={<PageLoader />}>{Element}</Suspense>;
}

export const router = createBrowserRouter([
  { path: '/login', element: withSuspense(<LoginPage />) },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // El dashboard es la vista por defecto tras el login.
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: withSuspense(<DashboardPage />) },
          { path: '/haciendas', element: withSuspense(<HaciendasPage />) },
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFound />) },
]);
