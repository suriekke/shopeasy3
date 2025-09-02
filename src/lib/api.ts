// API Configuration for ShopEasy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://shopeasy-backend.onrender.com';

// API Helper Functions
export const api = {
  // Products
  async getProducts(filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE_URL}/api/products${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProduct(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async addProduct(productData: any) {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to add product');
    return response.json();
  },

  async updateProduct(id: string, productData: any) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  async deleteProduct(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  // Categories
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async addCategory(categoryData: any) {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to add category');
    return response.json();
  },

  // Cart
  async getCart(userId: string) {
    const response = await fetch(`${API_BASE_URL}/api/cart?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  async addToCart(userId: string, productId: string, quantity: number) {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  async updateCartItem(userId: string, productId: string, quantity: number) {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    if (!response.ok) throw new Error('Failed to update cart');
    return response.json();
  },

  async removeFromCart(userId: string, productId: string) {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId }),
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return response.json();
  },

  // Auth
  async login(phoneNumber: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });
    if (!response.ok) throw new Error('Failed to login');
    return response.json();
  },

  async verifyOtp(phoneNumber: string, otp: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, otp }),
    });
    if (!response.ok) throw new Error('Failed to verify OTP');
    return response.json();
  },

  // Health Check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Backend is not healthy');
    return response.json();
  }
};

export default api;
