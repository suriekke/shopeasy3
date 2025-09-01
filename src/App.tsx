import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'

// Simple types
interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  image: string
}

interface CartItem {
  id: number
  product: Product
  quantity: number
}

interface User {
  id: string
  email: string
  full_name?: string
  name?: string
  role: 'admin' | 'customer'
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load data from Supabase
  useEffect(() => {
    loadProducts()
    loadUser()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform data to match component expectations
      const transformedProducts = (data || []).map(product => ({
        ...product,
        image: product.image_url || '/placeholder-product.jpg'
      }))
      
      setProducts(transformedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      // Fallback to sample data
      setProducts([
        {
          id: 1,
          name: 'iPhone 15 Pro',
          description: 'Latest iPhone with amazing features',
          price: 999,
          stock: 50,
          category: 'Electronics',
          image: '/placeholder-product.jpg'
        },
        {
          id: 2,
          name: 'MacBook Air',
          description: 'Powerful laptop for work and play',
          price: 1299,
          stock: 25,
          category: 'Electronics',
          image: '/placeholder-product.jpg'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setUser({ 
          ...user, 
          ...profile,
          name: profile?.full_name || user.email?.split('@')[0] || 'User'
        })
      }
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { 
        id: Date.now(),
        product, 
        quantity: 1
      }]
    })
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Simple Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-pink-600">🛍️ ShopEasy</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <span className="text-gray-600">Welcome, {user.name}</span>
              ) : (
                <button className="text-pink-600 hover:text-pink-700">Login</button>
              )}
              <button className="relative bg-pink-600 text-white px-4 py-2 rounded-lg">
                Cart ({cartItems.length})
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Banner */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-8 mb-8">
                  <h2 className="text-4xl font-bold mb-4">Welcome to ShopEasy</h2>
                  <p className="text-xl mb-6">Your one-stop shop for quick commerce. Fast delivery, great prices!</p>
                  <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                    Shop Now
                  </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm border p-6">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-pink-600">${product.price}</span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            } />
            
            <Route path="/cart" element={
              <div className="max-w-4xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
                {cartItems.length === 0 ? (
                  <p className="text-gray-600">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4 flex items-center space-x-4">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.product.name}</h3>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${item.product.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span>${getCartTotal()}</span>
                      </div>
                      <button className="w-full bg-pink-600 text-white py-3 rounded-lg mt-4 hover:bg-pink-700">
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            } />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2024 ShopEasy. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
