import apiClient from "../lib/axios";

export interface OdfDocument {
  id: string;
  competitionCode: string;
  documentCode: string;
  documentType: string;
  documentSubtype?: string;
  version: string;
  date: string;
  content: string;
  resultStatus?: string;
  unitCodes?: string[];
  contentHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentListResponse {
  documents: OdfDocument[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DocumentComparison {
  document1: {
    id: string;
    xmlContent: string;
  };
  document2: {
    id: string;
    xmlContent: string;
  };
}

export interface DocumentListParams {
  page?: number;
  pageSize?: number;
  competitionCode?: string;
  documentCode?: string;
  documentType?: string;
  documentSubtype?: string;
}

/**
 * Servicio de API para documentos ODF
 * Usa el cliente axios centralizado configurado
 */
export const odfDocumentsApi = {
  /**
   * Obtiene una lista paginada de documentos ODF
   */
  async getAll(params?: DocumentListParams): Promise<DocumentListResponse> {
    const response = await apiClient.get<DocumentListResponse>(
      "/odf-documents",
      { params }
    );
    return response.data;
  },

  /**
   * Obtiene un documento por su ID
   */
  async getById(id: string): Promise<OdfDocument> {
    const response = await apiClient.get<OdfDocument>(`/odf-documents/${id}`);
    return response.data;
  },

  /**
   * Obtiene el contenido parseado de un documento
   */
  async getParsedContent(id: string): Promise<unknown> {
    const response = await apiClient.get<unknown>(
      `/odf-documents/${id}/parsed`
    );
    return response.data;
  },

  /**
   * Busca documentos por código de documento
   */
  async findByDocumentCode(documentCode: string): Promise<OdfDocument[]> {
    const response = await apiClient.get<OdfDocument[]>(
      `/odf-documents/document-code/${documentCode}`
    );
    return response.data;
  },

  /**
   * Compara dos documentos por sus IDs
   */
  async compare(id1: string, id2: string): Promise<DocumentComparison> {
    const response = await apiClient.get<DocumentComparison>(
      `/odf-documents/compare/${id1}/${id2}`
    );
    return response.data;
  },
};
