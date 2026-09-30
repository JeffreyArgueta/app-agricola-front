// Fija el título del documento por vista (accesibilidad y pestañas del navegador).
import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · CASSA Agrícola`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
