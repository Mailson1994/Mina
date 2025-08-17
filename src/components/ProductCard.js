import React from 'react';

const ProductCard = ({ product }) => {
  const stockClass = product.stock <= 5 
    ? 'low-stock' 
    : product.stock <= 15 
      ? 'medium-stock' 
      : '';

  return (
    <div className="stats-card">
      <div className="icon">💄</div>
      <div className="info">
        <h3>{product.name}</h3>
        <p>Preço: R$ {product.price.toFixed(2)}</p>
        <p className={stockClass}>
          Estoque: {product.stock} unidades
          {product.stock <= 5 && ' (Baixo)'}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;