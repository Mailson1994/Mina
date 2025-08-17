// src/pages/Dashboard.js
import React, { useContext } from 'react';
import { SalesContext } from '../context/SalesContext';
import StatsCard from '../components/StatsCard';
import SalesTable from '../components/SalesTable';

const Dashboard = () => {
  const { sales, products, loading, error } = useContext(SalesContext);
  
  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <div>Carregando dados...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <div className="error">{error}</div>
      </div>
    );
  }
  
  const totalSales = sales.filter(s => s.status !== 'canceled').length;
  const totalRevenue = sales
    .filter(s => s.status !== 'canceled')
    .reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = products.length;
  
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      
      <div className="dashboard-grid">
        <StatsCard 
          title="Vendas Totais" 
          value={totalSales} 
          icon="📊"
        />
        <StatsCard 
          title="Faturamento" 
          value={`R$ ${totalRevenue.toFixed(2)}`} 
          icon="💰"
        />
        <StatsCard 
          title="Produtos" 
          value={totalProducts} 
          icon="💄"
        />
      </div>
      
      <div className="chart-container">
        <h3>Últimas Vendas</h3>
        <SalesTable 
          sales={sales.slice(0, 5)} 
          showActions={false} 
        />
      </div>
    </div>
  );
};

export default Dashboard;