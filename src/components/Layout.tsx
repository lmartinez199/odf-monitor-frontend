import { Link } from "react-router-dom";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="header">
        <h1>
          <Link to="/">ODF Monitor</Link>
        </h1>
        <nav>
          <Link to="/">Documentos</Link>
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}

