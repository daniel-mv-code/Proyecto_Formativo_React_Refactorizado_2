import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { RolUsuario } from '../../services/tokenService';
import './Sidebar.css';

interface SidebarItem {
  key: string;
  path: string;
  label: string;
  icon: string;
  allowedRoles?: RolUsuario[];
}

interface SidebarProps {
  active: string;
}

const allItems: SidebarItem[] = [
  { key: 'usuarios', path: '/usuarios', label: 'Personal y Clientes', icon: '👥', allowedRoles: ['admin', 'mecanico'] },
  { key: 'productos', path: '/productos', label: 'Piezas y Servicios', icon: '⚙️', allowedRoles: ['admin', 'mecanico'] },
  { key: 'ventas', path: '/ventas', label: 'Ventas y Facturación', icon: '💰', allowedRoles: ['admin'] },
  { key: 'perfil', path: '/perfil', label: 'Mi Cuenta y Rol', icon: '👤', allowedRoles: ['admin', 'mecanico', 'cliente'] },
  { key: 'login', path: '/login', label: 'Inicio de Sesión', icon: '🔐' },
  { key: 'registro', path: '/registro', label: 'Registro de Usuario', icon: '📝' },
];

const Sidebar: React.FC<SidebarProps> = ({ active }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const userRole = auth.user?.rol;

  const itemStyle = (isActive: boolean, isRestricted: boolean) => ({
    background: isActive ? 'var(--autometrica-primary, #0056b3)' : 'transparent',
    color: isActive ? '#ffffff' : isRestricted ? '#94a3b8' : 'var(--autometrica-dark, #002244)',
    fontWeight: isActive ? 'bold' : 'normal',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  });

  return (
    <aside className="sidebar">
      {auth.isAuthenticated && auth.user && (
        <div style={styles.roleBanner}>
          <span style={styles.roleBannerLabel}>Sesión Activa:</span>
          <strong style={styles.roleBannerVal}>
            {auth.user.rol.toUpperCase()}
          </strong>
        </div>
      )}

      <ul className="sidebar-list">
        {allItems.map((item) => {
          // Ocultar login/registro si ya está autenticado
          if (auth.isAuthenticated && (item.key === 'login' || item.key === 'registro')) {
            return null;
          }

          const isRestricted =
            item.allowedRoles &&
            (!auth.isAuthenticated || (userRole && !item.allowedRoles.includes(userRole)));

          return (
            <li key={item.key} className="sidebar-item">
              <Link
                to={item.path}
                className="sidebar-link"
                style={itemStyle(active === item.key, !!isRestricted)}
                title={isRestricted ? `Requiere rol: ${item.allowedRoles?.join(', ')}` : item.label}
              >
                <span>
                  {item.icon} {item.label}
                </span>
                {isRestricted && <span style={styles.lockBadge}>🔒</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

const styles = {
  roleBanner: {
    padding: '8px 12px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    marginBottom: '15px',
    fontSize: '0.78rem',
  },
  roleBannerLabel: {
    display: 'block',
    color: '#64748b',
    fontSize: '0.7rem',
  },
  roleBannerVal: {
    color: '#002244',
    letterSpacing: '0.5px',
  },
  lockBadge: {
    fontSize: '0.75rem',
    opacity: 0.7,
  },
};

export default Sidebar;
