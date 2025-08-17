import React, { useContext } from "react";
import { SalesContext } from "../context/SalesContext";
import AddSaleForm from "../components/AddSaleForm";
import { useNavigate } from "react-router-dom";

const NewSale = () => {
  // Contexto e navegação
  const { products, addSale } = useContext(SalesContext);
  const navigate = useNavigate();

  // Handler para adicionar venda
  const handleAddSale = async (saleData) => {
    const success = await addSale(saleData);
    if (success) {
      navigate("/sales");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Nova Venda</h2>
      <AddSaleForm 
        products={products} 
        addSale={handleAddSale}
      />
    </div>
  );
};

export default NewSale;