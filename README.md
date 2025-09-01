# ShopEasy Customer App

A modern e-commerce application built with React, TypeScript, and Supabase for real-time authentication and data management.

## Features

- 🔐 **Real-time OTP Authentication** - Secure phone number verification with Supabase
- 🛒 **Shopping Cart** - Add, remove, and manage cart items
- 🔍 **Smart Search** - Product search with suggestions
- 📍 **Location Management** - Change delivery location
- 👤 **User Account** - Manage orders, addresses, and preferences
- 📱 **Responsive Design** - Works on all devices

## Setup Instructions

### 1. Supabase Setup

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Enable Phone Auth:**
   - Go to Authentication → Settings
   - Enable "Phone Auth"
   - Configure SMS provider (Twilio recommended)

3. **Environment Variables:**
   - Copy `env.example` to `.env`
   - Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Authentication Flow

1. **Send OTP:** User enters phone number → Supabase sends SMS
2. **Verify OTP:** User enters 6-digit code → Supabase verifies
3. **Session Management:** Automatic session persistence
4. **Logout:** Proper session cleanup

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables in Vercel

Add these in your Vercel project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Real-time)
- **Build Tool:** Vite
- **Deployment:** Vercel

## Project Structure

```
src/
├── App.tsx              # Main application component
├── lib/
│   └── supabase.ts      # Supabase client and auth helpers
├── components/          # Reusable components
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
