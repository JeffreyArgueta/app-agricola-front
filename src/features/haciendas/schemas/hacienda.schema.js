// Esquemas del feature de haciendas (zod). Reflejan las reglas del backend:
// nombre y ubicación requeridos, estatus Activo/Inactivo, sin campos extra.
import { z } from 'zod';

export const ESTATUS_OPTIONS = ['Activo', 'Inactivo'];

const nombreSchema = z
  .string()
  .trim()
  .min(1, 'El nombre es requerido')
  .max(150, 'El nombre admite máximo 150 caracteres');

const ubicacionSchema = z
  .string()
  .trim()
  .min(1, 'La ubicación es requerida')
  .max(255, 'La ubicación admite máximo 255 caracteres');

const estatusSchema = z.enum(ESTATUS_OPTIONS, {
  message: 'El estatus debe ser Activo o Inactivo',
});

// Creación: nombre y ubicación requeridos, estatus por defecto Activo.
export const createHaciendaSchema = z
  .object({
    nombre: nombreSchema,
    ubicacion: ubicacionSchema,
    estatus: estatusSchema.default('Activo'),
  })
  .strict();

// Edición: parcial como el PUT del backend, pero con al menos un campo.
export const updateHaciendaSchema = z
  .object({
    nombre: nombreSchema.optional(),
    ubicacion: ubicacionSchema.optional(),
    estatus: estatusSchema.optional(),
  })
  .strict()
  .refine((values) => Object.values(values).some((value) => value !== undefined), {
    message: 'Modifica al menos un campo para guardar',
  });
