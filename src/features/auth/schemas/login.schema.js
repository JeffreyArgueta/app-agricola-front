// Esquema de validación del login (zod).
import { z } from 'zod';

export const loginSchema = z
  .object({
    username: z.string().trim().min(1, 'El usuario es requerido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  })
  .strict();
