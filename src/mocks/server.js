import { createServer } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,
    
    routes() {
      this.namespace = 'api';
      
      // Carregar dados iniciais do localStorage se existirem
      this.get('/products', () => {
        const savedProducts = localStorage.getItem('products');
        return savedProducts 
          ? JSON.parse(savedProducts)
          : [
              { id: 1, name: 'Batom Matte', price: 29.90, stock: 50 },
              { id: 2, name: 'Paleta de Sombras', price: 89.90, stock: 30 },
              { id: 3, name: 'Base Líquida', price: 59.90, stock: 40 },
              { id: 4, name: 'Máscara de Cílios', price: 39.90, stock: 60 },
            ];
      });
      
      this.get('/sales', () => {
        const savedSales = localStorage.getItem('sales');
        return savedSales 
          ? JSON.parse(savedSales)
          : [
              { id: 1, date: '2023-10-15', productId: 1, quantity: 2, total: 59.80 },
              { id: 2, date: '2023-10-16', productId: 2, quantity: 1, total: 89.90 },
            ];
      });
      
      // Vendas
      this.get('/sales', () => {
        return [
          { id: 1, date: '2023-10-15', productId: 1, quantity: 2, total: 59.80 },
          { id: 2, date: '2023-10-16', productId: 2, quantity: 1, total: 89.90 },
        ];
      });
      
      // Login
      this.post('/auth/login', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);

        if (password === 'mina123') {
          return {
            token: 'fake-jwt-token',
            user: {
              id: 1,
              name: 'Administrador',
              email: email,
              role: 'admin'
            }
          };
        }

        return new Response(401, {}, { error: 'Credenciais inválidas' });
      });

      // Verificar autenticação
      this.get('/auth/me', (schema, request) => {
        const token = request.requestHeaders.Authorization?.split(' ')[1];
        if (token === 'fake-jwt-token') {
          return {
            id: 1,
            name: 'Administrador',
            email: 'admin@minamake.com',
            role: 'admin'
          };
        }
        return new Response(401, {}, { error: 'Não autenticado' });
      });
    },
  });
}