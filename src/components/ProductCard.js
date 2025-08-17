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
        <h3>{product.name} (ID: {product.id})</h3>
        {/* ... */}
      </div>
    </div>
  );
};

export default ProductCard;