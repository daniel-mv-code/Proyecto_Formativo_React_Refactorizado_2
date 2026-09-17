import React from 'react';
import './Header.css';

interface HeaderProps {
  titulo: string;
}

const Header: React.FC<HeaderProps> = ({ titulo }) => {
  return (
    <header className="header">
      <h1 className="header-title">
        🔧 {titulo}
      </h1>
    </header>
  );
};

export default Header;
