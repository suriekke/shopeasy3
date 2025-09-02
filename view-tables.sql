-- View all tables in ShopEasy database
-- Run this in Supabase SQL Editor

-- Show all tables in the public schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Show table details with columns
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
    AND c.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position;

-- Count records in each table
SELECT 
    'user_profiles' as table_name,
    COUNT(*) as record_count
FROM user_profiles
UNION ALL
SELECT 
    'categories' as table_name,
    COUNT(*) as record_count
FROM categories
UNION ALL
SELECT 
    'products' as table_name,
    COUNT(*) as record_count
FROM products
UNION ALL
SELECT 
    'user_addresses' as table_name,
    COUNT(*) as record_count
FROM user_addresses
UNION ALL
SELECT 
    'orders' as table_name,
    COUNT(*) as record_count
FROM orders
UNION ALL
SELECT 
    'order_items' as table_name,
    COUNT(*) as record_count
FROM order_items
UNION ALL
SELECT 
    'cart_items' as table_name,
    COUNT(*) as record_count
FROM cart_items
UNION ALL
SELECT 
    'wishlist_items' as table_name,
    COUNT(*) as record_count
FROM wishlist_items;

