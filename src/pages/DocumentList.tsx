import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { odfDocumentsApi } from "../api/odfDocuments";
import "./DocumentList.css";

export default function DocumentList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState({
    competitionCode: "",
    documentCode: "",
    documentType: "",
    documentSubtype: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["documents", page, pageSize, filters],
    queryFn: () =>
      odfDocumentsApi.getAll({
        page,
        pageSize,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== ""),
        ),
      }),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  if (isLoading) return <div className="loading">Cargando documentos...</div>;
  if (error)
    return (
      <div className="error">
        Error al cargar documentos: {error instanceof Error ? error.message : "Error desconocido"}
      </div>
    );

  return (
    <div className="document-list">
      <h2>Documentos ODF</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Código de competencia"
          value={filters.competitionCode}
          onChange={(e) => handleFilterChange("competitionCode", e.target.value)}
        />
        <input
          type="text"
          placeholder="Código de documento"
          value={filters.documentCode}
          onChange={(e) => handleFilterChange("documentCode", e.target.value)}
        />
        <input
          type="text"
          placeholder="Tipo de documento"
          value={filters.documentType}
          onChange={(e) => handleFilterChange("documentType", e.target.value)}
        />
        <input
          type="text"
          placeholder="Subtipo de documento"
          value={filters.documentSubtype}
          onChange={(e) => handleFilterChange("documentSubtype", e.target.value)}
        />
      </div>

      <div className="document-count">
        Total: {data?.total || 0} documentos
      </div>

      <table className="documents-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Versión</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.documentCode}</td>
              <td>
                {doc.documentType}
                {doc.documentSubtype && ` (${doc.documentSubtype})`}
              </td>
              <td>{doc.version}</td>
              <td>{new Date(doc.date).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => navigate(`/documents/${doc.id}`)}
                  className="btn-view"
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data && data.total > pageSize && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </button>
          <span>
            Página {page} de {Math.ceil(data.total / pageSize)}
          </span>
          <button
            disabled={page >= Math.ceil(data.total / pageSize)}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

