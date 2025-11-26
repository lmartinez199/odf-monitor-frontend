# ODF Monitor Frontend

Frontend para monitoreo y visualización de documentos ODF.

## Características

- Listar documentos ODF con filtros y paginación
- Ver detalles de documentos (XML/JSON)
- Visualizar contenido raw y parseado
- Comparar dos documentos XML lado a lado
- Buscar documentos por código

## Instalación

```bash
pnpm install
```

## Configuración

1. Crea un archivo `.env` si necesitas configurar variables de entorno:

```env
VITE_API_URL=http://localhost:3011/api
```

Por defecto, el frontend usa el proxy configurado en `vite.config.ts` que redirige `/api` a `http://localhost:3011`.

## Ejecución

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Preview de producción
pnpm preview
```

## Tecnologías

- React 18 con TypeScript
- Vite como build tool
- React Router DOM para navegación
- TanStack React Query para gestión de datos
- Axios para peticiones HTTP

## Estructura del Proyecto

```
src/
├── api/              # Cliente API y tipos
├── components/       # Componentes reutilizables
├── pages/           # Páginas de la aplicación
├── App.tsx          # Componente principal con rutas
└── main.tsx         # Punto de entrada
```

## Rutas

- `/` - Lista de documentos
- `/documents/:id` - Detalle de un documento
- `/compare/:id1/:id2` - Comparación entre dos documentos

