import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  stock_quantity: number
  category_id: string
  image_url: string
  unit: string
  discount_percentage: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  image_url: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface UserAddress {
  id: string
  user_id: string
  full_name: string
  phone_number: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  landmark?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  total_amount: number
  delivery_fee: number
  handling_fee: number
  final_amount: number
  delivery_address_id: string
  payment_method: 'cod' | 'upi' | 'card' | 'wallet'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  estimated_delivery_time?: string
  actual_delivery_time?: string
  notes?: string
  created_at: string
  updated_at: string
  delivery_address?: UserAddress
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  total_price: number
  created_at: string
}

// Auth helper functions
export const auth = {
  // Send OTP to phone number
  async sendOTP(phoneNumber: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: `+91${phoneNumber}`,
        options: {
          shouldCreateUser: true,
          data: {
            phone_number: phoneNumber
          }
        }
      })
      
      if (error) {
        throw error
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('Error sending OTP:', error)
      return { success: false, error }
    }
  },

  // Verify OTP
  async verifyOTP(phoneNumber: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+91${phoneNumber}`,
        token: token,
        type: 'sms'
      })
      
      if (error) {
        throw error
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      return { success: false, error }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        throw error
      }
      
      return { success: true, user }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { success: false, error }
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, error }
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const db = {
  // Get all categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      
      if (error) throw error
      return { success: true, data: data as Category[] }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { success: false, error }
    }
  },

  // Get all products
  async getProducts(categoryId?: string) {
    try {
      let query = supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
      
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data: data as Product[] }
    } catch (error) {
      console.error('Error fetching products:', error)
      return { success: false, error }
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6)
      
      if (error) throw error
      return { success: true, data: data as Product[] }
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return { success: false, error }
    }
  },

  // Search products
  async searchProducts(query: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data: data as Product[] }
    } catch (error) {
      console.error('Error searching products:', error)
      return { success: false, error }
    }
  },

  // Get user cart
  async getCart() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)
      
      if (error) throw error
      return { success: true, data: data as CartItem[] }
    } catch (error) {
      console.error('Error fetching cart:', error)
      return { success: false, error }
    }
  },

  // Add to cart
  async addToCart(productId: string, quantity: number = 1) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity
        })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error }
    }
  },

  // Update cart item quantity
  async updateCartItem(cartItemId: string, quantity: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', cartItemId)
          .eq('user_id', user.id)
        
        if (error) throw error
        return { success: true }
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', cartItemId)
          .eq('user_id', user.id)
          .select()
        
        if (error) throw error
        return { success: true, data }
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      return { success: false, error }
    }
  },

  // Remove from cart
  async removeFromCart(cartItemId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { success: false, error }
    }
  },

  // Get user addresses
  async getUserAddresses() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
      
      if (error) throw error
      return { success: true, data: data as UserAddress[] }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      return { success: false, error }
    }
  },

  // Add user address
  async addUserAddress(address: Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          ...address,
          user_id: user.id
        })
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] as UserAddress }
    } catch (error) {
      console.error('Error adding address:', error)
      return { success: false, error }
    }
  },

  // Get user orders
  async getUserOrders() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          delivery_address:user_addresses(*),
          order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, data: data as Order[] }
    } catch (error) {
      console.error('Error fetching orders:', error)
      return { success: false, error }
    }
  },

  // Create order
  async createOrder(orderData: {
    total_amount: number
    delivery_fee: number
    handling_fee: number
    final_amount: number
    delivery_address_id: string
    payment_method: 'cod' | 'upi' | 'card' | 'wallet'
    notes?: string
    items: Array<{
      product_id: string
      product_name: string
      product_price: number
      quantity: number
      total_price: number
    }>
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Generate order number
      const orderNumber = 'SE' + Date.now().toString().slice(-8) + Math.random().toString().slice(2, 6)

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: orderData.total_amount,
          delivery_fee: orderData.delivery_fee,
          handling_fee: orderData.handling_fee,
          final_amount: orderData.final_amount,
          delivery_address_id: orderData.delivery_address_id,
          payment_method: orderData.payment_method,
          notes: orderData.notes
        })
        .select()
        .single()
      
      if (orderError) throw orderError

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        ...item
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
      
      if (itemsError) throw itemsError

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      return { success: true, data: order as Order }
    } catch (error) {
      console.error('Error creating order:', error)
      return { success: false, error }
    }
  }
}

export default supabase

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  role: 'admin' | 'customer'
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  user_id: string
  customer_name: string
  customer_email: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  shipping_address: string
  payment_status: 'pending' | 'paid' | 'failed'
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: number
  quantity: number
  price: number
  product_name: string
}

export interface Payment {
  id: string
  order_id: number
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  payment_method: string
  created_at: string
}

// Database helper functions
export const db = {
  // User management
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Product management
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProductById(id: number) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateProduct(id: number, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteProduct(id: number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Order management
  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getOrderById(id: number) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateOrder(id: number, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Payment management
  async createPayment(payment: Omit<Payment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePayment(id: string, updates: Partial<Payment>) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // File upload
  async uploadFile(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    return data
  },

  async getFileUrl(path: string) {
    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}
