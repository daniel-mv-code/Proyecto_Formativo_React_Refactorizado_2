import React, { useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { restoreSession } from './store/slices/authSlice';

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
import ProtectedRoute from './components/ProtectedRoute';
import Perfil from './components/Perfil';
import './App.css';

const App: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  // Restaurar sesión al cargar la aplicación
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Rutas disponibles en el menú superior
  const paginas = [
    { path: '/usuarios', label: 'Usuarios', rolRequerido: ['admin', 'mecanico'] },
    { path: '/productos', label: 'Productos', rolRequerido: ['admin', 'mecanico'] },
    { path: '/ventas', label: 'Ventas', rolRequerido: ['admin'] },
    { path: '/perfil', label: 'Mi Perfil', rolRequerido: ['admin', 'mecanico', 'cliente'] },
    ...(!auth.isAuthenticated
      ? [
          { path: '/login', label: 'Login' },
          { path: '/registro', label: 'Registro' },
        ]
      : []),
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <nav className="main-nav">
        {paginas.map((p) => {
          const isActive = location.pathname.startsWith(p.path);
          return (
            <Link
              key={p.path}
              to={p.path}
              className={isActive ? 'active' : ''}
              style={{ textDecoration: 'none' }}
            >
              <button className={isActive ? 'active' : ''}>
                {p.label}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Barra de Estado Global reactiva en tiempo real */}
      <GlobalStatsBar />

      <hr />

      <main>
        <Routes>
          {/* Redirección raíz inteligente según estado de autenticación */}
          <Route
            path="/"
            element={
              auth.isAuthenticated ? (
                auth.user?.rol === 'cliente' ? (
                  <Navigate to="/perfil" replace />
                ) : (
                  <Navigate to="/usuarios" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas Protegidas por JWT y Control de Roles */}
          {/* 1. Módulo Usuarios: Admin y Mecánico */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute allowedRoles={['admin', 'mecanico']}>
                <Usuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'mecanico']}>
                <UsuarioDetalle />
              </ProtectedRoute>
            }
          />

          {/* 2. Módulo Productos: Admin y Mecánico */}
          <Route
            path="/productos"
            element={
              <ProtectedRoute allowedRoles={['admin', 'mecanico']}>
                <Productos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'mecanico']}>
                <ProductoDetalle />
              </ProtectedRoute>
            }
          />

          {/* 3. Módulo Ventas: Exclusivo Admin */}
          <Route
            path="/ventas"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Ventas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ventas/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <VentaDetalle />
              </ProtectedRoute>
            }
          />

          {/* 4. Módulo Perfil: Todos los usuarios autenticados */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute allowedRoles={['admin', 'mecanico', 'cliente']}>
                <Perfil />
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Componente flotante de métricas en vivo */}
      <NotificationPanel />
    </div>
  );
};

export default App;
