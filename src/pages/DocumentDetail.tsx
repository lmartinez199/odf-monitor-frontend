import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { odfDocumentsApi } from "../api/odfDocuments";
import ContentViewer from "../components/ContentViewer";
import "./DocumentDetail.css";

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: document, isLoading: docLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () => odfDocumentsApi.getById(id!),
    enabled: !!id,
  });

  const { data: parsedContent, isLoading: parsedLoading } = useQuery({
    queryKey: ["document-parsed", id],
    queryFn: () => odfDocumentsApi.getParsedContent(id!),
    enabled: !!id,
  });

  if (docLoading) return <div className="loading">Cargando documento...</div>;
  if (!document)
    return <div className="error">Documento no encontrado</div>;

  const isXml = document.content.trim().startsWith("<?xml") ||
    document.content.trim().startsWith("<OdfBody");

  return (
    <div className="document-detail">
      <button onClick={() => navigate("/")} className="btn-back">
        ← Volver
      </button>

      <div className="document-header">
        <h2>Documento: {document.documentCode}</h2>
        <div className="document-info">
          <div>
            <strong>Tipo:</strong> {document.documentType}
            {document.documentSubtype && ` (${document.documentSubtype})`}
          </div>
          <div>
            <strong>Versión:</strong> {document.version}
          </div>
          <div>
            <strong>Fecha:</strong> {new Date(document.date).toLocaleString()}
          </div>
          <div>
            <strong>Competencia:</strong> {document.competitionCode}
          </div>
          {document.resultStatus && (
            <div>
              <strong>Estado:</strong> {document.resultStatus}
            </div>
          )}
        </div>
      </div>

      <div className="document-content">
        <h3>Contenido {isXml ? "XML" : "JSON"}</h3>
        <div className="content-tabs">
          <div className="tab active">Raw</div>
          <div className="tab">Parsed</div>
        </div>
        <ContentViewer
          content={document.content}
          parsedContent={parsedContent}
          isLoading={parsedLoading}
          isXml={isXml}
        />
      </div>
    </div>
  );
}

