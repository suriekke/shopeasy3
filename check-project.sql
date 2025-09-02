-- Check your Supabase project details
-- Run this in Supabase SQL Editor

-- Show current database name
SELECT current_database() as database_name;

-- Show current user
SELECT current_user as current_user;

-- Show all schemas
SELECT schema_name 
FROM information_schema.schemata 
ORDER BY schema_name;

-- Show all tables in public schema
SELECT 
    table_name,
    table_type,
    table_catalog,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Show project URL (from settings)
-- This will be visible in your Supabase dashboard under Settings > API

