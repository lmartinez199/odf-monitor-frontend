import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3011/api";

/**
 * Cliente axios configurado para la aplicación
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de solicitudes: Agrega configuración común a todas las peticiones
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Aquí puedes agregar tokens de autenticación si es necesario
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas: Maneja errores globales
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejo centralizado de errores
    if (error.response) {
      // El servidor respondió con un código de error
      switch (error.response.status) {
        case 401:
          console.error("No autorizado - Verifica tus credenciales");
          // Aquí puedes redirigir al login si es necesario
          break;
        case 403:
          console.error("Acceso prohibido");
          break;
        case 404:
          console.error("Recurso no encontrado");
          break;
        case 500:
          console.error("Error interno del servidor");
          break;
        default:
          console.error(`Error ${error.response.status}:`, error.response.data);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error(
        "No se pudo conectar con el servidor. Verifica tu conexión."
      );
    } else {
      // Algo pasó al configurar la petición
      console.error("Error al configurar la petición:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
