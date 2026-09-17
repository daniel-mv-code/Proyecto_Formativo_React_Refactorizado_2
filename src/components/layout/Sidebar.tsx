import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

interface SidebarItem {
  key: string;
  path: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  active: string;
}

const items: SidebarItem[] = [
  { key: 'usuarios', path: '/usuarios', label: 'Usuarios y Clientes', icon: '👥' },
  { key: 'productos', path: '/productos', label: 'Piezas y Servicios', icon: '⚙️' },
  { key: 'login', path: '/login', label: 'Inicio de Sesión', icon: '🔐' },
  { key: 'registro', path: '/registro', label: 'Registro de Usuario', icon: '📝' },
  { key: 'ventas', path: '/ventas', label: 'Ventas y Facturación', icon: '💰' },
];

const Sidebar: React.FC<SidebarProps> = ({ active }) => {
  const itemStyle = (isActive: boolean) => ({
    background: isActive ? 'var(--autometrica-primary)' : 'transparent',
    color: isActive ? 'white' : 'var(--autometrica-dark)',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <aside className="sidebar">
      <ul className="sidebar-list">
        {items.map((item) => (
          <li key={item.key} className="sidebar-item">
            <Link
              to={item.path}
              className="sidebar-link"
              style={itemStyle(active === item.key)}
            >
              {item.icon} {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
