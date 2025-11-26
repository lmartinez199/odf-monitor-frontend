import { QueryClient } from "@tanstack/react-query";

/**
 * Cliente de React Query configurado con opciones por defecto
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "fresh" (en segundos)
      staleTime: 60 * 1000, // 1 minuto
      // Tiempo que los datos se mantienen en cache (en segundos)
      gcTime: 5 * 60 * 1000, // 5 minutos (antes cacheTime)
      // Reintentar automáticamente en caso de error
      retry: 1,
      // No refetch automático en window focus por defecto
      refetchOnWindowFocus: false,
      // No refetch automático al reconectar
      refetchOnReconnect: false,
    },
    mutations: {
      // Reintentar mutaciones fallidas
      retry: false,
    },
  },
});
