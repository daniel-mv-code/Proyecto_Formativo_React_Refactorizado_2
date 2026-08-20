import React, { useState } from 'react';
import Usuarios from './components/Usuarios';
import Productos from './components/Productos';
import Login from './components/Login';
import Registro from './components/Registro';
import Ventas from './components/Ventas';
import NotificationPanel from './components/NotificationPanel';
import './App.css';

export type Pagina = 'usuarios' | 'productos' | 'login' | 'registro' | 'ventas';

const paginas: { key: Pagina; label: string }[] = [
  { key: 'usuarios', label: 'Ver Usuarios' },
  { key: 'productos', label: 'Ver Productos' },
  { key: 'login', label: 'Ver Login' },
  { key: 'registro', label: 'Ver Registro' },
  { key: 'ventas', label: 'Ver Ventas' },
];

const App: React.FC = () => {
  // Manejo de estado local con useState y tipado estricto
  const [pagina, setPagina] = useState<Pagina>('usuarios');

  const cambiarPagina = (nuevaPagina: Pagina): void => {
    setPagina(nuevaPagina);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <nav className="main-nav">
        {paginas.map((p) => (
          <button
            key={p.key}
            className={pagina === p.key ? 'active' : ''}
            onClick={() => cambiarPagina(p.key)}
          >
            {p.label}
          </button>
        ))}
      </nav>

      <hr />

      {/* Lógica para mostrar un componente u otro */}
      <main>
        {pagina === 'usuarios' && <Usuarios />}
        {pagina === 'productos' && <Productos />}
        {pagina === 'login' && <Login />}
        {pagina === 'registro' && <Registro />}
        {pagina === 'ventas' && <Ventas />}
      </main>
      
      <NotificationPanel />
    </div>
  );
};

export default App;
