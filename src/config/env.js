// Único lugar que lee import.meta.env. Valida al importar y falla temprano.
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z
    .string()
    .trim()
    .min(1, 'VITE_API_URL is required (e.g. http://localhost:3000/api/v1)')
    .refine((value) => value === '' || URL.canParse(value), {
      message: 'VITE_API_URL must be a valid URL',
    }),
  VITE_APP_NAME: z.string().trim().optional().default('CASSA Agricola'),
});

function readEnv() {
  return envSchema.parse({
    VITE_API_URL: import.meta.env.VITE_API_URL ?? '',
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  });
}

export const env = readEnv();

export function assertEnv() {
  if (!env.VITE_API_URL) {
    throw new Error(
      'Set VITE_API_URL in .env (e.g. http://localhost:3000/api/v1). See .env.example.'
    );
  }
}

assertEnv();
