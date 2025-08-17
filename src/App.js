import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SalesProvider } from './context/SalesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import NewSale from './pages/NewSale';
import Reports from './pages/Reports';
import Login from './pages/Login';
import NewProduct from './pages/NewProduct';
import CanceledSales from './pages/CanceledSales';
import './styles/main.css';

const MainLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="app-loading">Carregando...</div>;
  }
  
  return isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <SalesProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/new-sale" element={<NewSale />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/new-product" element={<NewProduct />} />
              <Route path="/canceled-sales" element={<CanceledSales />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SalesProvider>
    </AuthProvider>
  );
}

export default App;