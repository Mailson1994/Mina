import React, { useMemo, useState } from 'react';

function AddSaleForm({ products, addSale, onRegisterCancellation }) {
  // Estados para gerenciamento do formulário
  const [query, setQuery] = useState('');
  const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  
  // Estados para modais de cancelamento
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [showItemCancelModal, setShowItemCancelModal] = useState(false);
  const [itemToCancel, setItemToCancel] = useState(null);
  const [adminPasswordItem, setAdminPasswordItem] = useState('');
  const [cancelItemError, setCancelItemError] = useState('');

  // Filtra produtos por letra inicial ou prefixo
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => p.name.toLowerCase().startsWith(q));
  }, [products, query]);

  // Produto selecionado
  const selected = useMemo(() => 
    products.find(p => p.id === productId), 
    [products, productId]
  );
  
  // Cálculo do total da linha
  const lineTotal = selected ? (selected.price * (quantity || 0)) : 0;

  // Adiciona item ao carrinho
  const addToCart = (e) => {
    e.preventDefault();
    if (!productId || quantity <= 0) return;

    setCart(prev => {
      const idx = prev.findIndex(i => i.productId === productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity };
        return copy;
      }
      return [...prev, { productId, quantity }];
    });
    
    setProductId(null);
    setQuantity(1);
  };

  // Calcula total do carrinho
  const computeCartTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const p = products.find(pp => pp.id === item.productId);
      return acc + (p ? p.price * item.quantity : 0);
    }, 0);
  }, [cart, products]);

  // Finaliza a venda
  const finalizeCart = () => {
    if (cart.length === 0) return;

    // Valida estoque
    for (const item of cart) {
      const p = products.find(pp => pp.id === item.productId);
      if (!p) return alert('Produto não encontrado.');
      if (item.quantity > p.stock) {
        return alert(`Estoque insuficiente para "${p.name}". Em estoque: ${p.stock}`);
      }
    }

    // Chama função addSale passada via props
    addSale({ 
      items: cart,
      paymentMethod
    });

    const total = computeCartTotal.toFixed(2);
    setCart([]);
    alert(`Venda finalizada! Total: R$ ${total}\nForma de pagamento: ${paymentMethod}`);
  };

  // Cancela venda completa
  const handleCancelSale = () => {
    const ADMIN_PASSWORD = "admin123";
    
    if (adminPassword === ADMIN_PASSWORD) {
      if (onRegisterCancellation) {
        const cancellationData = {
          type: 'whole_sale',
          items: cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              productName: product?.name || 'Desconhecido',
              quantity: item.quantity,
              price: product?.price || 0
            };
          }),
          paymentMethod,
          timestamp: new Date().toISOString()
        };
        onRegisterCancellation(cancellationData);
      }

      setCart([]);
      setAdminPassword('');
      setShowCancelModal(false);
      alert('Venda cancelada com sucesso!');
    } else {
      setCancelError('Senha administrativa incorreta');
    }
  };

  // Cancela item específico
  const handleCancelItem = () => {
    const ADMIN_PASSWORD = "admin123";
    
    if (adminPasswordItem === ADMIN_PASSWORD) {
      if (onRegisterCancellation) {
        const item = cart[itemToCancel];
        const product = products.find(p => p.id === item.productId);
        
        onRegisterCancellation({
          type: 'item',
          productId: item.productId,
          productName: product?.name || 'Desconhecido',
          quantity: item.quantity,
          price: product?.price || 0,
          paymentMethod,
          timestamp: new Date().toISOString()
        });
      }

      setCart(prev => prev.filter((_, i) => i !== itemToCancel));
      setAdminPasswordItem('');
      setShowItemCancelModal(false);
      setItemToCancel(null);
    } else {
      setCancelItemError('Senha administrativa incorreta');
    }
  };

  // Solicita cancelamento de item
  const requestItemCancel = (index) => {
    setItemToCancel(index);
    setShowItemCancelModal(true);
    setAdminPasswordItem('');
    setCancelItemError('');
  };

  return (
    <div className="card">
      <h3>Registrar venda</h3>

      {/* Campo de pesquisa */}
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <input
          placeholder="Pesquisar por letra inicial (ex.: b, ba, bat)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="form-input"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <small>Produtos filtrados: {filtered.length}</small>
        </div>
      </div>

      {/* Formulário de adição */}
      <form onSubmit={addToCart}>
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}>
          <select 
            value={productId || ''} 
            onChange={e => setProductId(e.target.value ? parseInt(e.target.value) : null)}
            className="form-input"
          >
            <option value="">Selecione o produto</option>
            {filtered.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — R$ {p.price.toFixed(2)} (Estoque: {p.stock})
              </option>
            ))}
          </select>

          <input 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={e => setQuantity(Math.max(1, +e.target.value || 1))}
            className="form-input"
          />
          <input 
            readOnly 
            value={selected ? `R$ ${lineTotal.toFixed(2)}` : ''}
            className="form-input"
          />
          <button 
            type="submit" 
            disabled={!selected || quantity > (selected?.stock || 0)}
            className="btn btn-add"
          >
            Adicionar
          </button>
        </div>
        {selected && quantity > (selected?.stock || 0) && (
          <div style={{ color: '#d00', marginTop: 8 }}>
            Quantidade maior que o estoque disponível.
          </div>
        )}
      </form>

      {/* Seção de pagamento */}
      <div className="payment-section">
        <label>Forma de Pagamento:</label>
        <select
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          className="form-input"
        >
          <option value="dinheiro">Dinheiro</option>
          <option value="pix">PIX</option>
          <option value="debito">Cartão de Débito</option>
          <option value="credito">Cartão de Crédito</option>
          <option value="boleto">Boleto</option>
        </select>
      </div>

      {/* Carrinho */}
      <div className="card cart-container">
        <div className="cart-header">
          <h3>Carrinho</h3>
          <div className="cart-actions">
            <button 
              onClick={() => setShowCancelModal(true)}
              className="btn btn-cancel"
              disabled={cart.length === 0}
            >
              Cancelar Venda
            </button>
            <button 
              onClick={finalizeCart} 
              disabled={cart.length === 0}
              className="btn btn-save"
            >
              Finalizar Venda (R$ {computeCartTotal.toFixed(2)})
            </button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => {
              const p = products.find(pp => pp.id === item.productId);
              const total = p ? p.price * item.quantity : 0;
              return (
                <tr key={idx}>
                  <td>{p?.name || '—'}</td>
                  <td>{item.quantity}</td>
                  <td>R$ {total.toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => requestItemCancel(idx)}
                      className="btn btn-cancel-item"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              );
            })}
            {cart.length === 0 && (
              <tr><td colSpan={4}>Carrinho vazio.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal cancelamento venda completa */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cancelar Venda Completa</h3>
            <p>Para cancelar toda a venda, insira a senha administrativa:</p>
            
            <input
              type="password"
              value={adminPassword}
              onChange={e => {
                setAdminPassword(e.target.value);
                setCancelError('');
              }}
              placeholder="Senha administrativa"
              className="form-input"
            />
            
            {cancelError && <div className="error-message">{cancelError}</div>}
            
            <div className="modal-actions">
              <button 
                onClick={() => {
                  setShowCancelModal(false);
                  setAdminPassword('');
                }}
                className="btn btn-secondary"
              >
                Voltar
              </button>
              <button 
                onClick={handleCancelSale}
                className="btn btn-danger"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cancelamento item */}
      {showItemCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cancelar Item</h3>
            <p>Para cancelar este item, insira a senha administrativa:</p>
            
            <input
              type="password"
              value={adminPasswordItem}
              onChange={e => {
                setAdminPasswordItem(e.target.value);
                setCancelItemError('');
              }}
              placeholder="Senha administrativa"
              className="form-input"
            />
            
            {cancelItemError && <div className="error-message">{cancelItemError}</div>}
            
            <div className="modal-actions">
              <button 
                onClick={() => {
                  setShowItemCancelModal(false);
                  setAdminPasswordItem('');
                }}
                className="btn btn-secondary"
              >
                Voltar
              </button>
              <button 
                onClick={handleCancelItem}
                className="btn btn-danger"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddSaleForm;