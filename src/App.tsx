import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Usuarios from './components/Usuarios';
import Productos from './components/Productos';
import Login from './components/Login';
import Registro from './components/Registro';
import Ventas from './components/Ventas';
import UsuarioDetalle from './components/UsuarioDetalle';
import ProductoDetalle from './components/ProductoDetalle';
import VentaDetalle from './components/VentaDetalle';
import NotificationPanel from './components/NotificationPanel';
import GlobalStatsBar from './components/GlobalStatsBar';
import './App.css';

const paginas = [
  { path: '/usuarios', label: 'Ver Usuarios' },
  { path: '/productos', label: 'Ver Productos' },
  { path: '/login', label: 'Ver Login' },
  { path: '/registro', label: 'Ver Registro' },
  { path: '/ventas', label: 'Ver Ventas' },
];

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <nav className="main-nav">
        {paginas.map((p) => (
          <Link
            key={p.path}
            to={p.path}
            className={location.pathname.startsWith(p.path) ? 'active' : ''}
            style={{ textDecoration: 'none' }}
          >
            <button className={location.pathname.startsWith(p.path) ? 'active' : ''}>
              {p.label}
            </button>
          </Link>
        ))}
      </nav>

      {/* Barra de Estado Global reactiva en tiempo real (Persistente en todas las rutas) */}
      <GlobalStatsBar />

      <hr />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/usuarios" />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios/:id" element={<UsuarioDetalle />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/ventas/:id" element={<VentaDetalle />} />
        </Routes>
      </main>
      
      {/* Componente independiente flotante con métricas y notificaciones de BD */}
      <NotificationPanel />
    </div>
  );
};

export default App;
