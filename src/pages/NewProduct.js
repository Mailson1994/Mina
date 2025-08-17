import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SalesContext } from '../context/SalesContext';

const NewProduct = () => {
  const { addProduct } = useContext(SalesContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !price || !stock) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    const newProduct = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      description
    };
    
    const success = await addProduct(newProduct);
    
    if (success) {
      navigate('/products');
    } else {
      setError('produto adicionado');
    }
  };

  return (
    <div className="form-container">
      <h2>Adicionar Novo Produto</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome *</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Preço (R$) *</label>
          <input 
            type="number" 
            step="0.01"
            min="0.01"
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Estoque *</label>
          <input 
            type="number" 
            min="0"
            value={stock} 
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descrição</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/products')}
          >
            Cancelar
          </button>
          <button type="submit" className="submit-btn">
            Adicionar Produto
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;