import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import './Header.css';

interface HeaderProps {
  titulo: string;
}

const Header: React.FC<HeaderProps> = ({ titulo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleBadge = (rol?: string) => {
    switch (rol) {
      case 'admin':
        return { label: 'ADMIN', bg: '#dc2626' };
      case 'mecanico':
        return { label: 'MECÁNICO', bg: '#0284c7' };
      case 'cliente':
        return { label: 'CLIENTE', bg: '#16a34a' };
      default:
        return { label: 'INVITADO', bg: '#64748b' };
    }
  };

  const roleInfo = getRoleBadge(auth.user?.rol);

  return (
    <header className="header">
      <div className="header-brand">
        <h1 className="header-title">
          🔧 {titulo}
        </h1>
      </div>

      <div className="header-user-area">
        {auth.isAuthenticated && auth.user ? (
          <div style={styles.userContainer}>
            <Link to="/perfil" style={styles.userProfileLink} title="Ver Perfil">
              <div style={styles.avatarMini}>
                {auth.user.nombre_completo.charAt(0).toUpperCase()}
              </div>
              <div style={styles.userInfoCol}>
                <span style={styles.userName}>{auth.user.nombre_completo}</span>
                <span style={{ ...styles.roleTag, backgroundColor: roleInfo.bg }}>
                  {roleInfo.label}
                </span>
              </div>
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn} title="Cerrar Sesión">
              🚪 Salir
            </button>
          </div>
        ) : (
          <Link to="/login" style={styles.loginLink}>
            🔐 Iniciar Sesión
          </Link>
        )}
      </div>
    </header>
  );
};

const styles = {
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userProfileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarMini: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    color: '#002244',
    fontSize: '13px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: '0.82rem',
    fontWeight: 600,
    lineHeight: '1.1',
  },
  roleTag: {
    fontSize: '0.65rem',
    fontWeight: 'bold',
    color: '#ffffff',
    padding: '1px 6px',
    borderRadius: '8px',
    marginTop: '2px',
    letterSpacing: '0.4px',
  },
  logoutBtn: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  loginLink: {
    backgroundColor: '#0056b3',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
};

export default Header;
