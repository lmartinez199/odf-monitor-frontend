import { useState } from "react";
import "./ContentViewer.css";

interface ContentViewerProps {
  content: string;
  parsedContent?: unknown;
  isLoading: boolean;
  isXml: boolean;
}

export default function ContentViewer({
  content,
  parsedContent,
  isLoading,
  isXml,
}: ContentViewerProps) {
  const [viewMode, setViewMode] = useState<"raw" | "parsed">("raw");

  const formatContent = (content: string): string => {
    if (isXml) {
      // Formatear XML básico
      let formatted = "";
      let indent = 0;
      const tab = "  ";

      content
        .replace(/>\s+</g, "><")
        .split("><")
        .forEach((part, index) => {
          if (index === 0) {
            formatted += part + ">\n";
          } else if (index === content.split("><").length - 1) {
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
    } else {
      // Formatear JSON
      try {
        return JSON.stringify(JSON.parse(content), null, 2);
      } catch {
        return content;
      }
    }
  };

  return (
    <div className="content-viewer">
      <div className="viewer-tabs">
        <button
          className={viewMode === "raw" ? "active" : ""}
          onClick={() => setViewMode("raw")}
        >
          Raw
        </button>
        <button
          className={viewMode === "parsed" ? "active" : ""}
          onClick={() => setViewMode("parsed")}
          disabled={!parsedContent && !isLoading}
        >
          Parsed {isLoading && "(cargando...)"}
        </button>
      </div>

      <div className="viewer-content">
        {viewMode === "raw" ? (
          <pre className="code-block">
            <code>{formatContent(content)}</code>
          </pre>
        ) : (
          <pre className="code-block">
            <code>
              {isLoading
                ? "Cargando contenido parseado..."
                : JSON.stringify(parsedContent, null, 2)}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}

