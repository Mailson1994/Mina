import React, { useState } from 'react';

const AddSaleForm = ({ products, onAddSale }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === parseInt(selectedProduct));
    
    if (product) {
      if (quantity > product.stock) {
        alert('Quantidade indisponível em estoque');
        return;
      }
      
      const newSale = {
        productId: product.id,
        quantity,
        total: product.price * quantity
      };
      
      onAddSale(newSale);
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Produto</label>
        <select 
          value={selectedProduct} 
          onChange={(e) => setSelectedProduct(e.target.value)}
          required
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
          required
        />
      </div>
      
      <button type="submit" className="submit-btn">
        Registrar Venda
      </button>
    </form>
  );
};

export default AddSaleForm;