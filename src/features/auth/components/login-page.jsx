// Página pública de login (credenciales estáticas de demostración).
// Si ya hay sesión activa, redirige al destino original o al dashboard.
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { TextField } from '@/components/ui/text-field.jsx';
import { useAuthStore } from '@/stores/auth.store.js';
import { notify } from '@/services/toast.js';
import { loginSchema } from '@/features/auth/schemas/login.schema.js';
import { useDocumentTitle } from '@/hooks/use-document-title.js';

export function LoginPage() {
  useDocumentTitle('Iniciar sesión');
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Destino guardado (RequireAuth) o dashboard por defecto.
  const next = location.state?.from ?? '/dashboard';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onBlur',
  });

  if (isAuthenticated) {
    return <Navigate to={next} replace />;
  }

  // Valida las credenciales estáticas y navega al destino protegido.
  async function onSubmit(values) {
    const result = login(values.username, values.password);
    if (result.ok) {
      notify.success(`Bienvenido, ${result.user.username}`);
      navigate(next, { replace: true });
      return;
    }
    setError('root', { type: 'credentials', message: result.message });
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface-muted px-4 py-10">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-brand-dark">
            <Sprout aria-hidden className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">CASSA Agrícola</h1>
            <p className="mt-1 text-sm text-text-secondary">Inicia sesión para continuar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <TextField
            id="username"
            label="Usuario"
            autoComplete="username"
            placeholder="devcassa"
            error={errors.username?.message}
            {...register('username')}
          />
          <TextField
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {errors.root?.message && (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-md bg-danger-muted px-3 py-2 text-sm text-danger"
            >
              {errors.root.message}
            </p>
          )}

          <Button type="submit" size="large" loading={isSubmitting} className="mt-1 w-full">
            {isSubmitting ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>

        {/* Ayuda de acceso para el entorno demo */}
        <p className="mt-4 rounded-md bg-surface-muted px-3 py-2 text-center text-xs text-text-secondary">
          Acceso demo - usuario <strong className="font-semibold">devcassa</strong> · contraseña{' '}
          <strong className="font-semibold">cassa123</strong>
        </p>
      </Card>
    </div>
  );
}
