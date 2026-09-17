import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { RolUsuario } from '../services/tokenService';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';

interface AccesoDenegadoProps {
  allowedRoles?: RolUsuario[];
}

const AccesoDenegado: React.FC<AccesoDenegadoProps> = ({ allowedRoles = [] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleBadgeStyle = (rol?: RolUsuario) => {
    switch (rol) {
      case 'admin':
        return { backgroundColor: '#dc2626', color: '#ffffff' };
      case 'mecanico':
        return { backgroundColor: '#0284c7', color: '#ffffff' };
      case 'cliente':
        return { backgroundColor: '#16a34a', color: '#ffffff' };
      default:
        return { backgroundColor: '#64748b', color: '#ffffff' };
    }
  };

  return (
    <div className="page-layout">
      <Header titulo="Seguridad y Control de Acceso - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="" />
        <main className="page-main">
          <div style={styles.card}>
            <div style={styles.iconCircle}>🔒</div>
            <h2 style={{ color: '#991b1b', margin: '15px 0 10px' }}>
              Acceso Denegado (Error 403)
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '580px', lineHeight: '1.5' }}>
              Lo sentimos, su cuenta no posee los privilegios requeridos para acceder a este módulo.
              El acceso se encuentra restringido por la directiva de seguridad del sistema.
            </p>

            <div style={styles.infoBox}>
              <div style={styles.row}>
                <span style={styles.label}>Usuario autenticado:</span>
                <strong>{user?.nombre_completo || 'Usuario'}</strong>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Correo:</span>
                <span>{user?.correo}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Su rol actual:</span>
                <span
                  style={{
                    ...styles.badge,
                    ...getRoleBadgeStyle(user?.rol),
                  }}
                >
                  {user?.rol?.toUpperCase() || 'DESCONOCIDO'}
                </span>
              </div>
              {allowedRoles.length > 0 && (
                <div style={styles.row}>
                  <span style={styles.label}>Roles autorizados para este módulo:</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {allowedRoles.map((r) => (
                      <span key={r} style={{ ...styles.badge, ...getRoleBadgeStyle(r) }}>
                        {r.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.actionsGroup}>
              <Link to="/perfil" style={styles.primaryBtn}>
                👤 Ir a Mi Perfil
              </Link>
              {user?.rol === 'mecanico' && (
                <Link to="/productos" style={styles.secondaryBtn}>
                  ⚙️ Ir a Inventario
                </Link>
              )}
              {user?.rol === 'admin' && (
                <Link to="/usuarios" style={styles.secondaryBtn}>
                  👥 Ir a Usuarios
                </Link>
              )}
              <button onClick={handleLogout} style={styles.outlineBtn}>
                🚪 Iniciar con Otra Cuenta
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    padding: '40px 20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #fee2e2',
    boxShadow: '0 4px 16px rgba(220, 38, 38, 0.08)',
    marginTop: '20px',
  },
  iconCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '34px',
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '18px 24px',
    margin: '25px 0',
    width: '100%',
    maxWidth: '520px',
    textAlign: 'left' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
  },
  label: {
    color: '#64748b',
    fontWeight: 500,
  },
  badge: {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  actionsGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#002244',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  secondaryBtn: {
    backgroundColor: '#0056b3',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #dc2626',
    color: '#dc2626',
    padding: '10px 18px',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
};

export default AccesoDenegado;
