import React, { useState, useEffect } from 'react'
import { auth } from './lib/supabase'

interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  unit: string
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'CART' | 'CHECKOUT'>('HOME')
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState('')

  // Sample products
  useEffect(() => {
    setProducts([
      { id: 1, name: 'Fresh Onions', price: 40, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', unit: '1 kg' },
      { id: 2, name: 'Fresh Tomatoes', price: 30, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', unit: '500 g' },
      { id: 3, name: 'Amul Milk', price: 60, category: 'Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', unit: '1 L' },
      { id: 4, name: 'Britannia Bread', price: 35, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', unit: '400 g' },
      { id: 5, name: 'Lay\'s Chips', price: 20, category: 'Snacks', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', unit: '30 g' },
      { id: 6, name: 'Parle-G Biscuits', price: 10, category: 'Snacks', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', unit: '100 g' }
    ])
  }, [])

  // OTP Functions
  const handleSendOtp = async () => {
    if (phoneNumber.length === 10) {
      setIsLoading(true)
      setOtpError('')
      try {
        const result = await auth.sendOTP(phoneNumber)
        if (result.success) {
          setShowOtpInput(true)
          alert(`OTP sent to +91 ${phoneNumber}`)
        } else {
          setOtpError('Failed to send OTP. Please try again.')
        }
      } catch (error) {
        console.error('Error sending OTP:', error)
        setOtpError('Failed to send OTP. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      alert('Please enter a valid 10-digit mobile number')
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      setIsLoading(true)
      setOtpError('')
      try {
        const result = await auth.verifyOTP(phoneNumber, otp)
        if (result.success) {
          if (result.data && result.data.session && result.data.session.access_token === 'twilio_session') {
            localStorage.setItem('twilio_session', JSON.stringify(result.data.session))
          }
          setIsLoggedIn(true)
          setShowLoginModal(false)
          setPhoneNumber('')
          setOtp('')
          setShowOtpInput(false)
          alert('Login successful!')
        } else {
          setOtpError('Invalid OTP. Please try again.')
        }
      } catch (error) {
        console.error('Error verifying OTP:', error)
        setOtpError('Invalid OTP. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      setOtpError('Please enter a 6-digit OTP')
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      setIsLoggedIn(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Session check
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const result = await auth.getCurrentUser()
        if (result.success && result.user) {
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error('Error checking user session:', error)
      }
    }
    checkUserSession()
  }, [])

  // Cart functions
  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }])
    }
  }

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-pink-600">ShopEasy</h1>
            
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700"
                >
                  Login
                </button>
              )}
              
              <button
                onClick={() => setView('CART')}
                className="relative p-2 text-gray-600 hover:text-pink-600"
              >
                <span className="text-xl">🛒</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Login</h2>
                <button
                  onClick={() => {
                    setShowLoginModal(false)
                    setPhoneNumber('')
                    setOtp('')
                    setShowOtpInput(false)
                    setOtpError('')
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {!showOtpInput ? (
                <div>
                  <p className="text-gray-600 mb-4">Enter your phone number to receive OTP</p>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                    maxLength={10}
                  />
                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading || phoneNumber.length !== 10}
                    className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-300"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Enter the OTP sent to +91 {phoneNumber}</p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                    maxLength={6}
                  />
                  {otpError && <p className="text-red-500 text-sm mb-4">{otpError}</p>}
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-300"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    onClick={() => setShowOtpInput(false)}
                    className="w-full text-pink-600 py-2 mt-2"
                  >
                    Change Phone Number
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Home View */}
        {view === 'HOME' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900">₹{product.price}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-pink-600 text-white py-2 rounded-lg text-sm hover:bg-pink-700"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart View */}
        {view === 'CART' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some products to get started!</p>
                <button
                  onClick={() => setView('HOME')}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4">Cart Items</h3>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-gray-600">₹{item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{item.price * item.quantity}</p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 text-sm hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>₹40</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{cartTotal + 40}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setView('CHECKOUT')}
                      className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Checkout View */}
        {view === 'CHECKOUT' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('CART')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Cart
              </button>
              <h1 className="text-2xl font-bold">Checkout</h1>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹40</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{cartTotal + 40}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  alert('Order placed successfully!')
                  setCartItems([])
                  setView('HOME')
                }}
                className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-lg font-bold mb-4">ShopEasy</h3>
          <p className="text-gray-300">India's last minute app</p>
          <p className="text-gray-300 mt-4">&copy; 2024 ShopEasy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
