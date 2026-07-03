import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Login from './Login'
import App from './App'
import ProtectedRoute from './services/validate'
import './styles/global.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/home" element={
          <ProtectedRoute> <App /> </ProtectedRoute>
        } />
        <Route path="/form" element={
          <ProtectedRoute> <App /> </ProtectedRoute>
        } />
        <Route path="/document" element={
          <ProtectedRoute> <App /> </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)