import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import CardAccion from './CardAccion';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { registrarVenta, Venta } from '../store/slices/ventasSlice';
import { agregarNotificacion } from '../store/slices/notificationsSlice';

const Ventas: React.FC = () => {
  // Manejo de estado global con Redux Toolkit
  const dispatch = useDispatch<AppDispatch>();
  const ventas = useSelector((state: RootState) => state.ventas.items);

  // Estados locales para el formulario de venta y filtrado
  const [cliente, setCliente] = useState<string>('');
  const [servicio, setServicio] = useState<string>('');
  const [monto, setMonto] = useState<number | ''>('');
  const [filtroServicio, setFiltroServicio] = useState<string>('');
  const [mostrarFormVenta, setMostrarFormVenta] = useState<boolean>(false);

  // Eventos tipados explícitamente (ChangeEvent, FormEvent)
  const handleClienteChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCliente(e.target.value);
  };

  const handleServicioChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setServicio(e.target.value);
  };

  const handleMontoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setMonto(val === '' ? '' : Number(val));
  };

  const handleFiltroChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFiltroServicio(e.target.value);
  };

  const handleRegistrarVenta = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!cliente || !servicio || monto === '' || monto <= 0) {
      alert('Por favor ingrese todos los datos de la venta válidamente.');
      return;
    }

    const nuevaVenta: Venta = {
      id: Date.now(),
      cliente,
      servicio,
      monto: Number(monto),
      fecha: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    };

    // Despacho global a Redux
    dispatch(registrarVenta(nuevaVenta));

    // Notificación en tiempo real conectada a la tabla de ventas
    dispatch(
      agregarNotificacion({
        title: 'Venta Facturada',
        body: `Factura a ${nuevaVenta.cliente} por "${nuevaVenta.servicio}" ($${nuevaVenta.monto.toLocaleString('es-CO')}).`,
        tipo: 'exito',
      })
    );

    setCliente('');
    setServicio('');
    setMonto('');
    setMostrarFormVenta(false);
  };

  const handleAccionCard = (nombreAccion: string, detalle: string): void => {
    if (nombreAccion === 'Registrar Venta') {
      setMostrarFormVenta(!mostrarFormVenta);
    } else {
      alert(`Módulo: Ventas\nAcción: ${nombreAccion}\n${detalle}`);
    }
  };

  // Cálculo dinámico de total acumulado desde el estado global
  const total = ventas.reduce((acc, v) => acc + v.monto, 0);

  // Filtrado dinámico de ventas
  const ventasFiltradas = ventas.filter(
    (v) =>
      v.cliente.toLowerCase().includes(filtroServicio.toLowerCase()) ||
      v.servicio.toLowerCase().includes(filtroServicio.toLowerCase())
  );

  return (
    <div className="page-layout">
      <Header titulo="Ventas y Facturación - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="ventas" />
        <main className="page-main">
          <h2>Registro de Ventas del Taller</h2>
          <p>
            Consulte las ventas de servicios y refacciones realizadas, y gestione la
            facturación asociada a cada orden de trabajo.
          </p>

          {/* Panel de Indicadores de Facturación en tiempo real */}
          <div className="dashboard-stats-banner">
            <div className="stat-card accent-card">
              <span>Total Facturado (BD)</span>
              <strong>${total.toLocaleString('es-CO')} COP</strong>
            </div>
            <div className="stat-card">
              <span>Transacciones Registradas</span>
              <strong>{ventas.length} ventas</strong>
            </div>
            <div className="stat-card">
              <span>Ticket Promedio</span>
              <strong>
                ${ventas.length > 0 ? Math.round(total / ventas.length).toLocaleString('es-CO') : 0} COP
              </strong>
            </div>
          </div>

          {/* Toolbar de Filtro y Botón Nuevo Registro */}
          <div className="toolbar-productos">
            <input
              type="text"
              placeholder="🔍 Buscar por cliente o servicio..."
              value={filtroServicio}
              onChange={handleFiltroChange}
              className="input-search"
            />
            <button
              className="btn-toggle-form"
              onClick={() => setMostrarFormVenta(!mostrarFormVenta)}
            >
              {mostrarFormVenta ? '❌ Cancelar' : '🧾 Nueva Venta'}
            </button>
          </div>

          {/* Formulario Dinámico para Registrar Venta */}
          {mostrarFormVenta && (
            <form onSubmit={handleRegistrarVenta} className="form-autometrica form-inline-box">
              <h3>💰 Nueva Orden / Factura de Servicio</h3>
              <div className="form-grid-3">
                <label>
                  Nombre del Cliente
                  <input
                    type="text"
                    value={cliente}
                    onChange={handleClienteChange}
                    placeholder="Ej. Andrés Morales"
                    required
                  />
                </label>
                <label>
                  Servicio / Refacción
                  <input
                    type="text"
                    value={servicio}
                    onChange={handleServicioChange}
                    placeholder="Ej. Cambio de bujías"
                    required
                  />
                </label>
                <label>
                  Monto ($ COP)
                  <input
                    type="number"
                    value={monto}
                    onChange={handleMontoChange}
                    placeholder="Ej. 65000"
                    min="0"
                    required
                  />
                </label>
              </div>
              <button type="submit" style={{ marginTop: '10px' }}>
                💾 Procesar e Ingresar Venta
              </button>
            </form>
          )}

          {/* Tabla de Ventas Renderizada Dinámicamente */}
          <h3 style={{ marginTop: '25px' }}>📋 Listado de Ventas ({ventasFiltradas.length})</h3>
          <table className="tabla-ventas">
            <thead>
              <tr>
                <th>#</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Servicio Realizado</th>
                <th>Monto ($ COP)</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>
                    No hay ventas registradas con el criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <Link to={`/ventas/${v.id}`} style={{ color: 'var(--autometrica-primary)', fontWeight: 'bold' }}>
                        #{v.id}
                      </Link>
                    </td>
                    <td><small>{v.fecha}</small></td>
                    <td><strong>{v.cliente}</strong></td>
                    <td>{v.servicio}</td>
                    <td>
                      <span className="monto-badge">
                        ${v.monto.toLocaleString('es-CO')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="total-banner-footer">
            <span>Total calculado en tiempo real:</span>
            <strong>${total.toLocaleString('es-CO')} COP</strong>
          </div>

          <div className="cards-grid">
            <CardAccion
              titulo="Registrar Venta"
              descripcion="Cree una nueva venta asociada a un servicio o refacción entregada al cliente."
              textoBoton={mostrarFormVenta ? 'Ocultar Formulario' : 'Nueva venta'}
              icono="🧾"
              onAccion={handleAccionCard}
            />
            <CardAccion
              titulo="Generar Reporte"
              descripcion="Genere un reporte mensual de ventas para el área administrativa."
              textoBoton="Generar reporte"
              icono="📈"
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

export default Ventas;
