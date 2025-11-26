# Guía de Uso del Backend API

Esta guía explica cómo consumir el backend desde el frontend.

## Configuración

### Variables de Entorno

El frontend está configurado para conectarse al backend mediante:

- **Variable de entorno**: `VITE_API_URL` (opcional)
- **Proxy de Vite**: Configurado en `vite.config.ts` para redirigir `/api` a `http://localhost:3011`

Si no defines `VITE_API_URL`, el proxy de Vite se encargará de redirigir las peticiones.

### Archivos de Configuración

- **`src/lib/axios.ts`**: Cliente axios centralizado con interceptores
- **`src/lib/queryClient.ts`**: Configuración de React Query
- **`src/api/odfDocuments.ts`**: Servicio de API para documentos ODF
- **`src/hooks/useOdfDocuments.ts`**: Hooks personalizados con React Query

## Estructura de Archivos

```
src/
├── lib/
│   ├── axios.ts           # Cliente HTTP configurado
│   └── queryClient.ts     # Configuración de React Query
├── api/
│   └── odfDocuments.ts    # Servicios de API
└── hooks/
    └── useOdfDocuments.ts # Hooks personalizados
```

## Formas de Consumir el Backend

### 1. Usando Hooks Personalizados (Recomendado)

Los hooks personalizados encapsulan la lógica de React Query y son la forma más limpia:

```typescript
import { useOdfDocuments, useOdfDocument } from "../hooks/useOdfDocuments";

// Obtener lista de documentos
function DocumentList() {
  const { data, isLoading, error } = useOdfDocuments({
    page: 1,
    pageSize: 20,
    competitionCode: "COMP001",
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.documents.map((doc) => (
        <div key={doc.id}>{doc.documentCode}</div>
      ))}
    </div>
  );
}

// Obtener un documento específico
function DocumentDetail({ id }: { id: string }) {
  const { data: document, isLoading } = useOdfDocument(id);

  if (isLoading) return <div>Cargando...</div>;

  return <div>{document?.documentCode}</div>;
}
```

### 2. Usando el Servicio de API Directamente

Si necesitas más control o hacer llamadas fuera de componentes React:

```typescript
import { odfDocumentsApi } from "../api/odfDocuments";

// Llamada directa
const documents = await odfDocumentsApi.getAll({
  page: 1,
  pageSize: 20,
});

const document = await odfDocumentsApi.getById("123");
```

### 3. Usando el Cliente Axios Directamente

Para casos especiales o endpoints nuevos:

```typescript
import apiClient from "../lib/axios";

const response = await apiClient.get("/custom-endpoint");
```

## Hooks Disponibles

### `useOdfDocuments(params?, options?)`

Obtiene una lista paginada de documentos con filtros.

**Parámetros:**
- `params`: Opcional, incluye `page`, `pageSize`, `competitionCode`, `documentCode`, `documentType`, `documentSubtype`
- `options`: Opciones adicionales de React Query

**Ejemplo:**
```typescript
const { data, isLoading, error } = useOdfDocuments({
  page: 1,
  pageSize: 20,
  competitionCode: "COMP001",
});
```

### `useOdfDocument(id, options?)`

Obtiene un documento específico por ID.

**Ejemplo:**
```typescript
const { data: document } = useOdfDocument("123");
```

### `useOdfDocumentParsed(id, options?)`

Obtiene el contenido parseado de un documento.

**Ejemplo:**
```typescript
const { data: parsedContent } = useOdfDocumentParsed("123");
```

### `useOdfDocumentsByDocumentCode(documentCode, options?)`

Busca documentos por código de documento.

**Ejemplo:**
```typescript
const { data: documents } = useOdfDocumentsByDocumentCode("DOC001");
```

### `useOdfDocumentComparison(id1, id2, options?)`

Compara dos documentos.

**Ejemplo:**
```typescript
const { data: comparison } = useOdfDocumentComparison("123", "456");
```

## Manejo de Errores

Los errores se manejan automáticamente en los interceptores de axios. Los hooks de React Query también proporcionan el objeto `error`:

```typescript
const { data, error } = useOdfDocument("123");

if (error) {
  console.error("Error:", error.message);
  // Mostrar mensaje al usuario
}
```

## Características

- ✅ **Cache automático**: React Query cachea las respuestas
- ✅ **Revalidación inteligente**: Los datos se actualizan cuando es necesario
- ✅ **Manejo de errores centralizado**: Los interceptores manejan errores HTTP
- ✅ **TypeScript**: Todo está tipado para autocompletado y seguridad
- ✅ **Interceptores**: Agregar headers, manejar tokens, etc.

## Ejemplo Completo

```typescript
import { useOdfDocuments } from "../hooks/useOdfDocuments";
import { useState } from "react";

export default function DocumentList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    competitionCode: "",
    documentCode: "",
  });

  const { data, isLoading, error, refetch } = useOdfDocuments({
    page,
    pageSize: 20,
    ...filters,
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()}>Recargar</button>
      {data?.documents.map((doc) => (
        <div key={doc.id}>{doc.documentCode}</div>
      ))}
    </div>
  );
}
```

