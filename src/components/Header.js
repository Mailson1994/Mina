import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header-container">
      <div className="logo">
        <span>💄</span>
        <h1>Mina Make - Controle de Vendas</h1>
      </div>
      
      {user && (
        <div className="user-info">
          <span>Olá, {user.name}</span>
          <button onClick={logout} className="logout-btn">
            Sair
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;