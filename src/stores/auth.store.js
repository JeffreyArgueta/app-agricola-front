// Sesión de autenticación global (login estático de demostración).
// Persiste solo la bandera de sesión y el nombre de usuario en sessionStorage.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEMO_CREDENTIALS } from '@/data/auth-credentials.js';

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // Valida contra las credenciales estáticas. Nunca registra la contraseña.
      login: (username, password) => {
        const cleanUsername = String(username ?? '').trim();
        if (
          cleanUsername === DEMO_CREDENTIALS.username &&
          String(password ?? '') === DEMO_CREDENTIALS.password
        ) {
          const user = { username: DEMO_CREDENTIALS.username };
          set({ user, isAuthenticated: true });
          return { ok: true, user };
        }
        return { ok: false, message: 'Usuario o contraseña inválidos. Inténtalo de nuevo.' };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'agricola-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
