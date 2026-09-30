// Helpers centralizados de toasts sobre react-hot-toast.
// Mantiene el estilo de éxito/error consistente y evita llamadas dispersas a toast().
import toast from 'react-hot-toast';

const baseStyle = {
  borderRadius: '8px',
  fontSize: '14px',
};

export const notify = {
  success(message) {
    toast.success(message, { style: baseStyle });
  },
  error(message) {
    toast.error(message, { style: baseStyle });
  },
  loading(message) {
    return toast.loading(message, { style: baseStyle });
  },
  dismiss(id) {
    toast.dismiss(id);
  },
};

export function toUserMessage(error, fallback = 'Something went wrong. Try again.') {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) {
    // Oculta el texto técnico, conserva los mensajes del backend.
    if (error.name === 'HttpError') return error.message;
    return fallback;
  }
  return fallback;
}
