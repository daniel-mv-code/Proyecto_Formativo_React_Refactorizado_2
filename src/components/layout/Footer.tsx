import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: '#eee', color: '#666', textAlign: 'center', padding: '15px', borderTop: '1px solid #ddd' }}>
      <small>
        <strong>AutoMétrica</strong> &copy; {new Date().getFullYear()} - Plataforma de Gestión de Talleres Mecánicos.
      </small>
    </footer>
  );
};

export default Footer;
