// Protegido: sidebar con Dashboard/Haciendas, topbar móvil y botón de logout.
// Todo enlace y botón usa los primitivos compartidos y los tokens del tema.
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, Sprout, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useAuthStore } from '@/stores/auth.store.js';
import { notify } from '@/services/toast.js';
import { cn } from '@/lib/cn.js';

// Opciones del menú lateral: el dashboard es la vista por defecto tras el login.
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/haciendas', label: 'Haciendas', Icon: Sprout },
];

function NavList({ onNavigate }) {
  return (
    <nav aria-label="Menú principal" className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-light text-brand-dark'
                : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
            )
          }
        >
          <Icon aria-hidden className="h-5 w-5 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  // Cierra la sesión, avisa con toast y vuelve al login.
  function handleLogout() {
    logout();
    notify.success('Sesión cerrada correctamente');
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-svh bg-surface-muted">
      {/* Enlace de salto para teclado y lector de pantalla */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>

      {/* Sidebar de escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
            <Sprout aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">CASSA Agrícola</p>
            <p className="text-xs text-text-secondary">Gestión de haciendas</p>
          </div>
        </div>
        <NavList />
        <div className="mt-auto border-t border-border p-4">
          <div className="mb-3 flex items-center gap-2.5 px-1">
            <span
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-muted text-sm font-semibold uppercase text-brand-dark"
            >
              {user?.username?.charAt(0) ?? 'U'}
            </span>
            <p className="truncate text-sm font-medium text-text-primary">{user?.username}</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-danger hover:text-danger"
          >
            <LogOut aria-hidden className="h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Drawer móvil + velo */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={closeMenu}
          className="fixed inset-0 z-30 bg-text-primary/40 lg:hidden"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:hidden',
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between px-5 pb-5 pt-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
              <Sprout aria-hidden className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold text-text-primary">CASSA Agrícola</p>
          </div>
          <Button variant="ghost" size="icon" onClick={closeMenu} aria-label="Cerrar menú">
            <X aria-hidden className="h-5 w-5" />
          </Button>
        </div>
        <NavList onNavigate={closeMenu} />
        <div className="mt-auto border-t border-border p-4">
          <p className="mb-3 truncate px-1 text-sm font-medium text-text-primary">
            {user?.username}
          </p>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-danger hover:text-danger"
          >
            <LogOut aria-hidden className="h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Contenido: en escritorio deja espacio al sidebar fijo */}
      <div className="flex min-h-svh flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu aria-hidden className="h-5 w-5" />
          </Button>
          <p className="text-sm font-semibold text-text-primary">CASSA Agrícola</p>
        </header>
        <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
