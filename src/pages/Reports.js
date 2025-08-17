import React, { useContext, useState } from 'react';
import { SalesContext } from '../context/SalesContext';
import StatsCard from '../components/StatsCard';

const Reports = () => {
  const { sales, products } = useContext(SalesContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredSales = sales.filter(sale => {
    if (!startDate && !endDate) return true;
    
    const saleDate = new Date(sale.date);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    
    return saleDate >= start && saleDate <= end;
  });

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSalesCount = filteredSales.length;

  const popularProducts = [...products]
    .map(product => {
      const productSales = filteredSales.filter(sale => sale.productId === product.id);
      const totalQuantity = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
      return {
        ...product,
        totalQuantity,
        totalRevenue: totalQuantity * product.price
      };
    })
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      <h2>Relatórios</h2>
      
      <div className="filters">
        <div>
          <label>De:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </div>
        <div>
          <label>Até:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </div>
      </div>
      
      <div className="report-summary">
        <StatsCard 
          title="Vendas no período" 
          value={totalSalesCount} 
          icon="📊"
        />
        <StatsCard 
          title="Faturamento total" 
          value={`R$ ${totalRevenue.toFixed(2)}`} 
          icon="💰"
        />
      </div>
      
      <h3>Produtos mais vendidos</h3>
      <div className="dashboard-grid">
        {popularProducts.map(product => (
          <div key={product.id} className="stats-card">
            <div className="info">
              <h3>{product.name}</h3>
              <p>Vendas: {product.totalQuantity}</p>
              <p>Faturamento: R$ {product.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;