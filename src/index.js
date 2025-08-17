import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { makeServer } from './mocks/server';
import './styles/main.css'; // Adicione esta linha

if (process.env.NODE_ENV === 'development') {
  makeServer();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);