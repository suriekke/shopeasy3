import React, { useState, useEffect } from 'react'
import { auth } from './lib/supabase'

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

type View = 'HOME' | 'LOGIN' | 'CATEGORY' | 'PRODUCT_DETAIL' | 'CART' | 'CHECKOUT' | 'PROFILE' | 'ORDERS' | 'LOCATION_MODAL' | 'ACCOUNT_DROPDOWN' | 'ADDRESS_INPUT' | 'MY_ORDERS' | 'SAVED_ADDRESSES' | 'E_GIFT_CARDS' | 'FAQS' | 'ACCOUNT_PRIVACY'

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
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showAddressInput, setShowAddressInput] = useState(false)
  const [currentLocation, setCurrentLocation] = useState('B.N Reddy Nagar, Hyderabad')
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [userPhone, setUserPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState('')

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

  // Search suggestions based on query
  const getSearchSuggestions = (query: string) => {
    if (!query) return []
    
    const suggestions = [
      'Biscuits', 'Cookies', 'Crackers', 'Chocolate biscuits',
      'Groceries', 'Rice', 'Dal', 'Oil', 'Sugar', 'Salt',
      'Milk', 'Bread', 'Butter', 'Cheese', 'Yogurt',
      'Fruits', 'Vegetables', 'Tomatoes', 'Onions', 'Potatoes',
      'Snacks', 'Chips', 'Nuts', 'Popcorn', 'Chocolates',
      'Beverages', 'Tea', 'Coffee', 'Juice', 'Soft drinks'
    ]
    
    return suggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5)
  }

  // Real Twilio OTP functions
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
          // Store session if it's a Twilio session
          if (result.data && result.data.session && result.data.session.access_token === 'twilio_session') {
            localStorage.setItem('twilio_session', JSON.stringify(result.data.session))
          }
          
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
      setUserPhone('')
      setShowAccountDropdown(false)
      setView('HOME')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Check for existing user session on app load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const result = await auth.getCurrentUser()
        if (result.success && result.user) {
          setIsLoggedIn(true)
          setUserPhone(result.user.phone || '')
        }
      } catch (error) {
        console.error('Error checking user session:', error)
      }
    }
    
    checkUserSession()
  }, [])

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
      },
      {
        id: 7,
        name: 'Parle-G Biscuits',
        description: 'Parle-G glucose biscuits',
        price: 10,
        originalPrice: 12,
        stock: 100,
        category: 'Snacks & Branded Foods',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        unit: '100 g',
        discount: 17
      },
      {
        id: 8,
        name: 'Cadbury Dairy Milk',
        description: 'Cadbury dairy milk chocolate',
        price: 50,
        originalPrice: 60,
        stock: 40,
        category: 'Snacks & Branded Foods',
        image: 'https://images.unsplash.com/photo-1549007994-cb92aebf54f1?w=400&h=300&fit=crop',
        unit: '80 g',
        discount: 17
      }
    ])
  }, [])

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  // Handle search input
  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    const suggestions = getSearchSuggestions(value)
    setSearchSuggestions(suggestions)
    setShowSearchSuggestions(suggestions.length > 0 && value.length > 0)
  }

  // Handle account menu click
  const handleAccountMenuClick = (viewName: View) => {
    setView(viewName)
    setShowAccountDropdown(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-pink-600">ShopEasy</h1>
            </div>

            {/* Location */}
            <div className="flex-1 max-w-md mx-4">
              <button
                onClick={() => setShowLocationModal(true)}
                className="w-full text-left px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
              >
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span className="truncate">{currentLocation}</span>
                  <span className="ml-auto">▼</span>
                </div>
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4 relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setShowSearchSuggestions(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login/Account */}
            <div className="relative">
              {isLoggedIn ? (
                <button
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700"
                >
                  Account
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700"
                >
                  Login
                </button>
              )}

              {/* Account Dropdown */}
              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm text-gray-600 border-b">
                      +91 {userPhone}
                    </div>
                    <button
                      onClick={() => handleAccountMenuClick('MY_ORDERS')}
                      className="w-full text-left py-2 px-4 hover:bg-gray-50 text-sm"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => handleAccountMenuClick('SAVED_ADDRESSES')}
                      className="w-full text-left py-2 px-4 hover:bg-gray-50 text-sm"
                    >
                      Saved Addresses
                    </button>
                    <button
                      onClick={() => handleAccountMenuClick('E_GIFT_CARDS')}
                      className="w-full text-left py-2 px-4 hover:bg-gray-50 text-sm"
                    >
                      E-Gift Cards
                    </button>
                    <button
                      onClick={() => handleAccountMenuClick('FAQS')}
                      className="w-full text-left py-2 px-4 hover:bg-gray-50 text-sm"
                    >
                      FAQs
                    </button>
                    <button
                      onClick={() => handleAccountMenuClick('ACCOUNT_PRIVACY')}
                      className="w-full text-left py-2 px-4 hover:bg-gray-50 text-sm"
                    >
                      Account &amp; Privacy
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-4 hover:bg-gray-50 text-red-600 text-sm"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="ml-4 relative">
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
              <p className="text-gray-600 mb-4">Enter your delivery location</p>
              <input
                type="text"
                placeholder="Enter your address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <button
                onClick={() => setShowLocationModal(false)}
                className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
              >
                Confirm Location
              </button>
            </div>
          </div>
        )}

        {/* Home View */}
        {view === 'HOME' && (
          <div>
            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.name)
                      setView('CATEGORY')
                    }}
                    className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium text-gray-700">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
                </h2>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                        )}
                      </div>
                      {product.discount && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{product.discount}% OFF</span>
                      )}
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
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">{selectedCategory}</h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                    {product.discount && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{product.discount}% OFF</span>
                    )}
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
                      <div className="flex justify-between">
                        <span>Handling Fee</span>
                        <span>₹10</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{cartTotal + 50}</span>
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
              <div>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-bold mb-4">Delivery Address</h3>
                  <button
                    onClick={() => setShowAddressInput(true)}
                    className="w-full border-2 border-dashed border-gray-300 p-6 text-center text-gray-600 hover:border-pink-500 hover:text-pink-500"
                  >
                    + Add New Address
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="radio" name="payment" value="cod" defaultChecked className="mr-3" />
                      <span>Cash on Delivery</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="payment" value="upi" className="mr-3" />
                      <span>UPI</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="payment" value="card" className="mr-3" />
                      <span>Credit/Debit Card</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
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
                    <div className="flex justify-between">
                      <span>Handling Fee</span>
                      <span>₹10</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{cartTotal + 50}</span>
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
            <div className="bg-white rounded-lg p-6">
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
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-600">No saved addresses yet.</p>
            </div>
          </div>
        )}

        {view === 'E_GIFT_CARDS' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">E-Gift Cards</h1>
            </div>
            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-600">Gift cards coming soon!</p>
            </div>
          </div>
        )}

        {view === 'FAQS' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">FAQ's</h1>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">How fast is delivery?</h4>
                  <p className="text-gray-600">We deliver groceries in 10 minutes!</p>
                </div>
                <div>
                  <h4 className="font-semibold">What payment methods do you accept?</h4>
                  <p className="text-gray-600">We accept all major credit cards, UPI, and cash on delivery.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'ACCOUNT_PRIVACY' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold">Account Privacy</h1>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold mb-4">Privacy Settings</h3>
              <p className="text-gray-600">Manage your privacy settings here.</p>
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
