import { useEffect, useState } from "react";

/**
 * Hook personalizado para debounce de valores
 * Útil para evitar múltiples llamadas a API mientras el usuario escribe
 * @param value Valor a debounce
 * @param delay Tiempo de espera en milisegundos
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establecer un timer para actualizar el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timer si el valor cambia antes del delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

