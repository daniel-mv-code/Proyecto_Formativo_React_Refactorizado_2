import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { getToken } from '../services/tokenService';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';

const Perfil: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = getToken();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleBadge = (rol?: string) => {
    switch (rol) {
      case 'admin':
        return { text: 'ADMINISTRADOR GENERAL', bg: '#dc2626', desc: 'Acceso total a usuarios, repuestos, ventas y reportes.' };
      case 'mecanico':
        return { text: 'MECÁNICO ESPECIALISTA', bg: '#0284c7', desc: 'Permiso para gestión de piezas, inventario y vehículos asignados.' };
      case 'cliente':
        return { text: 'CLIENTE REGISTRADO', bg: '#16a34a', desc: 'Portal de cliente para seguimiento de mantenimientos y citas.' };
      default:
        return { text: 'USUARIO', bg: '#64748b', desc: 'Acceso básico al sistema.' };
    }
  };

  const badgeInfo = getRoleBadge(user?.rol);

  return (
    <div className="page-layout">
      <Header titulo="Perfil de Usuario y Credenciales - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="perfil" />
        <main className="page-main">
          <h2>Mi Cuenta y Permisos</h2>
          <p>
            Información del usuario autenticado actualmente en la plataforma, vinculada
            directamente con la tabla <code>usuarios</code> de la base de datos.
          </p>

          <div style={styles.grid}>
            {/* Tarjeta de información personal */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>
                  {user?.nombre_completo ? user.nombre_completo.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px', color: '#002244' }}>{user?.nombre_completo}</h3>
                  <span style={{ ...styles.badge, backgroundColor: badgeInfo.bg }}>
                    {badgeInfo.text}
                  </span>
                </div>
              </div>

              <div style={styles.detailsList}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>ID en Base de Datos:</span>
                  <strong>#{user?.id}</strong>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Correo Electrónico:</span>
                  <span>{user?.correo}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Teléfono de Contacto:</span>
                  <span>{user?.telefono || '+57 300 123 4567'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Taller Asignado:</span>
                  <span>{user?.taller_id ? `AutoTecnik S.A. (ID #${user.taller_id})` : 'Cliente Externo'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Estado de Cuenta:</span>
                  <span style={{ color: '#16a34a', fontWeight: 'bold' }}>● Activo y Verificado</span>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  🚪 Cerrar Sesión de Forma Segura
                </button>
              </div>
            </div>

            {/* Tarjeta de seguridad y token JWT */}
            <div style={styles.card}>
              <h3 style={{ margin: '0 0 12px', color: '#002244', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔐 Sesión JWT (JSON Web Token)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.4' }}>
                Token criptográfico firmado con estándar <strong>RFC 7519</strong> y algoritmo <strong>HS256</strong>.
                Almacenado localmente para validar peticiones y autorización en cada ruta privada.
              </p>

              <div style={styles.tokenBox}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>TOKEN JWT ACTIVO:</span>
                <code style={styles.codeSnippet}>
                  {token ? `${token.substring(0, 70)}...` : 'Sin token'}
                </code>
              </div>

              <div style={styles.permissionBox}>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#002244' }}>
                  Alcance de Permisos Autorizados:
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155' }}>
                  {badgeInfo.desc}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #dcdfe6',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px',
    marginBottom: '16px',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#002244',
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.72rem',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '0.5px',
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '8px',
  },
  detailLabel: {
    color: '#64748b',
    fontWeight: 500,
  },
  logoutBtn: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s',
  },
  tokenBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    padding: '12px',
    margin: '15px 0',
  },
  codeSnippet: {
    display: 'block',
    marginTop: '6px',
    wordBreak: 'break-all' as const,
    fontFamily: 'Consolas, monospace',
    fontSize: '0.78rem',
    color: '#0369a1',
  },
  permissionBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    padding: '12px',
    marginTop: '10px',
  },
};

export default Perfil;
