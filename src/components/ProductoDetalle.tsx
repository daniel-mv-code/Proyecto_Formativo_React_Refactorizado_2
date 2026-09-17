import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';

const ProductoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page-layout">
      <Header titulo="Detalle del Repuesto - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="productos" />
        <main className="page-main">
          <h2>Información del Producto</h2>
          <div className="form-inline-box" style={{ marginTop: '20px' }}>
            <h3>🧰 Mostrando detalles de la pieza con ID: {id}</h3>
            <p>
              Aquí se mostraría el precio, stock histórico, y otra información
              relevante asociada al producto o repuesto.
            </p>
            <Link to="/productos" style={{ display: 'inline-block', marginTop: '15px', color: 'var(--autometrica-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
              &larr; Volver al Inventario
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProductoDetalle;
