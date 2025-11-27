import { Link, useLocation } from "react-router-dom";
import { Activity, FileText, BarChart3 } from "lucide-react";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="header">
        <div className="header-brand">
          <h1>
            <Link to="/">ODF Monitor</Link>
          </h1>
        </div>
        <nav className="header-nav">
          <Link 
            to="/" 
            className={location.pathname === "/" ? "nav-link active" : "nav-link"}
          >
            <FileText size={18} />
            <span>Documentos</span>
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}

