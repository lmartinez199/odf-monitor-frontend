import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { odfDocumentsApi } from "../api/odfDocuments";
import { useDisciplines } from "../hooks/useOdfDocuments";
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
    discipline: "",
  });

  const { data: disciplinesData } = useDisciplines();

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

  // Extraer mensaje de error más descriptivo
  const getErrorMessage = () => {
    if (!error) return "Error desconocido";
    
    if (error instanceof Error) {
      // Si es un error de axios, intentar extraer el mensaje del servidor
      const axiosError = error as any;
      if (axiosError?.response?.data?.message) {
        return axiosError.response.data.message;
      }
      if (axiosError?.response?.data?.error) {
        return axiosError.response.data.error;
      }
      return error.message;
    }
    
    return "Error desconocido";
  };

  if (error)
    return (
      <div className="error">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar documentos</h3>
        <p>{getErrorMessage()}</p>
      </div>
    );

  return (
    <div className="document-list">
      <div className="document-list-header">
        <h2>Documentos ODF</h2>
        {data && (
          <div className="document-stats">
            <div className="stat-card">
              <div className="stat-label">Total</div>
              <div className="stat-value">{data.total.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Página</div>
              <div className="stat-value">
                {page} / {Math.ceil(data.total / pageSize)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="filters">
        <div className="filters-title">
          🔍 Filtros de búsqueda
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Código de competencia</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Ej: COMP001"
              value={filters.competitionCode}
              onChange={(e) => handleFilterChange("competitionCode", e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Código de documento</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Ej: DOC001"
              value={filters.documentCode}
              onChange={(e) => handleFilterChange("documentCode", e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Tipo de documento</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Ej: DT_RESULT"
              value={filters.documentType}
              onChange={(e) => handleFilterChange("documentType", e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Subtipo de documento</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Ej: FINAL"
              value={filters.documentSubtype}
              onChange={(e) => handleFilterChange("documentSubtype", e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Disciplina</label>
            <select
              className="filter-input"
              value={filters.discipline}
              onChange={(e) => handleFilterChange("discipline", e.target.value)}
            >
              <option value="">Todas las disciplinas</option>
              {disciplinesData?.disciplines.map((discipline) => (
                <option key={discipline} value={discipline}>
                  {discipline}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="table-container">
          <div style={{ padding: "2rem" }}>
            <div className="skeleton skeleton-row" style={{ marginBottom: "1rem" }}></div>
            <div className="skeleton skeleton-row" style={{ marginBottom: "1rem" }}></div>
            <div className="skeleton skeleton-row" style={{ marginBottom: "1rem" }}></div>
            <div className="skeleton skeleton-row"></div>
          </div>
        </div>
      ) : (
        <div className="table-container">
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
              {data?.documents.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "3rem" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
                    <div style={{ color: "var(--text-tertiary)" }}>No se encontraron documentos</div>
                  </td>
                </tr>
              ) : (
                data?.documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.documentCode}</td>
                    <td>
                      <span className="doc-type-badge">
                        {doc.documentType}
                        {doc.documentSubtype && ` • ${doc.documentSubtype}`}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        background: "rgba(139, 92, 246, 0.2)",
                        color: "var(--accent-secondary)",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.8125rem",
                        fontWeight: 600
                      }}>
                        v{doc.version}
                      </span>
                    </td>
                    <td>{new Date(doc.date).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/documents/${doc.id}`)}
                        className="btn-view"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {data && data.total > pageSize && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </button>
          <div className="pagination-info">
            Página {page} de {Math.ceil(data.total / pageSize)}
          </div>
          <button
            disabled={page >= Math.ceil(data.total / pageSize)}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

