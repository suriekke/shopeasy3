-- Check User Data in Database
-- Run this in your Supabase project SQL Editor

-- Check auth.users table (Supabase authentication)
SELECT 
    id,
    email,
    phone,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- Check user_profiles table (if it exists)
SELECT 
    id,
    phone_number,
    full_name,
    email,
    created_at,
    updated_at
FROM user_profiles
ORDER BY created_at DESC;

-- Check if user_profiles table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles'
) as user_profiles_exists;

-- Count total users
SELECT 'auth.users' as table_name, COUNT(*) as user_count FROM auth.users
UNION ALL
SELECT 'user_profiles' as table_name, COUNT(*) as user_count FROM user_profiles;

