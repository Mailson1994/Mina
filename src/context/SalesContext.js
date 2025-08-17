import { createContext, useState, useEffect } from 'react';

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  // Estados e inicialização
  const [sales, setSales] = useState(() => {
    const savedSales = localStorage.getItem('sales');
    return savedSales ? JSON.parse(savedSales) : [];
  });

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [
      { id: 1, name: 'Batom Matte', price: 29.90, stock: 50 },
      { id: 2, name: 'Paleta de Sombras', price: 89.90, stock: 30 },
      { id: 3, name: 'Base Líquida', price: 59.90, stock: 40 },
      { id: 4, name: 'Máscara de Cílios', price: 39.90, stock: 60 },
    ];
  });

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persistência no localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  // Adiciona novo produto
  const addProduct = (newProduct) => {
    const id = Date.now();
    const productWithId = { ...newProduct, id };
    setProducts((prev) => [...prev, productWithId]);
  };

  // Adiciona item ao carrinho
  const addToCart = (product, quantity) => {
    if (quantity <= 0) return;

    if (quantity > product.stock) {
      setError(`Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`);
      return;
    }

    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
      const newTotalQuantity = cart[existingItemIndex].quantity + quantity;
      if (newTotalQuantity > product.stock) {
        setError(`Quantidade solicitada excede o estoque disponível de ${product.name}`);
        return;
      }

      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity }]);
    }

    setError(null);
  };

  // Remove item do carrinho
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Atualiza item no carrinho
  const updateCartItem = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity > product.stock) {
      setError(`Quantidade solicitada excede o estoque disponível de ${product.name}`);
      return;
    }

    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));

    setError(null);
  };

  // Finaliza venda (função corrigida)
  const completeSale = async (saleData) => {
    const { items, paymentMethod } = saleData;
    
    if (!items || items.length === 0) {
      setError('Adicione produtos ao carrinho antes de finalizar');
      return false;
    }

    try {
      // Prepara dados da venda
      const newSale = {
        date: new Date().toISOString().split('T')[0],
        items: items.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            productName: product?.name || 'Desconhecido',
            quantity: item.quantity,
            price: product?.price || 0,
            total: (product?.price || 0) * item.quantity
          };
        }),
        paymentMethod,
        total: items.reduce((sum, item) => {
          const product = products.find(p => p.id === item.productId);
          return sum + (product?.price || 0) * item.quantity;
        }, 0),
        status: 'completed'
      };

      // Gera ID único
      const newId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
      const saleWithId = { ...newSale, id: newId };

      // Atualiza vendas
      setSales(prevSales => [...prevSales, saleWithId]);

      // Atualiza estoque
      setProducts(prevProducts =>
        prevProducts.map(p => {
          const cartItem = items.find(item => item.productId === p.id);
          if (cartItem) {
            return { ...p, stock: p.stock - cartItem.quantity };
          }
          return p;
        })
      );

      setError(null);
      return true;
    } catch (err) {
      setError('Erro ao finalizar venda');
      console.error(err);
      return false;
    }
  };

  // Cancela venda
  const cancelSale = async (saleId, adminPassword) => {
    try {
      if (adminPassword !== "admin123") {
        return { success: false, message: 'Senha de administrador incorreta' };
      }

      const sale = sales.find(s => s.id === saleId);
      if (!sale) {
        return { success: false, message: 'Venda não encontrada' };
      }

      if (sale.status === 'canceled') {
        return { success: false, message: 'Venda já foi cancelada anteriormente' };
      }

      // Atualiza vendas
      const updatedSales = sales.map(s =>
        s.id === saleId ? { ...s, status: 'canceled' } : s
      );

      // Restaura estoque
      const updatedProducts = products.map(p => {
        const saleItem = sale.items.find(item => item.productId === p.id);
        if (saleItem) {
          return { ...p, stock: p.stock + saleItem.quantity };
        }
        return p;
      });

      // Registra cancelamento
      const canceledSale = {
        ...sale,
        canceledAt: new Date().toISOString(),
        canceledBy: "admin",
        status: 'canceled'
      };

      setSales(updatedSales);
      setProducts(updatedProducts);

      // Salva em histórico de cancelamentos
      const canceledSales = JSON.parse(localStorage.getItem('canceledSales') || '[]');
      localStorage.setItem('canceledSales', JSON.stringify([...canceledSales, canceledSale]));

      return { success: true };
    } catch (err) {
      return { success: false, message: 'Erro ao cancelar venda' };
    }
  };

  // Provedor de contexto
  return (
    <SalesContext.Provider value={{
      sales,
      products,
      cart,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateCartItem,
      completeSale,
      cancelSale,
      addProduct,
      addSale: completeSale // Alias para compatibilidade
    }}>
      {children}
    </SalesContext.Provider>
  );
};