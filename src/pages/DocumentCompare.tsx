import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { odfDocumentsApi } from "../api/odfDocuments";
import "./DocumentCompare.css";

export default function DocumentCompare() {
  const { id1, id2 } = useParams<{ id1: string; id2: string }>();
  const navigate = useNavigate();

  const { data: comparison, isLoading } = useQuery({
    queryKey: ["compare", id1, id2],
    queryFn: () => odfDocumentsApi.compare(id1!, id2!),
    enabled: !!id1 && !!id2,
  });

  if (isLoading) return <div className="loading">Comparando documentos...</div>;
  if (!comparison)
    return <div className="error">Error al comparar documentos</div>;

  const formatXml = (xml: string): string => {
    let formatted = "";
    let indent = 0;
    const tab = "  ";

    xml
      .replace(/>\s+</g, "><")
      .split("><")
      .forEach((part, index, array) => {
        if (index === 0) {
          formatted += part + ">\n";
        } else if (index === array.length - 1) {
          formatted += tab.repeat(indent) + "<" + part;
        } else {
          if (part.startsWith("/")) {
            indent--;
            formatted += tab.repeat(indent) + "<" + part + ">\n";
          } else {
            formatted += tab.repeat(indent) + "<" + part + ">\n";
            if (!part.endsWith("/")) {
              indent++;
            }
          }
        }
      });

    return formatted;
  };

  return (
    <div className="document-compare">
      <button onClick={() => navigate("/")} className="btn-back">
        ← Volver
      </button>

      <h2>Comparación de Documentos XML</h2>
      <div className="compare-info">
        <div>Documento 1: {comparison.document1.id}</div>
        <div>Documento 2: {comparison.document2.id}</div>
      </div>

      <div className="compare-content">
        <div className="compare-document">
          <h3>Documento 1</h3>
          <pre className="code-block">
            <code>{formatXml(comparison.document1.xmlContent)}</code>
          </pre>
        </div>
        <div className="compare-document">
          <h3>Documento 2</h3>
          <pre className="code-block">
            <code>{formatXml(comparison.document2.xmlContent)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

