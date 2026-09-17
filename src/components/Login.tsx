import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import { AppDispatch, RootState } from '../store/store';
import { loginSuccess } from '../store/slices/authSlice';
import { agregarNotificacion } from '../store/slices/notificationsSlice';
import { authenticateUser, USUARIOS_BD_DEMO, RolUsuario } from '../services/tokenService';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  const [usuario, setUsuario] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [mostrarContrasena, setMostrarContrasena] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  // Si ya está autenticado, redirigir automáticamente
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      if (auth.user.rol === 'cliente') {
        navigate('/perfil');
      } else {
        navigate('/usuarios');
      }
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  const handleUsuarioChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUsuario(e.target.value);
    setErrorLogin(null);
  };

  const handleContrasenaChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setContrasena(e.target.value);
    setErrorLogin(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!usuario.trim() || !contrasena) {
      setErrorLogin('Por favor complete todos los campos requeridos.');
      return;
    }

    setCargando(true);
    setErrorLogin(null);

    setTimeout(() => {
      const result = authenticateUser(usuario, contrasena);

      if (result.success && result.user && result.token) {
        dispatch(loginSuccess({ user: result.user, token: result.token }));
        dispatch(
          agregarNotificacion({
            title: 'Sesión Iniciada',
            body: `Bienvenido(a) ${result.user.nombre_completo} [Rol: ${result.user.rol.toUpperCase()}].`,
            tipo: 'exito',
          })
        );

        const from = (location.state as { from?: string })?.from;
        if (from) {
          navigate(from);
        } else if (result.user.rol === 'cliente') {
          navigate('/perfil');
        } else {
          navigate('/usuarios');
        }
      } else {
        setErrorLogin(result.error || 'Error al iniciar sesión. Verifique sus datos.');
      }
      setCargando(false);
    }, 400);
  };

  // Cargar credenciales predefinidas de autometrica_db.sql con un solo clic
  const cargarCuentaDemo = (rol: RolUsuario) => {
    const demo = USUARIOS_BD_DEMO.find((u) => u.rol === rol);
    if (demo) {
      setUsuario(demo.correo);
      setContrasena(demo.contrasena);
      setErrorLogin(null);
    }
  };

  return (
    <div className="page-layout">
      <Header titulo="Inicio de Sesión y Autenticación JWT - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="login" />
        <main className="page-main">
          <h2>Acceso al Sistema Productivo</h2>
          <p>
            Ingrese sus credenciales registradas en la base de datos para generar su token
            de autenticación <strong>JWT</strong> y obtener los permisos correspondientes.
          </p>

          <div className="login-container-grid">
            {/* Formulario principal */}
            <form onSubmit={handleSubmit} className="form-autometrica">
              {errorLogin && (
                <div style={styles.errorBox}>
                  ⚠️ {errorLogin}
                </div>
              )}

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={usuario}
                  onChange={handleUsuarioChange}
                  placeholder="ejemplo@autotecnik.com"
                  required
                />
              </label>

              <label>
                Contraseña
                <div className="input-group-password">
                  <input
                    type={mostrarContrasena ? 'text' : 'password'}
                    value={contrasena}
                    onChange={handleContrasenaChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    className="toggle-password-btn"
                  >
                    {mostrarContrasena ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </label>

              <button type="submit" disabled={cargando}>
                {cargando ? 'Validando JWT...' : 'Iniciar Sesión'}
              </button>

              {/* Accesos rápidos con cuentas de autometrica_db.sql */}
              <div style={styles.demoSection}>
                <span style={styles.demoTitle}>💡 Cuentas Demo de la Base de Datos (1-Clic):</span>
                <div style={styles.demoButtons}>
                  <button
                    type="button"
                    onClick={() => cargarCuentaDemo('admin')}
                    style={{ ...styles.demoBtn, backgroundColor: '#dc2626' }}
                    title="admin@autotecnik.com"
                  >
                    👨‍💼 Administrador
                  </button>
                  <button
                    type="button"
                    onClick={() => cargarCuentaDemo('mecanico')}
                    style={{ ...styles.demoBtn, backgroundColor: '#0284c7' }}
                    title="carlos.m@autotecnik.com"
                  >
                    🔧 Mecánico
                  </button>
                  <button
                    type="button"
                    onClick={() => cargarCuentaDemo('cliente')}
                    style={{ ...styles.demoBtn, backgroundColor: '#16a34a' }}
                    title="luis.r@correo.com"
                  >
                    🚗 Cliente
                  </button>
                </div>
              </div>
            </form>

            {/* Panel informativo de Seguridad y JWT */}
            <div className="data-display-panel">
              <h4>🛡️ Arquitectura de Seguridad (Actividad 3)</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                Al autenticarse exitosamente, el sistema genera un token <strong>JWT (JSON Web Token)</strong> firmado digitalmente con sus credenciales y rol de usuario.
              </p>
              <div className="live-preview-box" style={{ marginTop: '10px' }}>
                <p><strong>Estructura del Token:</strong></p>
                <code style={{ fontSize: '0.78rem', color: '#0056b3', display: 'block' }}>
                  Header.Payload.Signature
                </code>
                <p style={{ marginTop: '8px' }}><strong>Almacenamiento:</strong> <code>localStorage</code></p>
                <p><strong>Rutas Protegidas:</strong> Validación de permisos por rol (`admin`, `mecanico`, `cliente`).</p>
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
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '0.88rem',
    fontWeight: 500,
  },
  demoSection: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  demoTitle: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#64748b',
    marginBottom: '8px',
  },
  demoButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  demoBtn: {
    border: 'none',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    flex: 1,
    minWidth: '90px',
  },
};

export default Login;
