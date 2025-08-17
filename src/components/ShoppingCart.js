// src/components/ShoppingCart.js
import React from 'react';

const ShoppingCart = ({ 
  cart, 
  onRemove, 
  onUpdateQuantity,
  paymentMethod,
  onPaymentMethodChange,
  onCompleteSale
}) => {
  const calculateTotal = () => {
    return cart.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
  };

  return (
    <div className="shopping-cart">
      <h3>Carrinho de Compras</h3>
      
      {cart.length === 0 ? (
        <p>O carrinho está vazio</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço Unitário</th>
                <th>Quantidade</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.product.id}>
                  <td>{item.product.name}</td>
                  <td>R$ {item.product.price.toFixed(2)}</td>
                  <td>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => 
                        onUpdateQuantity(item.product.id, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>R$ {(item.product.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => onRemove(item.product.id)}
                      className="remove-btn"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="cart-summary">
            <div className="form-group">
              <label>Forma de Pagamento</label>
              <select 
                value={paymentMethod} 
                onChange={(e) => onPaymentMethodChange(e.target.value)}
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="pix">PIX</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>
            
            <div className="total">
              <strong>Total: R$ {calculateTotal().toFixed(2)}</strong>
            </div>
            
            <button 
              onClick={onCompleteSale}
              className="complete-sale-btn"
            >
              Finalizar Venda
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;