// src/pages/Products.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { SalesContext } from '../context/SalesContext';

const Products = () => {
  const { products, loading, error } = useContext(SalesContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();

  if (loading) return <div className="dashboard-container">Carregando produtos...</div>;
  if (error) return <div className="dashboard-container"><div className="error">{error}</div></div>;

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return 0;
    });

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h2>Produtos</h2>
        <button 
          className="add-product-btn"
          onClick={() => navigate('/new-product')}
        >
          + Adicionar Produto
        </button>
      </div>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="name">Ordenar por Nome</option>
          <option value="price">Ordenar por Preço</option>
          <option value="stock">Ordenar por Estoque</option>
        </select>
      </div>
      
      <div className="dashboard-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;