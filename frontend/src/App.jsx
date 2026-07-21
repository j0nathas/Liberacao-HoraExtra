import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Header from './pages/Header.jsx';
import Form from './pages/Form/Form.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import DocumentView from './PDF/DocumentView.jsx'
import SentForms from './pages/SentForms/SentForms.jsx';

const btnMenu = [
  { path: "/home", element: Home },
  { path: "/form", element: Form },
  { path: "/sent", element: SentForms },
  { path: "/document", element: DocumentView },
]

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {btnMenu.map((btn) => (
          <Route
            key={btn.path}
            path={btn.path}
            element={<btn.element />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}