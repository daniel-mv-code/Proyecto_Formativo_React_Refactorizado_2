import React, { useState, ChangeEvent, FormEvent } from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import CardAccion from './CardAccion';

export interface UsuarioItem {
  id: number;
  nombre: string;
  correo: string;
  rol: 'Mecánico' | 'Cliente' | 'Administrador';
  vehiculo?: string;
  estado: 'Activo' | 'Inactivo';
}

const usuariosIniciales: UsuarioItem[] = [
  { id: 1, nombre: 'Carlos Rodríguez', correo: 'carlos.mecanico@autometrica.com', rol: 'Mecánico', estado: 'Activo' },
  { id: 2, nombre: 'Ana María López', correo: 'ana.lopez@gmail.com', rol: 'Cliente', vehiculo: 'Mazda 3 (2020)', estado: 'Activo' },
  { id: 3, nombre: 'Jorge Martínez', correo: 'jorge.mecanico@autometrica.com', rol: 'Mecánico', estado: 'Activo' },
  { id: 4, nombre: 'Laura Fernández', correo: 'laura.f@hotmail.com', rol: 'Cliente', vehiculo: 'Toyota Hilux (2018)', estado: 'Inactivo' },
];

const Usuarios: React.FC = () => {
  // Manejo de estado local con useState y tipado estricto explícito en TypeScript
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>(usuariosIniciales);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroRol, setFiltroRol] = useState<string>('todos');
  const [contadorMecanicos, setContadorMecanicos] = useState<number>(12);
  const [clientesNotificados, setClientesNotificados] = useState<number>(45);

  // Formulario nuevo cliente
  const [mostrarForm, setMostrarForm] = useState<boolean>(false);
  const [nombreNuevo, setNombreNuevo] = useState<string>('');
  const [correoNuevo, setCorreoNuevo] = useState<string>('');
  const [rolNuevo, setRolNuevo] = useState<'Mecánico' | 'Cliente'>('Cliente');
  const [vehiculoNuevo, setVehiculoNuevo] = useState<string>('');

  // Eventos tipados explícitamente (ChangeEvent, FormEvent)
  const handleBusquedaChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setBusqueda(e.target.value);
  };

  const handleFiltroRolChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFiltroRol(e.target.value);
  };

  const handleAgregarUsuario = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!nombreNuevo || !correoNuevo) return;

    const nuevo: UsuarioItem = {
      id: Date.now(),
      nombre: nombreNuevo,
      correo: correoNuevo,
      rol: rolNuevo,
      vehiculo: rolNuevo === 'Cliente' ? vehiculoNuevo : undefined,
      estado: 'Activo',
    };

    setUsuarios((prev) => [nuevo, ...prev]);
    if (rolNuevo === 'Mecánico') {
      setContadorMecanicos((prev) => prev + 1);
    }
    setNombreNuevo('');
    setCorreoNuevo('');
    setVehiculoNuevo('');
    setMostrarForm(false);
  };

  const toggleEstadoUsuario = (id: number): void => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' } : u
      )
    );
  };

  const handleAccionCard = (nombreAccion: string, detalle: string): void => {
    if (nombreAccion === 'Nuevo Cliente') {
      setMostrarForm(!mostrarForm);
    } else if (nombreAccion === 'Asignar Mecánico') {
      setClientesNotificados((prev) => prev + 1);
      alert('Se asignó un mecánico y se notificado al cliente.');
    } else {
      alert(`Módulo: Usuarios\nAcción: ${nombreAccion}\n${detalle}`);
    }
  };

  // Filtrado de usuarios por búsqueda y rol
  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideTexto =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideRol =
      filtroRol === 'todos' || u.rol.toLowerCase() === filtroRol.toLowerCase();
    return coincideTexto && coincideRol;
  });

  return (
    <div className="page-layout">
      <Header titulo="Módulo de Clientes y Mecánicos - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="usuarios" />
        <main className="page-main">
          <h2>Gestión de Personal y Clientes</h2>
          <p>
            Administre los perfiles de los mecánicos asignados al taller y registre los datos 
            de los clientes para enviarles el estado de reparación de sus vehículos en tiempo real.
          </p>

          {/* Panel interactivo de Estadísticas y Contadores */}
          <div className="dashboard-stats-banner">
            <div className="stat-card">
              <span>Mecánicos Activos</span>
              <div className="counter-controls">
                <strong>{contadorMecanicos}</strong>
                <button type="button" onClick={() => setContadorMecanicos(Math.max(0, contadorMecanicos - 1))}>-</button>
                <button type="button" onClick={() => setContadorMecanicos(contadorMecanicos + 1)}>+</button>
              </div>
            </div>
            <div className="stat-card">
              <span>Clientes Notificados Hoy</span>
              <strong>{clientesNotificados}</strong>
            </div>
            <div className="stat-card">
              <span>Total Registrados</span>
              <strong>{usuarios.length} usuarios</strong>
            </div>
          </div>

          {/* Filtros de búsqueda */}
          <div className="toolbar-productos">
            <input
              type="text"
              placeholder="🔍 Buscar usuario por nombre o correo..."
              value={busqueda}
              onChange={handleBusquedaChange}
              className="input-search"
            />
            <select value={filtroRol} onChange={handleFiltroRolChange} className="select-filter">
              <option value="todos">Todos los Roles</option>
              <option value="mecanico">Mecánicos</option>
              <option value="cliente">Clientes</option>
            </select>
            <button
              className="btn-toggle-form"
              onClick={() => setMostrarForm(!mostrarForm)}
            >
              {mostrarForm ? '❌ Cancelar' : '➕ Registrar Usuario'}
            </button>
          </div>

          {/* Formulario Dinámico para nuevo usuario */}
          {mostrarForm && (
            <form onSubmit={handleAgregarUsuario} className="form-autometrica form-inline-box">
              <h3>👤 Registrar Usuario en el Sistema</h3>
              <div className="form-grid-3">
                <label>
                  Nombre Completo
                  <input
                    type="text"
                    value={nombreNuevo}
                    onChange={(e) => setNombreNuevo(e.target.value)}
                    placeholder="Ej. Pedro Gómez"
                    required
                  />
                </label>
                <label>
                  Correo Electrónico
                  <input
                    type="email"
                    value={correoNuevo}
                    onChange={(e) => setCorreoNuevo(e.target.value)}
                    placeholder="pedro@ejemplo.com"
                    required
                  />
                </label>
                <label>
                  Rol
                  <select
                    value={rolNuevo}
                    onChange={(e) => setRolNuevo(e.target.value as 'Mecánico' | 'Cliente')}
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Mecánico">Mecánico</option>
                  </select>
                </label>
                {rolNuevo === 'Cliente' && (
                  <label>
                    Vehículo (Marca / Modelo)
                    <input
                      type="text"
                      value={vehiculoNuevo}
                      onChange={(e) => setVehiculoNuevo(e.target.value)}
                      placeholder="Ej. Chevrolet Spark 2019"
                    />
                  </label>
                )}
              </div>
              <button type="submit" style={{ marginTop: '10px' }}>
                💾 Guardar Usuario
              </button>
            </form>
          )}

          {/* Tabla de Usuarios Renderizada Dinámicamente */}
          <h3 style={{ marginTop: '25px' }}>👥 Tabla de Usuarios ({usuariosFiltrados.length})</h3>
          <table className="tabla-ventas">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Vehículo</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.nombre}</strong></td>
                    <td>{u.correo}</td>
                    <td><span className="data-tag">{u.rol}</span></td>
                    <td>{u.vehiculo || '-'}</td>
                    <td>
                      <span className={u.estado === 'Activo' ? 'badge-success' : 'badge-danger'}>
                        {u.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-status-toggle"
                        onClick={() => toggleEstadoUsuario(u.id)}
                      >
                        {u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="cards-grid">
            <CardAccion
              titulo="Nuevo Cliente"
              descripcion="Registre un nuevo cliente en el sistema junto con los datos de su vehículo."
              textoBoton={mostrarForm ? 'Ocultar Formulario' : 'Registrar cliente'}
              icono="🧑‍🔧"
              onAccion={handleAccionCard}
            />
            <CardAccion
              titulo="Asignar Mecánico"
              descripcion="Asigne un mecánico disponible a una orden de reparación pendiente."
              textoBoton="Asignar"
              icono="🔧"
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

export default Usuarios;
