-- Delete All Tables and Start Fresh
-- Run this in your Supabase project SQL Editor
-- WARNING: This will delete ALL data permanently!

-- Drop all tables in public schema
DROP TABLE IF EXISTS public.wishlist_items CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.user_addresses CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS update_user_addresses_updated_at ON public.user_addresses;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop extensions (optional - will be recreated)
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- Verify all tables are deleted
SELECT 'Tables remaining in public schema:' as message;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check auth.users (this should remain as it's managed by Supabase)
SELECT 'auth.users count:' as message, COUNT(*) as user_count FROM auth.users;
