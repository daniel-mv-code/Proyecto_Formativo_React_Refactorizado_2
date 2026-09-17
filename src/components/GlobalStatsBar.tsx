import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const GlobalStatsBar: React.FC = () => {
  const usuarios = useSelector((state: RootState) => state.usuarios.items);
  const productos = useSelector((state: RootState) => state.productos.items);
  const ventas = useSelector((state: RootState) => state.ventas.items);

  const totalUsuarios = usuarios.length;
  const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);
  const stockCritico = productos.filter((p) => p.stock < 3).length;
  const totalFacturado = ventas.reduce((acc, v) => acc + v.monto, 0);

  return (
    <div style={styles.bar}>
      <div style={styles.badge}>
        <span style={styles.icon}>👥</span>
        <span style={styles.label}>Usuarios BD:</span>
        <strong style={styles.val}>{totalUsuarios}</strong>
      </div>
      <div style={styles.divider} />
      <div style={styles.badge}>
        <span style={styles.icon}>⚙️</span>
        <span style={styles.label}>Repuestos en Stock:</span>
        <strong style={styles.val}>{totalStock} unds</strong>
        {stockCritico > 0 && (
          <span style={styles.alertTag}>{stockCritico} bajo stock</span>
        )}
      </div>
      <div style={styles.divider} />
      <div style={styles.badge}>
        <span style={styles.icon}>💰</span>
        <span style={styles.label}>Facturado en Vivo:</span>
        <strong style={{ ...styles.val, color: '#16a34a' }}>
          ${totalFacturado.toLocaleString('es-CO')}
        </strong>
      </div>
      <div style={styles.divider} />
      <div style={styles.liveIndicator}>
        <span style={styles.dot} />
        <span style={styles.liveText}>Redux Global State</span>
      </div>
    </div>
  );
};

const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #dcdfe6',
    borderRadius: '8px',
    padding: '8px 16px',
    marginBottom: '15px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    fontSize: '0.85rem',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  icon: {
    fontSize: '1rem',
  },
  label: {
    color: '#64748b',
    fontWeight: 500,
  },
  val: {
    color: '#002244',
    fontWeight: 700,
  },
  alertTag: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '4px',
    marginLeft: '4px',
  },
  divider: {
    width: '1px',
    height: '18px',
    backgroundColor: '#e2e8f0',
  },
  liveIndicator: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 6px #22c55e',
  },
  liveText: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#475569',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
};

export default GlobalStatsBar;
