// src/components/ProductSelection.js
import React, { useState } from 'react';

const ProductSelection = ({ products, onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (product) {
      onAddToCart(product, quantity);
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  return (
    <div className="product-selection">
      <h3>Adicionar Produtos</h3>
      <div className="form-group">
        <label>Produto</label>
        <select 
          value={selectedProduct} 
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Selecione um produto</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - R$ {product.price.toFixed(2)} (Estoque: {product.stock})
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Quantidade</label>
        <input 
          type="number" 
          min="1" 
          value={quantity} 
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </div>
      
      <button 
        onClick={handleAddToCart}
        className="add-to-cart-btn"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default ProductSelection;