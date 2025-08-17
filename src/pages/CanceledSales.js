// src/pages/CanceledSales.js
import React, { useContext, useEffect, useState } from 'react';
import { SalesContext } from '../context/SalesContext';

const CanceledSales = () => {
  const [canceledSales, setCanceledSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCanceledSales = () => {
      try {
        const savedData = localStorage.getItem('canceledSales');
        if (savedData) {
          setCanceledSales(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Erro ao carregar cancelamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCanceledSales();
  }, []);

  if (loading) return <div className="dashboard-container">Carregando...</div>;

  return (
    <div className="dashboard-container">
      <h2>Histórico de Cancelamentos</h2>
      
      {canceledSales.length === 0 ? (
        <p>Nenhum cancelamento registrado</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID Venda</th>
              <th>Data Cancelamento</th>
              <th>Cancelado por</th>
              <th>Motivo</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {canceledSales.map((sale, index) => (
              <tr key={index} className="canceled">
                <td>{sale.id}</td>
                <td>{new Date(sale.canceledAt).toLocaleString()}</td>
                <td>{sale.canceledBy}</td>
                <td>{sale.reason || 'Sem motivo registrado'}</td>
                <td>R$ {sale.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CanceledSales;