# App Agrícola — Frontend (`app-agricola-front`)

SPA (Vite + React) para gestionar las **haciendas** de CASSA Agrícola. Consume el API REST
(`app-agricola-back`, Node.js + Express + MySQL) con login estático de demostración,
dashboard con contador y CRUD completo de haciendas.

## Stack

| Área            | Elección                                                                         |
| --------------- | -------------------------------------------------------------------------------- |
| App             | Vite 8 + React 19 + JavaScript ESM (`type: module`), gestor `pnpm`               |
| Estilos         | Tailwind CSS 3.4 (fijado) + `postcss` + `autoprefixer`, tokens en `theme.extend` |
| Ruteo           | `react-router-dom` (rutas `lazy()` + guardián `RequireAuth`)                     |
| Estado global   | `zustand` (sesión en `sessionStorage`, haciendas con rebanadas)                  |
| Estado servidor | `fetch` propio (`services/http.js`, errores tipados `HttpError`)                 |
| Formularios     | `react-hook-form` + `zod` (`@hookform/resolvers`)                                |
| UX              | `react-hot-toast` (centralizado en `services/toast.js`) + `lucide-react`         |
| Calidad         | `oxlint` + `prettier`                                                            |

## Requisitos

- Node.js >= 22 (ver `.nvmrc`) y `pnpm >= 10` (`corepack enable` si hace falta).
- Backend corriendo en `http://localhost:3000` con base seeded (`pnpm run db:seed` en
  `app-agricola-back`). El frontend llama a `http://localhost:3000/api/v1`.

## Inicio rápido

```bash
# 1) Instalar
pnpm install

# 2) Configurar entorno
cp .env.example .env
# VITE_API_URL=http://localhost:3000/api/v1

# 3) Desarrollo / producción
pnpm dev      # http://localhost:5173 (con HMR)
pnpm build    # compilado a dist/
pnpm preview  # sirve dist/
```

Acceso demo (login estático, solo desarrollo): usuario `devcassa` · contraseña `cassa123`.

## Entorno (`.env`)

`src/config/env.js` es el **único** lugar que lee `import.meta.env`. Valida al importar y
falla temprano si falta algo. `.env` no se publica; `.env.example` documenta las variables.

| Var             | Ejemplo                        | Descripción                                     |
| --------------- | ------------------------------ | ----------------------------------------------- |
| `VITE_API_URL`  | `http://localhost:3000/api/v1` | Base del API (pública por diseño, sin secretos) |
| `VITE_APP_NAME` | `CASSA Agricola`               | Nombre mostrado en la app                       |

> Nota: Vite inyecta el entorno en **tiempo de compilación**. Para cambiar de backend hay que
> reconstruir (`pnpm build`).

## Scripts

| Comando             | Descripción                      |
| ------------------- | -------------------------------- |
| `pnpm dev`          | Desarrollo con HMR (`--host`)    |
| `pnpm build`        | Compilado de producción          |
| `pnpm preview`      | Sirve `dist/`                    |
| `pnpm lint`         | Revisión con Oxlint              |
| `pnpm lint:fix`     | Corrección automática con Oxlint |
| `pnpm format`       | Formato con Prettier             |
| `pnpm format:check` | Verificación de formato (CI)     |
| `pnpm audit`        | Auditoría de vulnerabilidades    |

Puertas de calidad antes de subir: `lint` + `format:check` + `build` en verde.

## Rutas

| Ruta         | Acceso    | Descripción                                  |
| ------------ | --------- | -------------------------------------------- |
| `/login`     | Pública   | Login estático; redirige al destino guardado |
| `/`          | Protegida | Redirige a `/dashboard`                      |
| `/dashboard` | Protegida | Tarjeta con el total de haciendas (defecto)  |
| `/haciendas` | Protegida | Tabla con filtro, paginación y CRUD          |
| `*`          | Pública   | Página 404 con retorno al dashboard          |

Sin sesión activa, `RequireAuth` redirige a `/login` guardando el destino en
`location.state.from`.

## Estructura del proyecto

```
.
  index.html  vite.config.js  tailwind.config.js  postcss.config.js
  jsconfig.json (@ -> src/)  .env.example  .nvmrc
  src/
    main.jsx                 entrada: router + <Toaster /> una sola vez
    index.css                directivas Tailwind + base + animaciones
    config/env.js            única lectura de import.meta.env (validada con zod)
    routes/                  index.jsx (router) + guards.jsx (RequireAuth)
    data/                    auth-credentials.js (credenciales demo)
    stores/                  auth.store.js + hacienda.store.js (zustand)
    services/                http.js (HttpError) + api.js (adaptadores) + toast.js (notify)
    lib/cn.js                único combinador de clases (clsx + tailwind-merge)
    hooks/                   use-document-title.js
    components/
      ui/                    button, text-field, card, skeleton, modal (primitivos)
      layout/                app-layout (sidebar + logout), page-loader, not-found
    features/
      auth/                  login-page + login.schema + index.js
      dashboard/             dashboard-page + count-card + use-haciendas-count
      haciendas/             tabla, badge, paginación, vacío, modales, hook, schemas
```

Regla de capas: `routes → features/components → components/ui + hooks → services/http → API`.
Los componentes nunca llaman `fetch` ni `toast()` directo: usan `services/api.js` y `notify`.

## Contratos del backend

Éxito `{ status, message, data }` (+ `pagination` en listas).
Errores `{ status: false, message, code }`: `422 VALIDATION_ERROR`, `404 NOT_FOUND`,
`409 CONFLICT` (nombre duplicado → se mapea al campo del formulario).

| Método   | Ruta                                 | Uso en la app                      |
| -------- | ------------------------------------ | ---------------------------------- |
| `GET`    | `/haciendas?limit=&offset=&estatus=` | Tabla (8 filas/página + filtro)    |
| `GET`    | `/haciendas/count`                   | Tarjeta del dashboard              |
| `POST`   | `/haciendas`                         | Modal de creación                  |
| `PUT`    | `/haciendas/:id`                     | Modal de edición                   |
| `DELETE` | `/haciendas/:id`                     | Lógica → `estatus='Inactivo'`      |

Fila: `idHacienda`, `nombre` (único, 150), `ubicacion` (255), `estatus`
(`Activo`/`Inactivo`), `created_at`, `updated_at`. El contador incluye inactivas.

## Convenciones

- Archivos `kebab-case`; componentes `PascalCase`; hooks/funciones `camelCase`.
- **Código, logs y nombres en inglés; cada comentario en español.**
- Sin hex en componentes: todo color vive en `tailwind.config.js` (`theme.extend`).
- Formularios con `label[htmlFor]` + `aria-invalid` + `aria-describedby`. Modales con foco
  atrapado y retorno al disparador. Respeta `prefers-reduced-motion`.

## Decisiones registradas

- **Auth estática demo:** sin backend de auth, bandera de sesión + usuario en Zustand
  persistido en `sessionStorage` (nunca `localStorage`, nunca se registra la contraseña).
- **Sin `react-query`:** un solo recurso; `services/http.js` (timeout 15s, `signal`,
  `encodeURIComponent`) + rebanadas Zustand con última-petición-gana.
- **Toasts centralizados:** `notify.success/error/loading` en `services/toast.js`;
  cada acción CRUD avisa y refresca la lista.
