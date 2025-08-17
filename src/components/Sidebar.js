import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <NavLink to="/" className="nav-item" end>
        📊 Dashboard
      </NavLink>
      <NavLink to="/products" className="nav-item">
        💄 Produtos
      </NavLink>
      <NavLink to="/sales" className="nav-item">
        🧾 Vendas
      </NavLink>
      <NavLink to="/new-sale" className="nav-item">
        ➕ Nova Venda
      </NavLink>
      <NavLink to="/reports" className="nav-item">
        📈 Relatórios
      </NavLink>
      <NavLink to="/new-product" className="nav-item">
        🆕 Novo Produto
      </NavLink>
      <NavLink to="/canceled-sales" className="nav-item">
        🚫 Cancelamentos
      </NavLink>
    </div>
  );
};

export default Sidebar;