import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Search, Inbox, BarChart3, FileText, Zap } from "lucide-react";
import { odfDocumentsApi } from "../api/odfDocuments";
import { useDisciplines } from "../hooks/useOdfDocuments";
import { useDebounce } from "../hooks/useDebounce";
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

  // Debounce de filtros de texto (500ms) para evitar múltiples consultas mientras el usuario escribe
  // No aplicar debounce a discipline (select) ni a page/pageSize
  const debouncedFilters = {
    ...filters,
    competitionCode: useDebounce(filters.competitionCode, 500),
    documentCode: useDebounce(filters.documentCode, 500),
    documentType: useDebounce(filters.documentType, 500),
    documentSubtype: useDebounce(filters.documentSubtype, 500),
    // discipline no necesita debounce porque es un select
  };

  // Validación de inputs
  const isValidDiscipline = (code: string): boolean => {
    if (code === "") return true; // Vacío es válido (sin filtro)
    return /^[A-Z]{3}$/.test(code);
  };

  const isValidInput = (key: string, value: string): boolean => {
    if (key === "discipline") {
      return isValidDiscipline(value);
    }
    // Para otros campos, validar que no sean solo espacios
    return value.trim() === value || value === "";
  };

  // Filtrar solo valores válidos antes de enviar
  const getValidFilters = () => {
    return Object.fromEntries(
      Object.entries(debouncedFilters).filter(([key, value]) => {
        if (value === "") return false;
        return isValidInput(key, value);
      }),
    );
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["documents", page, pageSize, debouncedFilters],
    queryFn: () =>
      odfDocumentsApi.getAll({
        page,
        pageSize,
        ...getValidFilters(),
      }),
    enabled: isValidDiscipline(debouncedFilters.discipline), // Solo ejecutar si la disciplina es válida
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
        <AlertTriangle className="error-icon" size={48} />
        <h3>Error al cargar documentos</h3>
        <p>{getErrorMessage()}</p>
      </div>
    );

  return (
    <div className="document-list">
      <div className="document-list-header">
        <div className="header-content">
          <div className="header-title-section">
            <h2>Documentos ODF</h2>
          </div>
          {data && (
            <div className="document-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Documentos</div>
                  <div className="stat-value">{data.total.toLocaleString()}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FileText size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Página Actual</div>
                  <div className="stat-value">
                    {page} / {Math.ceil(data.total / pageSize)}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Zap size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Por Página</div>
                  <div className="stat-value">{pageSize}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="filters">
        <div className="filters-title">
          <Search size={18} />
          <span>Filtros de búsqueda</span>
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
            {filters.discipline && !isValidDiscipline(filters.discipline) && (
              <span className="filter-error-message">
                La disciplina debe tener exactamente 3 letras mayúsculas
              </span>
            )}
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
                    <Inbox size={48} style={{ marginBottom: "1rem", opacity: 0.5, color: "var(--text-tertiary)" }} />
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

