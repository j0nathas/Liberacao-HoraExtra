
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './pages/Header.jsx';
import Form from './pages/Form/Form.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import DocumentView from './PDF/DocumentView.jsx';
import SentForms from './pages/SentForms/SentForms.jsx';
import Charts from './pages/Charts/Charts.jsx';
import RH from './pages/RH/RH.jsx';
import ListLobby from './pages/ListLobby/ListLobby.jsx';

import ProtectedRoute from './routes/ProtectedRoute.jsx';

const btnMenu = [
  { path: '/home', element: Home },
  { path: '/form', element: Form },
  { path: '/sent', element: SentForms },
  { path: '/charts', element: Charts },
  { path: '/listLobby', element: ListLobby },
  { path: '/document', element: DocumentView },
  { path: '/refeicoes', element: RH, permissao: 'ENVIAR_EMAIL_RESTAURANTE' },
];

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />
        {btnMenu.map((btn) => {
          const Pagina = btn.element;

          return (
            <Route
              key={btn.path}
              path={btn.path}
              element={
                btn.permissao ? (
                  <ProtectedRoute permissao={btn.permissao}>
                    <Pagina />
                  </ProtectedRoute>
                ) : (
                  <Pagina />
                )
              }
            />
          );
        })}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
