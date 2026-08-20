import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchNotifications } from '../store/slices/notificationsSlice';

const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNotifications());
    }
  }, [status, dispatch]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={styles.container}>
      <div style={styles.iconContainer} onClick={togglePanel}>
        🔔
        {items.length > 0 && <span style={styles.badge}>{items.length}</span>}
      </div>

      {isOpen && (
        <div style={styles.panel}>
          <div style={styles.header}>
            <h3 style={{ margin: 0 }}>Notificaciones</h3>
            <button onClick={togglePanel} style={styles.closeButton}>X</button>
          </div>
          
          <div style={styles.content}>
            {status === 'loading' && <p>Cargando notificaciones...</p>}
            {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
            {status === 'succeeded' && items.length === 0 && <p>No hay notificaciones</p>}
            
            {status === 'succeeded' && items.map((notif) => (
              <div key={notif.id} style={styles.notificationItem}>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{notif.title.substring(0, 30)}...</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>
                  {notif.body.substring(0, 50)}...
                </p>
              </div>
            ))}
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
    zIndex: 1000,
    fontFamily: 'sans-serif',
  },
  iconContainer: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'var(--autometrica-primary, #007bff)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    position: 'relative' as const,
  },
  badge: {
    position: 'absolute' as const,
    top: '-5px',
    right: '-5px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  panel: {
    position: 'absolute' as const,
    bottom: '60px',
    right: '0',
    width: '300px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: 'var(--autometrica-dark, #343a40)',
    color: 'white',
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  content: {
    padding: '10px',
    maxHeight: '300px',
    overflowY: 'auto' as const,
  },
  notificationItem: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    textAlign: 'left' as const,
  }
};

export default NotificationPanel;
