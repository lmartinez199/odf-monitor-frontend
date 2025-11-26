import { BrowserRouter, Routes, Route } from "react-router-dom";
import DocumentList from "./pages/DocumentList";
import DocumentDetail from "./pages/DocumentDetail";
import DocumentCompare from "./pages/DocumentCompare";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DocumentList />} />
          <Route path="/documents/:id" element={<DocumentDetail />} />
          <Route path="/compare/:id1/:id2" element={<DocumentCompare />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

