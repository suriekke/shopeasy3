import React, { useState, useEffect } from 'react'

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  discount: number
  category: string
  image: string
  unit: string
  stock: number
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
}

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'CART' | 'CHECKOUT' | 'CATEGORY' | 'MY_ORDERS' | 'SAVED_ADDRESSES' | 'PAYMENT_METHODS' | 'CUSTOMER_SUPPORT' | 'SETTINGS'>('HOME')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showAddressInput, setShowAddressInput] = useState(false)
  const [currentLocation, setCurrentLocation] = useState('Select your location')
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [userPhone, setUserPhone] = useState('')

  const categories: Category[] = [
    { id: 1, name: 'Vegetables & Fruits', icon: '🥬' },
    { id: 2, name: 'Dairy & Bakery', icon: '🥛' },
    { id: 3, name: 'Snacks & Beverages', icon: '🍿' },
    { id: 4, name: 'Home & Personal Care', icon: '🧴' },
    { id: 5, name: 'Meat & Fish', icon: '🐟' },
    { id: 6, name: 'Grocery & Staples', icon: '🛒' }
  ]

  // Sample products
  useEffect(() => {
    setProducts([
      { id: 1, name: 'Fresh Onions', price: 40, originalPrice: 60, discount: 33, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', unit: '1 kg', stock: 50 },
      { id: 2, name: 'Fresh Tomatoes', price: 30, originalPrice: 45, discount: 33, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', unit: '500 g', stock: 30 },
      { id: 3, name: 'Amul Milk', price: 60, originalPrice: 70, discount: 14, category: 'Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', unit: '1 L', stock: 25 },
      { id: 4, name: 'Britannia Bread', price: 35, originalPrice: 40, discount: 12, category: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', unit: '400 g', stock: 20 },
      { id: 5, name: 'Lay\'s Chips', price: 20, originalPrice: 25, discount: 20, category: 'Snacks', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', unit: '30 g', stock: 100 },
      { id: 6, name: 'Parle-G Biscuits', price: 10, originalPrice: 15, discount: 33, category: 'Snacks', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', unit: '100 g', stock: 80 },
      { id: 7, name: 'Fresh Potatoes', price: 25, originalPrice: 35, discount: 28, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', unit: '1 kg', stock: 40 },
      { id: 8, name: 'Fresh Carrots', price: 35, originalPrice: 50, discount: 30, category: 'Vegetables', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', unit: '500 g', stock: 35 }
    ])
  }, [])

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products

  const getSearchSuggestions = (query: string) => {
    if (query.length < 2) return []
    const suggestions = products
      .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
      .map(product => product.name)
    return suggestions.slice(0, 5)
  }

  // Real Twilio OTP Functions - FIXED
  const handleSendOtp = async () => {
    if (phoneNumber.length === 10) {
      setIsLoading(true)
      setOtpError('')
      
      try {
        const response = await fetch('/api/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: `+91${phoneNumber}` }),
        })

        const data = await response.json()
        
        if (data.success) {
          setShowOtpInput(true)
          alert(`OTP sent to +91 ${phoneNumber}`)
        } else {
          setOtpError('Failed to send OTP. Please try again.')
        }
      } catch (error) {
        console.error('Error sending OTP:', error)
        setOtpError('Network error. Please try again.')
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
        const response = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            phone: `+91${phoneNumber}`,
            otp: otp 
          }),
        })

        const data = await response.json()
        
        if (data.success) {
          setIsLoggedIn(true)
          setUserPhone(phoneNumber)
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
        setOtpError('Network error. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else {
      setOtpError('Please enter a 6-digit OTP')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserPhone('')
  }

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
            
            <div className="flex-1 mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    const suggestions = getSearchSuggestions(e.target.value)
                    setSearchSuggestions(suggestions)
                    setShowSearchSuggestions(suggestions.length > 0)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {showSearchSuggestions && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50">
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearchQuery(suggestion)
                          setShowSearchSuggestions(false)
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center space-x-1 text-gray-600 hover:text-pink-600"
              >
                <span>📍</span>
                <span className="text-sm">{currentLocation}</span>
              </button>
              
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-pink-600"
                  >
                    <span>👤</span>
                    <span className="text-sm">Account</span>
                  </button>
                  {showAccountDropdown && (
                    <div className="absolute top-full right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50 min-w-48">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm text-gray-600">+91 {userPhone}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setView('MY_ORDERS'); setShowAccountDropdown(false) }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          My Orders
                        </button>
                        <button
                          onClick={() => { setView('SAVED_ADDRESSES'); setShowAccountDropdown(false) }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Saved Addresses
                        </button>
                        <button
                          onClick={() => { setView('PAYMENT_METHODS'); setShowAccountDropdown(false) }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Payment Methods
                        </button>
                        <button
                          onClick={() => { setView('CUSTOMER_SUPPORT'); setShowAccountDropdown(false) }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Customer Support
                        </button>
                        <button
                          onClick={() => { setView('SETTINGS'); setShowAccountDropdown(false) }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Settings
                        </button>
                        <button
                          onClick={() => { handleLogout(); setShowAccountDropdown(false) }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

        {/* Location Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Select Location</h2>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {!showAddressInput ? (
                <div>
                  <p className="text-gray-600 mb-4">Choose your delivery location</p>
                  <div className="space-y-2 mb-4">
                    <button
                      onClick={() => {
                        setCurrentLocation('Mumbai, Maharashtra')
                        setShowLocationModal(false)
                      }}
                      className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Mumbai, Maharashtra
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLocation('Delhi, NCR')
                        setShowLocationModal(false)
                      }}
                      className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Delhi, NCR
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLocation('Bangalore, Karnataka')
                        setShowLocationModal(false)
                      }}
                      className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Bangalore, Karnataka
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAddressInput(true)}
                    className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Enter your address</p>
                  <textarea
                    placeholder="Enter your complete address..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 h-24"
                  />
                  <button
                    onClick={() => {
                      setCurrentLocation('Custom Address')
                      setShowLocationModal(false)
                      setShowAddressInput(false)
                    }}
                    className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => setShowAddressInput(false)}
                    className="w-full text-pink-600 py-2 mt-2"
                  >
                    Back to Locations
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Home View */}
        {view === 'HOME' && (
          <div>
            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.name)
                      setView('CATEGORY')
                    }}
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-2xl mb-2">{category.icon}</span>
                    <span className="text-sm text-center">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h2 className="text-xl font-bold mb-4">Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-gray-900">₹{product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{product.discount}% OFF</span>
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
          </div>
        )}

        {/* Category View */}
        {view === 'CATEGORY' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => { setView('HOME'); setSelectedCategory('') }}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">{selectedCategory}</h1>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-gray-900">₹{product.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{product.discount}% OFF</span>
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Delivery Address</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-300 rounded-lg">
                    <p className="font-medium">Home</p>
                    <p className="text-gray-600">123 Main Street, Mumbai, Maharashtra</p>
                  </div>
                  <button className="w-full border-2 border-dashed border-gray-300 py-4 rounded-lg text-gray-600 hover:border-pink-600">
                    + Add New Address
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg">
                    <input type="radio" name="payment" className="mr-3" defaultChecked />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg">
                    <input type="radio" name="payment" className="mr-3" />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg">
                    <input type="radio" name="payment" className="mr-3" />
                    <span>UPI</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
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

        {/* Account Menu Views */}
        {view === 'MY_ORDERS' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">My Orders</h1>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600">No orders yet. Start shopping!</p>
            </div>
          </div>
        )}

        {view === 'SAVED_ADDRESSES' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">Saved Addresses</h1>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600">No saved addresses yet.</p>
            </div>
          </div>
        )}

        {view === 'PAYMENT_METHODS' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">Payment Methods</h1>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600">No payment methods saved yet.</p>
            </div>
          </div>
        )}

        {view === 'CUSTOMER_SUPPORT' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">Customer Support</h1>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600">Contact us at support@shopeasy.com</p>
            </div>
          </div>
        )}

        {view === 'SETTINGS' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600">Settings page coming soon.</p>
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
