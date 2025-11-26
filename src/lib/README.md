# Configuración de API

Este directorio contiene la configuración centralizada para consumir el backend.

## Estructura

- **`axios.ts`**: Cliente axios configurado con interceptores para manejo de errores y autenticación
- **`queryClient.ts`**: Configuración de React Query con opciones por defecto

## Variables de Entorno

El frontend busca la URL del backend en `VITE_API_URL`. Si no está definida, usa la URL por defecto: `http://localhost:3011/api`

Para configurar, crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3011/api
```

## Uso

El cliente axios está configurado para:
- Manejar errores HTTP automáticamente
- Agregar headers comunes
- Timeout de 30 segundos por defecto
- Logging de errores en consola

### Ejemplo de uso directo:

```typescript
import apiClient from "./lib/axios";

const response = await apiClient.get("/endpoint");
```

### Uso con hooks (recomendado):

Ver `src/hooks/useOdfDocuments.ts` para ejemplos de hooks personalizados con React Query.

