// src/pages/Sales.js
import React, { useState, useContext } from 'react';
import SalesTable from '../components/SalesTable';
import { SalesContext } from '../context/SalesContext';

const Sales = () => {
  const { sales, loading, error, cancelSale } = useContext(SalesContext);
  const [adminPassword, setAdminPassword] = useState('');
  const [saleToCancel, setSaleToCancel] = useState(null);
  const [cancelError, setCancelError] = useState('');

  const handleCancelClick = (saleId) => {
    setSaleToCancel(saleId);
    setCancelError('');
  };

  const confirmCancel = async () => {
    if (!saleToCancel) return;
    
    const result = await cancelSale(saleToCancel, adminPassword);
    
    if (result.success) {
      setSaleToCancel(null);
      setAdminPassword('');
    } else {
      setCancelError(result.message);
    }
  };

  if (loading) return <div className="dashboard-container">Carregando vendas...</div>;
  if (error) return <div className="dashboard-container"><div className="error">{error}</div></div>;

  return (
    <div className="dashboard-container">
      <h2>Vendas</h2>
      
      {saleToCancel && (
        <div className="cancel-dialog">
          <h3>Cancelar Venda #{saleToCancel}</h3>
          <p className="warning">⚠️ Esta ação não pode ser desfeita e será registrada</p>
          
          <div className="form-group">
            <label>Senha do Administrador</label>
            <input 
              type="password" 
              value={adminPassword} 
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Digite a senha de administrador"
            />
          </div>
          
          {cancelError && <div className="error">{cancelError}</div>}
          
          <div className="dialog-actions">
            <button 
              className="cancel-btn"
              onClick={() => setSaleToCancel(null)}
            >
              Voltar
            </button>
            <button 
              className="confirm-btn"
              onClick={confirmCancel}
            >
              Confirmar Cancelamento
            </button>
          </div>
        </div>
      )}

      <SalesTable 
        sales={sales} 
        onCancelClick={handleCancelClick}
      />
    </div>
  );
};

export default Sales;