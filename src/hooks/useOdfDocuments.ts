import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import {
  odfDocumentsApi,
  OdfDocument,
  DocumentListResponse,
  DocumentListParams,
  DocumentComparison,
  DisciplineListResponse,
} from "../api/odfDocuments";

/**
 * Claves de query para React Query
 */
export const odfDocumentsKeys = {
  all: ["odf-documents"] as const,
  lists: () => [...odfDocumentsKeys.all, "list"] as const,
  list: (params?: DocumentListParams) =>
    [...odfDocumentsKeys.lists(), params] as const,
  details: () => [...odfDocumentsKeys.all, "detail"] as const,
  detail: (id: string) => [...odfDocumentsKeys.details(), id] as const,
  parsed: (id: string) => [...odfDocumentsKeys.detail(id), "parsed"] as const,
  byDocumentCode: (documentCode: string) =>
    [...odfDocumentsKeys.all, "document-code", documentCode] as const,
  comparison: (id1: string, id2: string) =>
    [...odfDocumentsKeys.all, "compare", id1, id2] as const,
};

/**
 * Hook para obtener una lista de documentos ODF con paginación y filtros
 */
export function useOdfDocuments(
  params?: DocumentListParams,
  options?: Omit<
    UseQueryOptions<DocumentListResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: odfDocumentsKeys.list(params),
    queryFn: () => odfDocumentsApi.getAll(params),
    ...options,
  });
}

/**
 * Hook para obtener un documento específico por ID
 */
export function useOdfDocument(
  id: string,
  options?: Omit<UseQueryOptions<OdfDocument, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: odfDocumentsKeys.detail(id),
    queryFn: () => odfDocumentsApi.getById(id),
    enabled: !!id, // Solo ejecuta si hay un ID
    ...options,
  });
}

/**
 * Hook para obtener el contenido parseado de un documento
 */
export function useOdfDocumentParsed(
  id: string,
  options?: Omit<UseQueryOptions<unknown, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: odfDocumentsKeys.parsed(id),
    queryFn: () => odfDocumentsApi.getParsedContent(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook para buscar documentos por código de documento
 */
export function useOdfDocumentsByDocumentCode(
  documentCode: string,
  options?: Omit<UseQueryOptions<OdfDocument[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: odfDocumentsKeys.byDocumentCode(documentCode),
    queryFn: () => odfDocumentsApi.findByDocumentCode(documentCode),
    enabled: !!documentCode,
    ...options,
  });
}

/**
 * Hook para comparar dos documentos
 */
export function useOdfDocumentComparison(
  id1: string,
  id2: string,
  options?: Omit<
    UseQueryOptions<DocumentComparison, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: odfDocumentsKeys.comparison(id1, id2),
    queryFn: () => odfDocumentsApi.compare(id1, id2),
    enabled: !!id1 && !!id2, // Solo ejecuta si ambos IDs están presentes
    ...options,
  });
}

/**
 * Hook para obtener la lista de disciplinas disponibles
 */
export function useDisciplines(
  options?: Omit<
    UseQueryOptions<DisciplineListResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: [...odfDocumentsKeys.all, "disciplines"] as const,
    queryFn: () => odfDocumentsApi.getDisciplines(),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos (las disciplinas no cambian frecuentemente)
    ...options,
  });
}
