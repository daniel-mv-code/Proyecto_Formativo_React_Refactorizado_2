import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import CardAccion from './CardAccion';

interface DatosLoginConfirmados {
  usuario: string;
  fecha: string;
}

const Login: React.FC = () => {
  // Manejo de estado local con useState y tipado estricto explícito en TypeScript
  const [usuario, setUsuario] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [mostrarContrasena, setMostrarContrasena] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const [datosEnviados, setDatosEnviados] = useState<DatosLoginConfirmados | null>(null);

  // Manejo de eventos con tipado explícito (ChangeEvent, FormEvent)
  const handleUsuarioChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUsuario(e.target.value);
  };

  const handleContrasenaChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setContrasena(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setCargando(true);

    // Simulación de envío con feedback visual de carga
    setTimeout(() => {
      setCargando(false);
      const datos: DatosLoginConfirmados = {
        usuario,
        fecha: new Date().toLocaleTimeString('es-CO'),
      };
      setDatosEnviados(datos);
      console.log('[Login] Formulario enviado:', datos);
    }, 800);
  };

  const handleAccionCard = (nombreAccion: string, detalle: string): void => {
    alert(`Módulo: Login\nAcción: ${nombreAccion}\n${detalle}`);
    console.log(`[Login] ${nombreAccion} -> ${detalle}`);
  };

  return (
    <div className="page-layout">
      <Header titulo="Inicio de Sesión - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="login" />
        <main className="page-main">
          <h2>Acceso al Sistema</h2>
          <p>Ingrese sus credenciales para acceder al panel de administración del taller.</p>

          <div className="login-container-grid">
            {/* Formulario principal de inicio de sesión */}
            <form onSubmit={handleSubmit} className="form-autometrica">
              <label>
                Usuario
                <input
                  type="text"
                  value={usuario}
                  onChange={handleUsuarioChange}
                  placeholder="usuario@autometrica.com"
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
                    className="toggle-password-btn"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  >
                    {mostrarContrasena ? '🙈 Ocultar' : '👁️ Ver'}
                  </button>
                </div>
              </label>

              <button type="submit" disabled={cargando}>
                {cargando ? '⌛ Verificando credenciales...' : 'Iniciar sesión'}
              </button>
            </form>

            {/* Visualización de Datos en tiempo real e información ingresada/enviada */}
            <div className="data-display-panel">
              <h4>📋 Visualización de Datos en Tiempo Real</h4>
              <div className="live-preview-box">
                <p>
                  <strong>Usuario ingresado:</strong>{' '}
                  <span className="data-tag">{usuario || '(Esperando entrada...)'}</span>
                </p>
                <p>
                  <strong>Longitud clave:</strong>{' '}
                  <span className="data-tag">{contrasena.length} caracteres</span>
                </p>
                <p>
                  <strong>Visibilidad:</strong>{' '}
                  <span className="data-tag">{mostrarContrasena ? 'Visible' : 'Oculta'}</span>
                </p>
              </div>

              {datosEnviados && (
                <div className="success-data-card">
                  ✅ <strong>Sesión Iniciada Exitosamente</strong>
                  <p>Usuario: <em>{datosEnviados.usuario}</em></p>
                  <p>Hora de acceso: <em>{datosEnviados.fecha}</em></p>
                </div>
              )}
            </div>
          </div>

          <div className="cards-grid">
            <CardAccion
              titulo="Recuperar contraseña"
              descripcion="Envíe un enlace de recuperación al correo registrado del usuario."
              textoBoton="Enviar enlace"
              icono="🔑"
              onAccion={handleAccionCard}
            />
            <CardAccion
              titulo="Acceso rápido"
              descripcion="Ingrese con una cuenta de demostración para realizar pruebas del sistema."
              textoBoton="Usar cuenta demo"
              icono="🚀"
              color="var(--autometrica-dark)"
              onAccion={handleAccionCard}
            />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
