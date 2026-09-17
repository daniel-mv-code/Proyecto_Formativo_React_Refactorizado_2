import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';
import CardAccion from './CardAccion';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { agregarProducto, actualizarStock, Producto } from '../store/slices/productosSlice';
import { agregarNotificacion } from '../store/slices/notificationsSlice';

const Productos: React.FC = () => {
  // Manejo de estado global con Redux Toolkit
  const dispatch = useDispatch<AppDispatch>();
  const productos = useSelector((state: RootState) => state.productos.items);

  // Estados locales para el formulario de entrada y filtrado
  const [nombreProducto, setNombreProducto] = useState<string>('');
  const [precioProducto, setPrecioProducto] = useState<number | ''>('');
  const [stockProducto, setStockProducto] = useState<number>(1);
  const [categoria, setCategoria] = useState<string>('Filtros');
  const [busqueda, setBusqueda] = useState<string>('');
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);

  // Eventos tipados explícitamente (ChangeEvent, FormEvent)
  const handleNombreChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNombreProducto(e.target.value);
  };

  const handlePrecioChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    setPrecioProducto(val === '' ? '' : Number(val));
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setStockProducto(Number(e.target.value));
  };

  const handleCategoriaChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setCategoria(e.target.value);
  };

  const handleBusquedaChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setBusqueda(e.target.value);
  };

  const handleAgregarProducto = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!nombreProducto || precioProducto === '' || precioProducto <= 0) {
      alert('Por favor ingrese un nombre y precio válido.');
      return;
    }

    const nuevo: Producto = {
      id: Date.now(),
      nombre: nombreProducto,
      precio: Number(precioProducto),
      stock: stockProducto,
      categoria,
    };

    // Despacho de acción global a Redux
    dispatch(agregarProducto(nuevo));

    // Notificación en tiempo real conectada a la tabla de productos
    dispatch(
      agregarNotificacion({
        title: 'Pieza Agregada',
        body: `Se añadió "${nuevo.nombre}" al inventario (${nuevo.stock} unds - $${nuevo.precio.toLocaleString('es-CO')}).`,
        tipo: 'exito',
      })
    );

    setNombreProducto('');
    setPrecioProducto('');
    setStockProducto(1);
    setCategoria('Filtros');
    setMostrarFormulario(false);
  };

  const modificarStock = (id: number, delta: number): void => {
    dispatch(actualizarStock({ id, cambio: delta }));

    const prod = productos.find((p) => p.id === id);
    if (prod && prod.stock + delta <= 2) {
      dispatch(
        agregarNotificacion({
          title: 'Alerta de Stock Crítico',
          body: `El repuesto "${prod.nombre}" ha quedado con ${Math.max(0, prod.stock + delta)} unidades.`,
          tipo: 'alerta',
        })
      );
    }
  };

  const handleAccionCard = (nombreAccion: string, detalle: string): void => {
    if (nombreAccion === 'Agregar Pieza') {
      setMostrarFormulario(!mostrarFormulario);
    } else {
      alert(`Módulo: Productos\nAcción: ${nombreAccion}\n${detalle}`);
    }
  };

  // Filtrado dinámico de productos
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const stockCriticoCount = productos.filter((p) => p.stock <= 3).length;

  return (
    <div className="page-layout">
      <Header titulo="Inventario de Piezas y Servicios - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="productos" />
        <main className="page-main">
          <h2>Catálogo de Refacciones y Diagnósticos</h2>
          <p>
            Gestione las piezas utilizadas en las reparaciones, registre costos asociados y 
            actualice el catálogo de servicios ofrecidos por el taller mecánico.
          </p>

          {/* Panel de Resumen e Indicadores en tiempo real */}
          <div className="dashboard-stats-banner">
            <div className="stat-card">
              <span>Total de Productos (BD)</span>
              <strong>{productos.length}</strong>
            </div>
            <div className="stat-card alert-stat">
              <span>Stock Crítico (&le; 3)</span>
              <strong>{stockCriticoCount} repuestos</strong>
            </div>
            <div className="stat-card">
              <span>Filtro activo</span>
              <strong>{busqueda ? `"${busqueda}"` : 'Todos'}</strong>
            </div>
          </div>

          {/* Controles de Búsqueda y Botón de Alternancia de Formulario */}
          <div className="toolbar-productos">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o categoría..."
              value={busqueda}
              onChange={handleBusquedaChange}
              className="input-search"
            />
            <button
              className="btn-toggle-form"
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
            >
              {mostrarFormulario ? '❌ Cancelar Nuevo' : '➕ Añadir Refacción'}
            </button>
          </div>

          {/* Formulario Dinámico para Agregar Producto */}
          {mostrarFormulario && (
            <form onSubmit={handleAgregarProducto} className="form-autometrica form-inline-box">
              <h3>Registrar Nuevo Repuesto</h3>
              <div className="form-grid-3">
                <label>
                  Nombre de la Pieza
                  <input
                    type="text"
                    value={nombreProducto}
                    onChange={handleNombreChange}
                    placeholder="Ej. Disco de Freno"
                    required
                  />
                </label>
                <label>
                  Precio ($ COP)
                  <input
                    type="number"
                    value={precioProducto}
                    onChange={handlePrecioChange}
                    placeholder="Ej. 85000"
                    min="0"
                    required
                  />
                </label>
                <label>
                  Stock Inicial
                  <input
                    type="number"
                    value={stockProducto}
                    onChange={handleStockChange}
                    min="0"
                    required
                  />
                </label>
                <label>
                  Categoría
                  <select value={categoria} onChange={handleCategoriaChange}>
                    <option value="Filtros">Filtros</option>
                    <option value="Frenos">Frenos</option>
                    <option value="Lubricantes">Lubricantes</option>
                    <option value="Eléctrico">Eléctrico</option>
                    <option value="Suspensión">Suspensión</option>
                  </select>
                </label>
              </div>
              <button type="submit" style={{ marginTop: '10px' }}>
                💾 Guardar en Inventario
              </button>
            </form>
          )}

          {/* Tabla de Productos / Refacciones Renderizada Dinámicamente */}
          <h3 style={{ marginTop: '25px' }}>📦 Listado de Piezas ({productosFiltrados.length})</h3>
          <table className="tabla-ventas">
            <thead>
              <tr>
                <th>Código</th>
                <th>Pieza / Descripción</th>
                <th>Categoría</th>
                <th>Precio Unitario</th>
                <th>Stock</th>
                <th>Acciones Stock</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((p) => (
                  <tr key={p.id} className={p.stock <= 3 ? 'low-stock-row' : ''}>
                    <td>
                      <Link to={`/productos/${p.id}`} style={{ color: 'var(--autometrica-primary)', fontWeight: 'bold' }}>
                        #{p.id}
                      </Link>
                    </td>
                    <td><strong>{p.nombre}</strong></td>
                    <td><span className="data-tag">{p.categoria}</span></td>
                    <td>${p.precio.toLocaleString('es-CO')}</td>
                    <td>
                      <span className={p.stock <= 3 ? 'badge-danger' : 'badge-success'}>
                        {p.stock} unidades {p.stock <= 3 && '(¡Bajo!)'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group-stock">
                        <button type="button" onClick={() => modificarStock(p.id, -1)} disabled={p.stock === 0}>
                          -
                        </button>
                        <button type="button" onClick={() => modificarStock(p.id, 1)}>
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="cards-grid">
            <CardAccion
              titulo="Agregar Pieza"
              descripcion="Añada una nueva refacción al catálogo con su respectivo costo y stock."
              textoBoton={mostrarFormulario ? 'Ocultar Formulario' : 'Abrir Formulario'}
              icono="🧰"
              onAccion={handleAccionCard}
            />
            <CardAccion
              titulo="Actualizar Precio"
              descripcion="Modifique el precio de una pieza o servicio existente en el catálogo."
              textoBoton="Actualizar"
              icono="💲"
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

export default Productos;
