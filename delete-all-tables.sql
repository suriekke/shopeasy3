-- Delete All Tables and Start Fresh
-- Run this in your Supabase project SQL Editor
-- WARNING: This will delete ALL data permanently!

-- First, let's see what tables actually exist
SELECT 'Current tables in public schema:' as message;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Drop tables only if they exist (using DO blocks to avoid errors)
DO $$ 
BEGIN
    -- Drop tables safely
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wishlist_items') THEN
        DROP TABLE public.wishlist_items CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cart_items') THEN
        DROP TABLE public.cart_items CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_items') THEN
        DROP TABLE public.order_items CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
        DROP TABLE public.orders CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_addresses') THEN
        DROP TABLE public.user_addresses CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
        DROP TABLE public.products CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
        DROP TABLE public.categories CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        DROP TABLE public.user_profiles CASCADE;
    END IF;
END $$;

-- Drop custom types if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_type WHERE typname = 'order_status') THEN
        DROP TYPE order_status CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM pg_type WHERE typname = 'payment_status') THEN
        DROP TYPE payment_status CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM pg_type WHERE typname = 'payment_method') THEN
        DROP TYPE payment_method CASCADE;
    END IF;
END $$;

-- Drop functions if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'generate_order_number') THEN
        DROP FUNCTION generate_order_number() CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP FUNCTION update_updated_at_column() CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'handle_new_user') THEN
        DROP FUNCTION handle_new_user() CASCADE;
    END IF;
END $$;

-- Verify all tables are deleted
SELECT 'Tables remaining in public schema after deletion:' as message;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check auth.users (this should remain as it's managed by Supabase)
SELECT 'auth.users count:' as message, COUNT(*) as user_count FROM auth.users;
