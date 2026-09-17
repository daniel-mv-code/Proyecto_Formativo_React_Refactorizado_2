import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { eliminarNotificacion, limpiarNotificaciones } from '../store/slices/notificationsSlice';

const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notificaciones' | 'metricas'>('metricas');
  const dispatch = useDispatch<AppDispatch>();

  // Consumo directo del Estado Global vinculado a las tablas de la BD
  const usuarios = useSelector((state: RootState) => state.usuarios.items);
  const productos = useSelector((state: RootState) => state.productos.items);
  const ventas = useSelector((state: RootState) => state.ventas.items);
  const notificaciones = useSelector((state: RootState) => state.notifications.items);

  // Cálculos reactivos en tiempo real a partir del estado global
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.estado === 'Activo').length;
  const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);
  const stockCritico = productos.filter((p) => p.stock < 3).length;
  const totalFacturado = ventas.reduce((acc, v) => acc + v.monto, 0);
  const totalVentas = ventas.length;

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={styles.container}>
      {/* Botón flotante siempre visible en cualquier ruta */}
      <button
        style={styles.floatingButton}
        onClick={togglePanel}
        title="Panel Global de Métricas y Notificaciones"
        aria-label="Abrir panel de estado global"
      >
        <span style={{ fontSize: '20px' }}>⚡</span>
        <span style={styles.buttonLabel}>BD en Vivo</span>
        {notificaciones.length > 0 && <span style={styles.badge}>{notificaciones.length}</span>}
      </button>

      {/* Panel Desplegable con Métricas de BD y Notificaciones */}
      {isOpen && (
        <div style={styles.panel}>
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📊</span>
              <h3 style={{ margin: 0, fontSize: '15px' }}>Estado Global del Sistema</h3>
            </div>
            <button onClick={togglePanel} style={styles.closeButton}>
              ✕
            </button>
          </div>

          {/* Selector de pestañas */}
          <div style={styles.tabContainer}>
            <button
              style={activeTab === 'metricas' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('metricas')}
            >
              Métricas BD ({totalUsuarios + productos.length + totalVentas})
            </button>
            <button
              style={activeTab === 'notificaciones' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('notificaciones')}
            >
              Notificaciones ({notificaciones.length})
            </button>
          </div>

          <div style={styles.content}>
            {activeTab === 'metricas' ? (
              <div style={styles.metricsGrid}>
                {/* Tabla Usuarios */}
                <div style={styles.metricCard}>
                  <div style={styles.metricIcon}>👥</div>
                  <div style={styles.metricInfo}>
                    <span style={styles.metricTitle}>Tabla Usuarios</span>
                    <strong style={styles.metricValue}>{totalUsuarios}</strong>
                    <span style={styles.metricSubtext}>
                      {usuariosActivos} activos / {totalUsuarios - usuariosActivos} inactivos
                    </span>
                  </div>
                </div>

                {/* Tabla Productos / Repuestos */}
                <div style={styles.metricCard}>
                  <div style={styles.metricIcon}>⚙️</div>
                  <div style={styles.metricInfo}>
                    <span style={styles.metricTitle}>Tabla Inventario</span>
                    <strong style={styles.metricValue}>{productos.length} ítems</strong>
                    <span style={styles.metricSubtext}>
                      Stock total: {totalStock} unds.
                    </span>
                    {stockCritico > 0 && (
                      <span style={styles.criticalBadge}>
                        ⚠️ {stockCritico} con stock crítico (&lt; 3)
                      </span>
                    )}
                  </div>
                </div>

                {/* Tabla Ventas */}
                <div style={styles.metricCard}>
                  <div style={styles.metricIcon}>💰</div>
                  <div style={styles.metricInfo}>
                    <span style={styles.metricTitle}>Tabla Ventas</span>
                    <strong style={{ ...styles.metricValue, color: '#28a745' }}>
                      ${totalFacturado.toLocaleString('es-CO')}
                    </strong>
                    <span style={styles.metricSubtext}>
                      {totalVentas} transacciones registradas
                    </span>
                  </div>
                </div>

                <div style={styles.footerNote}>
                  <small>
                    ℹ️ Datos sincronizados en tiempo real mediante <strong>Redux Toolkit</strong> entre todas las vistas.
                  </small>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>Eventos recientes:</span>
                  {notificaciones.length > 0 && (
                    <button
                      onClick={() => dispatch(limpiarNotificaciones())}
                      style={styles.clearBtn}
                    >
                      Limpiar todas
                    </button>
                  )}
                </div>

                {notificaciones.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', margin: '20px 0' }}>
                    No hay notificaciones pendientes
                  </p>
                ) : (
                  notificaciones.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        ...styles.notificationItem,
                        borderLeftColor:
                          notif.tipo === 'alerta'
                            ? '#dc3545'
                            : notif.tipo === 'exito'
                            ? '#28a745'
                            : '#0056b3',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <h4 style={styles.notificationTitle}>{notif.title}</h4>
                        <button
                          onClick={() => dispatch(eliminarNotificacion(notif.id))}
                          style={styles.deleteNotifBtn}
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                      <p style={styles.notificationBody}>{notif.body}</p>
                      {notif.timestamp && (
                        <span style={styles.notificationTime}>{notif.timestamp}</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed' as const,
    bottom: '20px',
    right: '20px',
    zIndex: 9999,
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  floatingButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#002244',
    color: '#ffffff',
    border: '2px solid #0056b3',
    borderRadius: '30px',
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
  },
  buttonLabel: {
    letterSpacing: '0.3px',
  },
  badge: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    borderRadius: '10px',
    padding: '2px 7px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  panel: {
    position: 'absolute' as const,
    bottom: '55px',
    right: '0',
    width: '340px',
    backgroundColor: '#ffffff',
    border: '1px solid #dcdfe6',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#002244',
    color: '#ffffff',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
    opacity: 0.8,
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    background: 'transparent',
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
  },
  tabActive: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderBottom: '2px solid #0056b3',
    backgroundColor: '#ffffff',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#0056b3',
    cursor: 'pointer',
  },
  content: {
    padding: '14px',
    maxHeight: '380px',
    overflowY: 'auto' as const,
  },
  metricsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  metricCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  metricIcon: {
    fontSize: '24px',
    backgroundColor: '#ffffff',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  metricInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
  },
  metricTitle: {
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    color: '#64748b',
    fontWeight: 600,
  },
  metricValue: {
    fontSize: '16px',
    color: '#002244',
    margin: '2px 0',
  },
  metricSubtext: {
    fontSize: '11px',
    color: '#475569',
  },
  criticalBadge: {
    fontSize: '10px',
    color: '#dc3545',
    fontWeight: 600,
    marginTop: '3px',
  },
  footerNote: {
    marginTop: '6px',
    padding: '8px',
    backgroundColor: '#eef6ff',
    borderRadius: '6px',
    border: '1px solid #bfdbfe',
    color: '#1e40af',
    fontSize: '11px',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#dc3545',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  notificationItem: {
    padding: '10px 12px',
    marginBottom: '8px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid' as const,
    borderRadius: '6px',
  },
  notificationTitle: {
    margin: '0 0 4px 0',
    fontSize: '13px',
    color: '#002244',
  },
  notificationBody: {
    margin: '0 0 6px 0',
    fontSize: '12px',
    color: '#475569',
    lineHeight: '1.4',
  },
  notificationTime: {
    fontSize: '10px',
    color: '#94a3b8',
  },
  deleteNotifBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '11px',
    padding: '0 2px',
  },
};

export default NotificationPanel;
