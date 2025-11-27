import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./ContentViewer.css";

interface ContentViewerProps {
  content: string;
  parsedContent?: unknown;
  isLoading: boolean;
  isXml: boolean;
}

/**
 * Formatea XML de manera robusta y legible con indentación correcta
 */
function formatXML(xml: string): string {
  try {
    // Si ya está bien formateado, devolverlo
    if (xml.includes("\n") && xml.match(/^\s*</m)) {
      return xml;
    }

    let formatted = "";
    let indent = 0;
    const indentSize = 2;
    
    // Normalizar espacios
    xml = xml.replace(/>\s+</g, "><").trim();
    
    // Procesar caracter por caracter
    let i = 0;
    while (i < xml.length) {
      if (xml[i] === "<") {
        // Encontrar el tag completo
        let tagEnd = xml.indexOf(">", i);
        if (tagEnd === -1) break;
        
        const tag = xml.substring(i, tagEnd + 1);
        const isClosing = tag.startsWith("</");
        const isSelfClosing = tag.endsWith("/>") || tag.match(/\/>$/);
        const isInstruction = tag.startsWith("<?") || tag.startsWith("<!");
        
        // Ajustar indentación para tags de cierre
        if (isClosing) {
          indent = Math.max(0, indent - 1);
        }
        
        // Agregar indentación y tag
        formatted += " ".repeat(indent * indentSize) + tag + "\n";
        
        // Incrementar indentación para tags de apertura (no auto-cerrados)
        if (!isClosing && !isSelfClosing && !isInstruction) {
          indent++;
        }
        
        i = tagEnd + 1;
      } else {
        // Texto entre tags
        let textEnd = xml.indexOf("<", i);
        if (textEnd === -1) textEnd = xml.length;
        
        const text = xml.substring(i, textEnd).trim();
        if (text) {
          formatted += " ".repeat(indent * indentSize) + text + "\n";
        }
        
        i = textEnd;
      }
    }
    
    return formatted.trim();
  } catch (error) {
    console.error("Error formatting XML:", error);
    // Si falla, intentar un formato básico
    return xml.replace(/><</g, ">\n<");
  }
}

export default function ContentViewer({
  content,
  parsedContent,
  isLoading,
  isXml,
}: ContentViewerProps) {
  const [viewMode, setViewMode] = useState<"raw" | "parsed">("raw");

  const getFormattedContent = () => {
    if (viewMode === "raw") {
      if (isXml) {
        return formatXML(content);
      } else {
        try {
          return JSON.stringify(JSON.parse(content), null, 2);
        } catch {
          return content;
        }
      }
    } else {
      if (parsedContent) {
        return JSON.stringify(parsedContent, null, 2);
      }
      return "";
    }
  };

  return (
    <div className="content-viewer">
      <div className="viewer-header">
        <div className="viewer-title-section">
          <h3 className="viewer-title">
            {isXml ? (
              <>
                <span className="icon">📄</span>
                <span>Contenido XML</span>
              </>
            ) : (
              <>
                <span className="icon">📄</span>
                <span>Contenido JSON</span>
              </>
            )}
          </h3>
          <div className="viewer-meta">
            {viewMode === "raw" && isXml && (
              <span className="meta-badge">XML</span>
            )}
            {viewMode === "parsed" && (
              <span className="meta-badge">Parsed</span>
            )}
          </div>
        </div>
        <div className="viewer-tabs">
          <button
            className={`tab-button ${viewMode === "raw" ? "active" : ""}`}
            onClick={() => setViewMode("raw")}
          >
            Raw
          </button>
          <button
            className={`tab-button ${viewMode === "parsed" ? "active" : ""}`}
            onClick={() => setViewMode("parsed")}
            disabled={!parsedContent && !isLoading}
          >
            Parsed {isLoading && <span className="loading-dot">⏳</span>}
          </button>
        </div>
      </div>

      <div className="viewer-content">
        {viewMode === "parsed" && isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Cargando contenido parseado...</span>
          </div>
        ) : viewMode === "parsed" && !parsedContent ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <span>No hay contenido parseado disponible</span>
          </div>
        ) : (
          <div className="code-container">
            <SyntaxHighlighter
              language={isXml ? "xml" : "json"}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1rem",
                background: "#1e1e1e",
                fontSize: "0.875rem",
                lineHeight: "1.6",
                borderRadius: 0,
              }}
              showLineNumbers
              lineNumberStyle={{
                minWidth: "3.5em",
                paddingRight: "1em",
                color: "#858585",
                userSelect: "none",
              }}
              lineProps={() => ({
                style: {
                  display: "block",
                  transition: "background 0.1s",
                },
              })}
              wrapLines
              wrapLongLines
            >
              {getFormattedContent()}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
}
