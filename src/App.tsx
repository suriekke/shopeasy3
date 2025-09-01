import React, { useState, useEffect } from 'react'

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
  name: string
  price: number
  quantity: number
  image: string
}

interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
}

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'PRODUCT_DETAIL' | 'PROFILE' | 'CART' | 'CHECKOUT'>('HOME')
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Load sample data
  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: 'Fresh Strawberries',
        description: 'Sweet and juicy strawberries',
        price: 4.99,
        stock: 50,
        category: 'Fruits & Vegetables',
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop'
      },
      {
        id: 2,
        name: 'Organic Honey',
        description: 'Pure organic honey',
        price: 8.99,
        stock: 25,
        category: 'Atta, Rice, Oil & Dals',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop'
      },
      {
        id: 3,
        name: 'Premium Coffee',
        description: 'Rich and aromatic coffee',
        price: 12.99,
        stock: 30,
        category: 'Zepto Cafe',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'
      },
      {
        id: 4,
        name: 'Fresh Milk',
        description: 'Farm fresh whole milk',
        price: 3.99,
        stock: 40,
        category: 'Dairy & Eggs',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'
      },
      {
        id: 5,
        name: 'Whole Grain Bread',
        description: 'Healthy whole grain bread',
        price: 2.99,
        stock: 35,
        category: 'Bakery',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
      },
      {
        id: 6,
        name: 'Organic Bananas',
        description: 'Sweet organic bananas',
        price: 1.99,
        stock: 60,
        category: 'Fruits & Vegetables',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop'
      }
    ])
    setLoading(false)
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

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Your original design */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap md:flex-nowrap gap-y-3 gap-x-4">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('HOME')}>
              <svg className="h-8 w-8 text-pink-600" viewBox="0 0 448 512" fill="currentColor">
                <path d="M352 160v-32C352 57.42 294.58 0 224 0S96 57.42 96 128v32H0v272c0 44.18 35.82 80 80 80h288c44.18 0 80-35.82 80-80V160h-96zM224 48c52.93 0 96 43.07 96 96v16H128v-16c0-52.93 43.07-96 96-96zm160 416H64c-17.64 0-32-14.36-32-32V192h384v240c0 17.64-14.36 32-32 32z"/>
              </svg>
              <h1 className="text-3xl font-bold text-pink-600 tracking-tighter">shopeasy</h1>
            </div>
            <div className="hidden md:flex items-center cursor-pointer group">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="ml-2">
                <p className="text-sm font-bold text-gray-800">Delivering in 10 mins</p>
                <p className="text-xs text-gray-500 group-hover:text-pink-600">Home - 42, Wallaby Way, Sydney</p>
              </div>
              <svg className="h-4 w-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="w-full md:flex-1 order-last md:order-none md:max-w-2xl">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full bg-gray-100 border border-gray-200 rounded-lg py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
            <button className="hidden sm:block text-gray-600 hover:text-pink-600">Support</button>
            <button className="hidden sm:block text-gray-600 hover:text-pink-600">Analytics</button>
            <button 
              className="flex items-center space-x-1 text-gray-600 hover:text-pink-600"
              onClick={() => isLoggedIn ? setView('PROFILE') : alert('Login functionality coming soon!')}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{isLoggedIn ? 'Profile' : 'Login'}</span>
            </button>
            <button 
              className="relative flex items-center bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200"
              onClick={() => setView('CART')}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span className="hidden sm:inline ml-2">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow">
        {view === 'HOME' && (
          <>
            {/* Banner - Your original design */}
            <div className="bg-green-100 text-gray-800 rounded-2xl p-8 mb-8 mx-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-4xl font-bold mb-4">Groceries in minutes?</h2>
                  <p className="text-xl mb-6">Get your essentials delivered to your doorstep faster than ever.</p>
                  <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                    Order Now
                  </button>
                </div>
                <div className="hidden md:block">
                  <div className="w-64 h-48 bg-green-200 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">🛒</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Navigation - Your original design */}
            <div className="mb-8 px-4">
              <div className="flex space-x-6 overflow-x-auto pb-4">
                {[
                  { name: 'All', icon: '🏠' },
                  { name: 'Fruits & Vegetables', icon: '🍓' },
                  { name: 'Atta, Rice, Oil & Dals', icon: '🍯' },
                  { name: 'Masala & Dry Fruits', icon: '☕' },
                  { name: 'Zepto Cafe', icon: '☕' },
                  { name: 'Sweet Cravings', icon: '🍰' },
                  { name: 'Toys & Sports', icon: '🎾' },
                  { name: 'Apparel & Lifestyle', icon: '👕' },
                  { name: 'Jewellery & Accessories', icon: '💍' }
                ].map((category) => (
                  <button 
                    key={category.name}
                    className={`flex flex-col items-center space-y-2 min-w-0 flex-shrink-0 ${
                      selectedCategory === category.name ? 'text-pink-600' : 'text-gray-700'
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectedCategory === category.name ? 'bg-pink-100' : 'bg-gray-100'
                    }`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid - Your original design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-pink-50">
                      <svg className="h-5 w-5 text-gray-400 hover:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-pink-600">${product.price}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'CART' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h2 className="text-3xl font-bold">Shopping Cart</h2>
            </div>
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
                <button 
                  onClick={() => setView('HOME')}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4 flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${item.price * item.quantity}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center text-xl font-bold mb-4">
                    <span>Total:</span>
                    <span>${getCartTotal()}</span>
                  </div>
                  <button 
                    onClick={() => setView('CHECKOUT')}
                    className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'CHECKOUT' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setView('CART')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Cart
              </button>
              <h2 className="text-3xl font-bold">Checkout</h2>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t">
                <span>Total:</span>
                <span>${getCartTotal()}</span>
              </div>
              <button 
                onClick={() => {
                  alert('Order placed successfully!')
                  setCartItems([])
                  setView('HOME')
                }}
                className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 mt-6"
              >
                Place Order
              </button>
            </div>
          </div>
        )}

        {view === 'PROFILE' && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setView('HOME')}
                className="text-gray-600 hover:text-pink-600 mr-4"
              >
                ← Back to Home
              </button>
              <h2 className="text-3xl font-bold">Profile</h2>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-bold mb-4">User Profile</h3>
              <p className="text-gray-600 mb-4">Profile functionality coming soon!</p>
              <button 
                onClick={() => {
                  setIsLoggedIn(false)
                  setUser(null)
                  setView('HOME')
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 ShopEasy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
