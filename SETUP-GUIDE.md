# 🚀 ShopEasy Customer App - Complete Setup Guide

## 📋 **Prerequisites**
- Node.js 18+ installed
- Supabase account (free tier available)
- Vercel account (free tier available)
- GitHub account

## 🎯 **Step-by-Step Setup**

### **1. Supabase Project Setup**

#### **1.1 Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Choose organization
6. Enter project details:
   - **Name**: `shopeasy-customer`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
7. Click "Create new project"
8. Wait for project to be ready (2-3 minutes)

#### **1.2 Get Project Credentials**
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **1.3 Enable Phone Authentication**
1. Go to **Authentication** → **Settings**
2. Scroll to **Phone Auth**
3. Enable **Phone Auth**
4. Configure SMS provider:
   - **Provider**: Twilio (recommended)
   - **Account SID**: Your Twilio Account SID
   - **Auth Token**: Your Twilio Auth Token
   - **From Phone Number**: Your Twilio phone number
5. Click **Save**

#### **1.4 Set Up Database**
1. Go to **SQL Editor**
2. Copy and paste the contents of `database-schema.sql`
3. Click **Run**
4. Copy and paste the contents of `sample-data.sql`
5. Click **Run**

### **2. Environment Variables**

#### **2.1 Local Development**
1. Create `.env` file in `customer-app/` directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### **2.2 Vercel Deployment**
1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add these variables:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://your-project-id.supabase.co`
4. Add another variable:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `your-anon-key-here`

### **3. Local Development**

#### **3.1 Install Dependencies**
```bash
cd customer-app
npm install
```

#### **3.2 Start Development Server**
```bash
npm run dev
```
Visit: `http://localhost:3001`

### **4. Deploy to Vercel**

#### **4.1 Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `customer-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### **4.2 Add Environment Variables**
1. In Vercel project settings
2. Go to **Environment Variables**
3. Add the same variables as local development

#### **4.3 Deploy**
1. Click **Deploy**
2. Wait for build to complete
3. Your app will be live at: `https://your-project.vercel.app`

## 🔧 **Testing the Setup**

### **1. Test Authentication**
1. Open your deployed app
2. Click **Login**
3. Enter a phone number
4. Check if OTP is received
5. Enter OTP and verify login

### **2. Test Database**
1. After login, browse products
2. Add items to cart
3. Check if cart persists
4. Try searching products
5. Test category filtering

### **3. Test Orders**
1. Add items to cart
2. Proceed to checkout
3. Add delivery address
4. Place order
5. Check order history

## 📊 **Database Schema Overview**

### **Tables Created:**
- **`user_profiles`** - User account information
- **`categories`** - Product categories
- **`products`** - Product catalog
- **`user_addresses`** - Delivery addresses
- **`cart_items`** - Shopping cart
- **`orders`** - Customer orders
- **`order_items`** - Order details
- **`wishlist_items`** - User wishlist

### **Features Enabled:**
- ✅ **Row Level Security (RLS)** - Data protection
- ✅ **Real-time subscriptions** - Live updates
- ✅ **Phone authentication** - OTP login
- ✅ **Order management** - Complete order flow
- ✅ **Cart persistence** - Saved cart items
- ✅ **Address management** - Multiple addresses

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. OTP Not Received**
- Check Twilio configuration
- Verify phone number format (+91)
- Check Supabase logs

#### **2. Database Connection Error**
- Verify environment variables
- Check Supabase project status
- Ensure RLS policies are correct

#### **3. Build Errors**
- Check TypeScript errors
- Verify all dependencies installed
- Check Vite configuration

#### **4. Deployment Issues**
- Verify environment variables in Vercel
- Check build logs
- Ensure correct root directory

## 📞 **Support**

### **Useful Links:**
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)

### **Next Steps:**
1. **Payment Integration** - Add Stripe/Razorpay
2. **Push Notifications** - Order status updates
3. **Analytics** - User behavior tracking
4. **Admin Panel** - Product management
5. **Mobile App** - React Native version

---

## 🎉 **Congratulations!**

Your ShopEasy customer app is now fully set up with:
- ✅ **Real-time authentication**
- ✅ **Complete database**
- ✅ **Product catalog**
- ✅ **Shopping cart**
- ✅ **Order management**
- ✅ **Deployed to production**

**Your app is ready for customers!** 🚀
