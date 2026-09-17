import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { isAuthenticated, RolUsuario } from '../services/tokenService';
import AccesoDenegado from './AccesoDenegado';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: RolUsuario[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  // 1. Verificación de Autenticación (JWT existente y válido)
  const isAuth = auth.isAuthenticated && isAuthenticated();

  if (!isAuth) {
    // Redirige al login guardando la ruta previa
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // 2. Verificación de Autorización (Roles y Permisos según BD)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = auth.user?.rol;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <AccesoDenegado allowedRoles={allowedRoles} />;
    }
  }

  return children;
};

export default ProtectedRoute;
