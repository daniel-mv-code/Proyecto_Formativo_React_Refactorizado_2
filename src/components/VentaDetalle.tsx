import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sidebar from './layout/Sidebar';

const VentaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page-layout">
      <Header titulo="Detalle de Factura - AutoMétrica" />
      <div className="page-content-wrapper">
        <Sidebar active="ventas" />
        <main className="page-main">
          <h2>Desglose de la Orden</h2>
          <div className="form-inline-box" style={{ marginTop: '20px' }}>
            <h3>🧾 Mostrando detalles de la venta (Factura N°): {id}</h3>
            <p>
              Aquí se mostrarían los servicios realizados, repuestos usados, y el
              desglose de impuestos aplicados a esta venta particular.
            </p>
            <Link to="/ventas" style={{ display: 'inline-block', marginTop: '15px', color: 'var(--autometrica-primary)', textDecoration: 'none', fontWeight: 'bold' }}>
              &larr; Volver a Ventas
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default VentaDetalle;
