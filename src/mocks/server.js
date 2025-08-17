import { createServer } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,
    
    routes() {
      this.namespace = 'api';
      
      this.get('/products', () => {
        const savedProducts = localStorage.getItem('products');
        return savedProducts ? JSON.parse(savedProducts) : [
          { id: 1, name: 'Batom Matte', price: 29.90, stock: 50 },
          { id: 2, name: 'Paleta de Sombras', price: 89.90, stock: 30 },
          { id: 3, name: 'Base Líquida', price: 59.90, stock: 40 },
          { id: 4, name: 'Máscara de Cílios', price: 39.90, stock: 60 },
        ];
      });
      
      this.get('/sales', () => {
        const savedSales = localStorage.getItem('sales');
        return savedSales ? JSON.parse(savedSales) : [];
      });
      
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