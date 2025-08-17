import React, { useContext } from 'react';
import { SalesContext } from '../context/SalesContext';
import AddSaleForm from '../components/AddSaleForm';
import { useNavigate } from 'react-router-dom';

const NewSale = () => {
  const { products, addSale } = useContext(SalesContext);
  const navigate = useNavigate();

  const handleAddSale = async (newSale) => {
    const success = await addSale(newSale);
    if (success) {
      navigate('/sales');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Nova Venda</h2>
      <AddSaleForm 
        products={products} 
        onAddSale={handleAddSale} 
      />
    </div>
  );
};

export default NewSale;