import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useState } from 'react'
import Header from './pages/Header.jsx';
import Form from './pages/Form/Form.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import DocumentPDF from './PDF/DocumentPDF.jsx'

const btnMenu = [
  { path: "/home", element: Home },
  { path: "/form", element: Form },
  { path: "/document", element: <PDFViewer width="100%" height="800"><DocumentPDF /></PDFViewer> },
  /* { name: Chart, path: "/Chart", icon: "", element: Chart } */
]

// ... imports
export default function App() {
  const navigate = useNavigate();

  return (
    <>

      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {btnMenu.map((btn) => (
          <Route
            key={btn.path}
            path={btn.path}
            element={btn.path === "/document" ? btn.element : <btn.element />}
          />
        ))}
      </Routes>
    </>
  )
}