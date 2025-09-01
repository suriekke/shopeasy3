import React, { useState, useEffect } from 'react'

// Types
interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  stock: number
  category: string
  image: string
  unit?: string
  discount?: number
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Category {
  id: number
  name: string
  icon: string
  image: string
}

type View = 'HOME' | 'LOGIN' | 'CATEGORY' | 'PRODUCT_DETAIL' | 'CART' | 'CHECKOUT' | 'PROFILE' | 'ORDERS'

const App: React.FC = () => {
  const [view, setView] = useState<View>('HOME')
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState('')

  // Sample data - Blinkit style
  const categories: Category[] = [
    { id: 1, name: 'Fruits & Vegetables', icon: '🥬', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop' },
    { id: 2, name: 'Dairy & Bakery', icon: '🥛', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop' },
    { id: 3, name: 'Staples', icon: '🍚', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop' },
    { id: 4, name: 'Snacks & Branded Foods', icon: '🍿', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
    { id: 5, name: 'Beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop' },
    { id: 6, name: 'Personal Care', icon: '🧴', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop' },
    { id: 7, name: 'Home Care', icon: '🧽', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop' },
    { id: 8, name: 'Baby Care', icon: '👶', image: 'https://images.unsplash.com/photo-1519689680058-324119c77d7b?w=400&h=300&fit=crop' }
  ]

  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: 'Fresh Onions',
        description: 'Fresh onions',
        price: 40,
        originalPrice: 50,
        stock: 50,
        category: 'Fruits & Vegetables',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop',
        unit: '1 kg',
        discount: 20
      },
      {
        id: 2,
        name: 'Fresh Tomatoes',
        description: 'Fresh tomatoes',
        price: 30,
        originalPrice: 40,
        stock: 40,
        category: 'Fruits & Vegetables',
        image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop',
        unit: '500 g',
        discount: 25
      },
      {
        id: 3,
        name: 'Amul Full Cream Milk',
        description: 'Amul full cream milk',
        price: 60,
        originalPrice: 70,
        stock: 30,
        category: 'Dairy & Bakery',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
        unit: '1 L',
        discount: 14
      },
      {
        id: 4,
        name: 'Britannia Brown Bread',
        description: 'Britannia brown bread',
        price: 35,
        originalPrice: 45,
        stock: 25,
        category: 'Dairy & Bakery',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
        unit: '400 g',
        discount: 22
      },
      {
        id: 5,
        name: 'Fortune Sunflower Oil',
        description: 'Fortune sunflower oil',
        price: 120,
        originalPrice: 140,
        stock: 20,
        category: 'Staples',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop',
        unit: '1 L',
        discount: 14
      },
      {
        id: 6,
        name: 'Lay\'s Classic',
        description: 'Lay\'s classic potato chips',
        price: 20,
        originalPrice: 25,
        stock: 60,
        category: 'Snacks & Branded Foods',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        unit: '30 g',
        discount: 20
      }
    ])
  }, [])

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }]
    })
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId))
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        )
      )
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSendOtp = () => {
    if (phoneNumber.length === 10) {
      setShowOtpInput(true)
      alert(`OTP sent to +91 ${phoneNumber}`)
    } else {
      alert('Please enter a valid 10-digit mobile number')
    }
  }

  const handleVerifyOtp = () => {
    if (otp === '123456') {
      setIsLoggedIn(true)
      setShowLoginModal(false)
      setPhoneNumber('')
      setOtp('')
      setShowOtpInput(false)
    } else {
      alert('Invalid OTP. Please try again.')
    }
  }

  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-6 left-6 text-black"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex justify-end mb-6">
              <div className="bg-yellow-400 text-black px-3 py-1 rounded font-bold text-lg">
                shopeasy
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                India's last minute app
              </h1>
              <p className="text-lg text-gray-600">
                Log in or Sign up
              </p>
            </div>

            {!showOtpInput ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter mobile number"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    maxLength={10}
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={phoneNumber.length !== 10}
                  className={`w-full py-4 rounded-lg font-semibold ${
                    phoneNumber.length === 10 
                      ? 'bg-pink-600 text-white hover:bg-pink-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    OTP sent to +91 {phoneNumber}
                  </p>
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6}
                  className={`w-full py-4 rounded-lg font-semibold ${
                    otp.length === 6 
                      ? 'bg-pink-600 text-white hover:bg-pink-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Verify OTP
                </button>
                <button
                  onClick={() => setShowOtpInput(false)}
                  className="w-full py-2 text-pink-600 font-semibold"
                >
                  Change Number
                </button>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-6 text-center">
              By continuing, you agree to our{' '}
              <a href="#" className="underline">Terms of service</a>
              {' '}&{' '}
              <a href="#" className="underline">Privacy policy</a>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('HOME')}>
                <div className="bg-yellow-400 text-black px-3 py-1 rounded font-bold text-xl">
                  shopeasy
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>Deliver to</span>
                <span className="font-semibold">B.N Reddy Nagar, Hyderabad</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-1 text-gray-600 hover:text-pink-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">{isLoggedIn ? 'Profile' : 'Login'}</span>
              </button>
              <button 
                onClick={() => setView('CART')}
                className="relative flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span>Cart</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === 'HOME' && (
          <>
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4">Groceries delivered in 10 minutes</h1>
                  <p className="text-xl mb-6">Get your essentials delivered to your doorstep faster than ever.</p>
                  <button className="bg-white text-pink-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                    Start Shopping
                  </button>
                </div>
                <div className="hidden md:block">
                  <div className="w-64 h-48 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-6xl">🛒</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.name)
                      setView('CATEGORY')
                    }}
                    className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                      {category.icon}
                    </div>
                    <span className="text-sm font-medium text-center">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Products */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="relative mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{product.unit}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="font-bold text-lg">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-pink-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'CATEGORY' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">{selectedCategory}</h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="relative mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{product.unit}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="font-bold text-lg">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-pink-700"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add items to get started</p>
                <button
                  onClick={() => setView('HOME')}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Cart Items</h2>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
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
                            <p className="font-bold">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg p-6 sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{getCartTotal()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>₹20</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>₹{getCartTotal() + 20}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setView('CHECKOUT')}
                      className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <textarea
                    placeholder="Address"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹20</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{getCartTotal() + 20}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    alert('Order placed successfully!')
                    setCartItems([])
                    setView('HOME')
                  }}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ShopEasy</h3>
              <p className="text-gray-300">India's last minute app</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Download App</h4>
              <div className="space-y-2">
                <button className="w-full bg-black text-white py-2 rounded-lg text-sm">
                  Download for iOS
                </button>
                <button className="w-full bg-black text-white py-2 rounded-lg text-sm">
                  Download for Android
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 ShopEasy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
