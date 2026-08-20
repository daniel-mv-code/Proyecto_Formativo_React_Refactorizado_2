import React from 'react';

interface SidebarItem {
  key: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  active: string;
}

const items: SidebarItem[] = [
  { key: 'usuarios', label: 'Usuarios y Clientes', icon: '👥' },
  { key: 'productos', label: 'Piezas y Servicios', icon: '⚙️' },
  { key: 'login', label: 'Inicio de Sesión', icon: '🔐' },
  { key: 'registro', label: 'Registro de Usuario', icon: '📝' },
  { key: 'ventas', label: 'Ventas y Facturación', icon: '💰' },
];

const Sidebar: React.FC<SidebarProps> = ({ active }) => {
  const itemStyle = (isActive: boolean) => ({
    padding: '12px 15px',
    marginBottom: '8px',
    background: isActive ? 'var(--autometrica-primary)' : 'transparent',
    color: isActive ? 'white' : 'var(--autometrica-dark)',
    borderRadius: '4px',
    fontWeight: isActive ? 'bold' : 'normal',
    cursor: 'pointer'
  });

  return (
    <aside style={{ width: '220px', background: '#e0e0e0', padding: '20px' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item.key} style={itemStyle(active === item.key)}>
            {item.icon} {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
