import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import CardAccion from './CardAccion';

interface UsuarioRegistrado {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  fechaRegistro: string;
}

const Registro: React.FC = () => {
  // Manejo de estado local con useState y tipado estricto explícito en TypeScript
  const [nombre, setNombre] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [rol, setRol] = useState<string>('cliente');
  const [aceptaTerminos, setAceptaTerminos] = useState<boolean>(false);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState<UsuarioRegistrado[]>([]);

  // Manejo de eventos con tipado explícito (ChangeEvent, FormEvent)
  const handleNombreChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNombre(e.target.value);
  };

  const handleCorreoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCorreo(e.target.value);
  };

  const handleContrasenaChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setContrasena(e.target.value);
  };

  const handleRolChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setRol(e.target.value);
  };

  const handleTerminosChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAceptaTerminos(e.target.checked);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!aceptaTerminos) {
      alert('Debe aceptar los términos de uso para registrarse.');
      return;
    }

    const nuevoUsuario: UsuarioRegistrado = {
      id: Date.now(),
      nombre,
      correo,
      rol,
      fechaRegistro: new Date().toLocaleTimeString('es-CO'),
    };

    // Actualizar lista de usuarios registrados en el estado local
    setUsuariosRegistrados((prev) => [nuevoUsuario, ...prev]);

    // Limpiar entradas de texto
    setNombre('');
    setCorreo('');
    setContrasena('');
    setRol('cliente');
    setAceptaTerminos(false);
  };

  const handleAccionCard = (nombreAccion: string, detalle: string): void => {
    alert(`Módulo: Registro\nAcción: ${nombreAccion}\n${detalle}`);
    console.log(`[Registro] ${nombreAccion} -> ${detalle}`);
  };

  return (
    <div className="page-layout">
      <Header titulo="Registro de Usuario - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="registro" />
        <main className="page-main">
          <h2>Crear Nueva Cuenta</h2>
          <p>Registre un nuevo cliente o mecánico para que pueda acceder a la plataforma.</p>

          <div className="registro-grid">
            {/* Formulario de registro */}
            <form onSubmit={handleSubmit} className="form-autometrica">
              <label>
                Nombre completo
                <input
                  type="text"
                  value={nombre}
                  onChange={handleNombreChange}
                  placeholder="Nombre y apellido"
                  required
                />
              </label>
              <label>
                Correo electrónico
                <input
                  type="email"
                  value={correo}
                  onChange={handleCorreoChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </label>
              <label>
                Contraseña
                <input
                  type="password"
                  value={contrasena}
                  onChange={handleContrasenaChange}
                  placeholder="••••••••"
                  required
                />
              </label>
              <label>
                Rol asignado
                <select value={rol} onChange={handleRolChange}>
                  <option value="cliente">Cliente</option>
                  <option value="mecanico">Mecánico</option>
                  <option value="administrador">Administrador</option>
                </select>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={handleTerminosChange}
                />
                Acepto los términos del servicio y políticas
              </label>

              <button type="submit">Registrarse</button>
            </form>

            {/* Visualización de Datos en tiempo real */}
            <div className="data-display-panel">
              <h4>📋 Resumen de Entrada en Tiempo Real</h4>
              <div className="live-preview-box">
                <p><strong>Nombre:</strong> {nombre || <em>(Por ingresar)</em>}</p>
                <p><strong>Correo:</strong> {correo || <em>(Por ingresar)</em>}</p>
                <p><strong>Rol seleccionado:</strong> <span className="data-tag">{rol}</span></p>
                <p><strong>Términos aceptados:</strong> {aceptaTerminos ? 'Sí ✅' : 'No ❌'}</p>
              </div>

              {/* Muestra de usuarios recién registrados */}
              <h4 style={{ marginTop: '20px' }}>👥 Usuarios Creados Recientemente ({usuariosRegistrados.length})</h4>
              {usuariosRegistrados.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#777' }}>Aún no ha enviado ningún registro.</p>
              ) : (
                <ul className="registered-users-list">
                  {usuariosRegistrados.map((u) => (
                    <li key={u.id}>
                      <strong>{u.nombre}</strong> ({u.correo}) - <span className="data-tag">{u.rol}</span>
                      <small style={{ display: 'block', color: '#666' }}>Hora: {u.fechaRegistro}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="cards-grid">
            <CardAccion
              titulo="Validar Correo"
              descripcion="Envíe un correo de verificación para confirmar la identidad del nuevo usuario."
              textoBoton="Enviar verificación"
              icono="📧"
              onAccion={handleAccionCard}
            />
            <CardAccion
              titulo="Importar Contactos"
              descripcion="Importe una lista de clientes existente desde un archivo externo."
              textoBoton="Importar"
              icono="📥"
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

export default Registro;
