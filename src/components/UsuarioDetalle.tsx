import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';

const UsuarioDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page-layout">
      <Header titulo="Detalle de Usuario/Cliente - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="usuarios" />
        <main className="page-main">
          <h2>Información del Perfil</h2>
          <div className="form-inline-box" style={{ marginTop: '20px' }}>
            <h3>👤 Mostrando detalles del usuario con ID: {id}</h3>
            <p>
              Aquí se mostraría la información detallada obtenida de la base de datos 
              o del estado global para el usuario correspondiente a este ID.
            </p>
            <Link to="/usuarios" style={{ display: 'inline-block', marginTop: '15px', color: 'var(--autometrica-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
              &larr; Volver al Listado
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UsuarioDetalle;
