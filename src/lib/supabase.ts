import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Twilio Configuration - Use environment variables only
const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID || ''
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN || ''
const TWILIO_VERIFY_SERVICE_SID = import.meta.env.VITE_TWILIO_VERIFY_SERVICE_SID || ''

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

// Twilio OTP functions
const sendTwilioOTP = async (phoneNumber: string) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
    throw new Error('Twilio credentials not configured')
  }

  const url = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`
  const body = new URLSearchParams({
    'To': `+91${phoneNumber}`,
    'Channel': 'sms'
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })

  const data = await response.json()
  
  if (response.ok) {
    return { success: true, data }
  } else {
    throw new Error(data.message || 'Failed to send OTP')
  }
}

const verifyTwilioOTP = async (phoneNumber: string, code: string) => {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
    throw new Error('Twilio credentials not configured')
  }

  const url = `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`
  const body = new URLSearchParams({
    'To': `+91${phoneNumber}`,
    'Code': code
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })

  const data = await response.json()
  
  if (response.ok && data.status === 'approved') {
    return { success: true, data }
  } else {
    throw new Error(data.message || 'Invalid OTP')
  }
}

// Auth helper functions
export const auth = {
  // Send OTP to phone number using Twilio
  async sendOTP(phoneNumber: string) {
    try {
      // First try Twilio
      const twilioResult = await sendTwilioOTP(phoneNumber)
      
      if (twilioResult.success) {
        return { success: true, data: twilioResult.data }
      }
    } catch (error) {
      console.error('Twilio OTP failed, falling back to Supabase:', error)
      
      // Fallback to Supabase
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
      } catch (supabaseError) {
        console.error('Supabase OTP also failed:', supabaseError)
        throw error // Throw the original Twilio error
      }
    }
  },

  // Verify OTP using Twilio
  async verifyOTP(phoneNumber: string, token: string) {
    try {
      // First try Twilio
      const twilioResult = await verifyTwilioOTP(phoneNumber, token)
      
      if (twilioResult.success) {
        // Create user session manually since we're using Twilio
        const session = {
          user: {
            id: `twilio_${phoneNumber}`,
            phone: phoneNumber,
            created_at: new Date().toISOString()
          },
          access_token: 'twilio_session',
          refresh_token: 'twilio_refresh'
        }
        
        return { success: true, data: { session, user: session.user } }
      }
    } catch (error) {
      console.error('Twilio verification failed, falling back to Supabase:', error)
      
      // Fallback to Supabase
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
      } catch (supabaseError) {
        console.error('Supabase verification also failed:', supabaseError)
        throw error // Throw the original Twilio error
      }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      // Check if we have a Twilio session
      const twilioSession = localStorage.getItem('twilio_session')
      if (twilioSession) {
        const session = JSON.parse(twilioSession)
        return { success: true, user: session.user }
      }
      
      // Fallback to Supabase
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
      // Clear Twilio session
      localStorage.removeItem('twilio_session')
      
      // Also sign out from Supabase
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
