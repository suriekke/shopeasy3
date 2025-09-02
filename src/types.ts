// Core Types
export interface Product {
  id: number
  name: string
  description: string
  price: number
  original_price?: number
  stock_quantity?: number
  stock: number
  category: string
  category_id?: string
  image_url?: string
  image?: string
  images?: string[]
  sku?: string
  details?: string[]
  reviews?: Review[]
  is_active?: boolean
  created_at?: string
  updated_at?: string
  unit?: string
  discount_percentage?: number
  is_featured?: boolean
  longDescription?: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  user_id?: string
  product_id?: string
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  email: string
  full_name?: string
  name?: string
  role: 'admin' | 'customer'
  phone?: string
  phoneNumber?: string
  avatar?: string
}

export interface UserProfile extends User {
  addresses: Address[]
  phone: string
  avatar: string
  preferences: UserPreferences
}

export interface UserPreferences {
  notifications: boolean
  marketing: boolean
  language: string
  currency: string
}

// Navigation Types
export type View = 'home' | 'products' | 'cart' | 'checkout' | 'profile' | 'orders' | 'wishlist' | 'HOME' | 'PROFILE' | 'ORDERS' | 'WISHLIST' | 'REFUNDS' | 'GIFT_CARDS' | 'SAVED_ADDRESSES' | 'REWARDS' | 'PAYMENT_MANAGEMENT' | 'SUGGEST_PRODUCTS' | 'NOTIFICATIONS' | 'GENERAL_INFO'

// Location & Address Types
export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
  deliveryTime?: string
}

export interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  zip?: string
  country: string
  isDefault: boolean
  type?: 'Home' | 'Work' | 'Other'
  line1?: string
}

// Order Types
export interface Order {
  id: number
  user_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  total: number
  subtotal: number
  shipping: number
  tax: number
  status: OrderStatus
  items: OrderItem[]
  shipping_address: string
  billing_address: string
  payment_status: PaymentStatus
  created_at: string
  updated_at: string
  date?: string
  estimatedDelivery?: string
}

export interface OrderItem {
  id?: string
  product_id: number
  product_name: string
  quantity: number
  price: number
  total: number
  image?: string
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed'

// Payment Types
export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  provider?: string
  expiry?: string
}

export type PaymentMethodType = 'card' | 'paypal' | 'bank' | 'Credit Card'

// Category Types
export interface Category {
  id: string
  name: string
  description: string
  image: string
  icon?: string
  productCount: number
  is_active?: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

// Review Types
export interface Review {
  id: string
  user_id: string
  product_id: number
  rating: number
  comment: string
  created_at: string
  user_name: string
  author?: string
  date?: string
}

// Notification Types
export interface Notification {
  id: string
  type: 'order' | 'promotion' | 'system'
  title: string
  message: string
  isRead: boolean
  read?: boolean
  created_at: string
  date?: string
}

// Reward Types
export interface Reward {
  id: string
  name: string
  description: string
  points: number
  discount: number
  expiryDate: string
  isActive: boolean
  title?: string
  code?: string
}

// Gift Card Types
export interface GiftCard {
  id: string
  code: string
  amount: number
  balance: number
  isActive: boolean
  expiryDate: string
  transactions?: any[]
}

// Refund Types
export interface Refund {
  id: string
  order_id: number
  amount: number
  reason: string
  status: 'Processing' | 'Completed'
  created_at: string
  orderId?: number
  date?: string
}

// Component Props Types
export interface HeaderProps {
  onLogin: () => void
  onLogout: () => void
  onCartClick: () => void
  cartItemCount: number
  onSupportClick: () => void
  onLocationClick: () => void
}

export interface BannerProps {
  title: string
  description: string
  imageUrl: string
  bgColor: string
  onOrderNow: () => void
}

export interface CategoryNavProps {
  categories: Category[]
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
}

export interface ProductGridProps {
  products: Product[]
  cartItems: CartItem[]
  wishlist: Product[]
  onAddToCart: (product: Product) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onToggleWishlist: (product: Product) => void
  onProductSelect: (product: Product) => void
}

export interface ProductDetailPageProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export interface ProfilePageProps {
  user: User | null
  onUpdateUser: (updates: Partial<User>) => void
  setView: (view: View) => void
  onOpenSupport: () => void
  onLogout: () => void
}

export interface OrderPageProps {
  orders: Order[]
  setView: (view: View) => void
}

export interface WishlistPageProps {
  wishlist: Product[]
  onAddToCart: (product: Product) => void
  onRemoveFromWishlist: (productId: number) => void
  setView: (view: View) => void
}

export interface CheckoutPageProps {
  cartItems: CartItem[]
  total: number
  setView: (view: View) => void
  location: string
  onLocationChange: () => void
  savedAddresses: string[]
  onSelectAddress: (address: string) => void
  onOrderPlaced: (orderData: any) => void
}

export interface OrderSuccessPageProps {
  setView: (view: View) => void
  paymentMethod: string
}

export interface GeneralInfoPageProps {
  setView: (view: View) => void
  onNavigateToInfo: (info: string) => void
}

export interface NotificationsPageProps {
  notifications: Notification[]
  setView: (view: View) => void
}

export interface SuggestProductsPageProps {
  setView: (view: View) => void
}

export interface PaymentManagementPageProps {
  methods: PaymentMethod[]
  setView: (view: View) => void
  onAddMethod: () => void
  onRemoveMethod: (id: string) => void
}

export interface RewardsPageProps {
  rewards: Reward[]
  setView: (view: View) => void
}

export interface SavedAddressesPageProps {
  addresses: Address[]
  setView: (view: View) => void
  onAddAddress: () => void
  onRemoveAddress: (id: string) => void
}

export interface RefundsPageProps {
  refunds: Refund[]
  setView: (view: View) => void
}

export interface GiftCardPageProps {
  giftCards: GiftCard[]
  setView: (view: View) => void
  onAddGiftCard: () => void
}

export interface FooterProps {
  onCategorySelect: (categoryName: string) => void
}

export interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: Location) => void
}

export interface CartProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (productId: number, quantity: number) => void
  total: number
  onCheckout: () => void
}

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => void
  onSignup: (email: string, password: string, fullName: string) => void
}

export interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}



