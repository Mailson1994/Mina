// src/components/SalesTable.js
import React from 'react';

const SalesTable = ({ sales, showActions = true, onCancelClick }) => {
  const formatPaymentMethod = (method) => {
    const methods = {
      dinheiro: 'Dinheiro',
      cartao_credito: 'Cartão Crédito',
      cartao_debito: 'Cartão Débito',
      pix: 'PIX',
      boleto: 'Boleto'
    };
    return methods[method] || method;
  };

  return (
    <div className="chart-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Produtos</th>
            <th>Pagamento</th>
            <th>Total</th>
            <th>Status</th>
            {showActions && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 7 : 6} className="no-data">
                Nenhuma venda registrada
              </td>
            </tr>
          ) : (
            sales.map(sale => (
              <tr key={sale.id} className={sale.status === 'canceled' ? 'canceled' : ''}>
                <td>{sale.id}</td>
                <td>{sale.date}</td>
                <td>
                  {sale.items.map((item, index) => (
                    <div key={index}>
                      {item.quantity}x {item.productName || `Produto ${item.productId}`}
                    </div>
                  ))}
                </td>
                <td>{formatPaymentMethod(sale.paymentMethod)}</td>
                <td>R$ {sale.total.toFixed(2)}</td>
                <td>
                  {sale.status === 'canceled' ? (
                    <span className="canceled-status">Cancelada</span>
                  ) : (
                    <span className="completed-status">Concluída</span>
                  )}
                </td>
                {showActions && sale.status !== 'canceled' && (
                  <td>
                    <button 
                      onClick={() => onCancelClick(sale.id)}
                      className="cancel-btn"
                    >
                      Cancelar
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;