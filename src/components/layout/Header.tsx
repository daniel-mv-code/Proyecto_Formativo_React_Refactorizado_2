import React from 'react';

interface HeaderProps {
  titulo: string;
}

const Header: React.FC<HeaderProps> = ({ titulo }) => {
  return (
    <header style={{ background: 'var(--autometrica-dark)', color: 'white', padding: '15px 25px', borderBottom: '4px solid var(--autometrica-primary)' }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        🔧 {titulo}
      </h1>
    </header>
  );
};

export default Header;
