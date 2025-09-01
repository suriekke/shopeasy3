-- Enhanced Sample Data with Reviews, Details, and Advanced Features
-- Run this in your Supabase project SQL Editor after running the enhanced schema

-- Add sample categories
INSERT INTO categories (name, description, icon, image_url, banner_image, sort_order) VALUES
('Fruits & Vegetables', 'Fresh fruits and vegetables from local farms', '🥬', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop', 1),
('Dairy & Bakery', 'Fresh milk, bread, and dairy products', '🥛', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&h=400&fit=crop', 2),
('Staples', 'Rice, dal, oil, and basic groceries', '🍚', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&h=400&fit=crop', 3),
('Snacks & Branded Foods', 'Chips, biscuits, and packaged foods', '🍿', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=400&fit=crop', 4),
('Beverages', 'Tea, coffee, juices, and soft drinks', '🥤', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=1200&h=400&fit=crop', 5),
('Personal Care', 'Soaps, shampoos, and personal hygiene', '🧴', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&h=400&fit=crop', 6),
('Home Care', 'Cleaning supplies and household items', '🧽', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&h=400&fit=crop', 7),
('Baby Care', 'Baby food, diapers, and baby products', '👶', 'https://images.unsplash.com/photo-1519689680058-324119c77d7b?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1519689680058-324119c77d7b?w=1200&h=400&fit=crop', 8)
ON CONFLICT (name) DO NOTHING;

-- Add sample products with enhanced details
INSERT INTO products (name, description, short_description, price, original_price, stock_quantity, category_id, image_url, gallery_images, unit, weight, dimensions, discount_percentage, is_featured, is_bestseller, is_new_arrival, brand, sku, barcode) VALUES
-- Fruits & Vegetables
('Fresh Onions', 'Premium quality fresh onions sourced from local farms. Perfect for all your cooking needs.', 'Fresh onions from local farms', 40.00, 60.00, 50, (SELECT id FROM categories WHERE name = 'Fruits & Vegetables'), 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop'], '1 kg', 1.0, '{"length": 10, "width": 8, "height": 5}', 33, true, true, false, 'Local Farm', 'ONION-001', '1234567890123'),
('Fresh Tomatoes', 'Sweet and juicy red tomatoes, perfect for salads and cooking.', 'Fresh red tomatoes', 30.00, 45.00, 40, (SELECT id FROM categories WHERE name = 'Fruits & Vegetables'), 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop'], '500 g', 0.5, '{"length": 8, "width": 6, "height": 4}', 33, true, true, false, 'Organic Valley', 'TOMATO-001', '1234567890124'),
('Fresh Potatoes', 'Fresh potatoes perfect for all your cooking needs.', 'Fresh potatoes for cooking', 25.00, 35.00, 60, (SELECT id FROM categories WHERE name = 'Fruits & Vegetables'), 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop'], '1 kg', 1.0, '{"length": 12, "width": 10, "height": 6}', 29, false, false, true, 'Farm Fresh', 'POTATO-001', '1234567890125'),

-- Dairy & Bakery
('Amul Full Cream Milk', 'Pure and fresh full cream milk from Amul. Rich in calcium and protein.', 'Pure and fresh full cream milk', 60.00, 70.00, 30, (SELECT id FROM categories WHERE name = 'Dairy & Bakery'), 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop'], '1 L', 1.0, '{"length": 8, "width": 8, "height": 12}', 14, true, true, false, 'Amul', 'MILK-001', '1234567890126'),
('Britannia Brown Bread', 'Healthy brown bread rich in fiber and nutrients.', 'Healthy brown bread', 35.00, 45.00, 25, (SELECT id FROM categories WHERE name = 'Dairy & Bakery'), 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'], '400 g', 0.4, '{"length": 15, "width": 10, "height": 8}', 22, true, false, true, 'Britannia', 'BREAD-001', '1234567890127'),

-- Snacks & Branded Foods
('Lays Classic', 'Classic potato chips with perfect crunch and flavor.', 'Classic potato chips', 20.00, 25.00, 60, (SELECT id FROM categories WHERE name = 'Snacks & Branded Foods'), 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'], '30 g', 0.03, '{"length": 20, "width": 15, "height": 3}', 20, true, true, false, 'Lays', 'CHIPS-001', '1234567890128'),
('Cadbury Dairy Milk', 'Smooth and creamy chocolate bar.', 'Chocolate bar', 50.00, 60.00, 40, (SELECT id FROM categories WHERE name = 'Snacks & Branded Foods'), 'https://images.unsplash.com/photo-1549007994-cb92aebf54f1?w=400&h=300&fit=crop', ARRAY['https://images.unsplash.com/photo-1549007994-cb92aebf54f1?w=400&h=300&fit=crop'], '80 g', 0.08, '{"length": 18, "width": 8, "height": 2}', 17, true, true, false, 'Cadbury', 'CHOCO-001', '1234567890129')
ON CONFLICT (name) DO NOTHING;

-- Add product details
INSERT INTO product_details (product_id, long_description, specifications, ingredients, allergens, nutritional_info, storage_instructions, usage_instructions, country_of_origin, manufacturer) VALUES
((SELECT id FROM products WHERE name = 'Fresh Onions'), 
'Premium quality fresh onions sourced from local farms. These onions are carefully selected for their size, freshness, and flavor. Perfect for all your cooking needs including curries, salads, and garnishing. These onions have a strong, pungent flavor that enhances the taste of your dishes.',
'{"Color": "White to light brown", "Texture": "Firm and crisp", "Size": "Medium to large", "Freshness": "Harvested within 48 hours"}',
ARRAY['Onions', 'Natural preservatives'],
ARRAY['None'],
'{"Calories": "40 kcal", "Protein": "1.1g", "Carbohydrates": "9.3g", "Fiber": "1.7g", "Vitamin C": "7.4mg"}',
'Store in a cool, dry place. Keep away from direct sunlight. Can be stored in refrigerator for longer shelf life.',
'Peel the outer skin, wash thoroughly, and chop as required for your recipe.',
'India',
'Local Farm Cooperative'),

((SELECT id FROM products WHERE name = 'Amul Full Cream Milk'), 
'Pure and fresh full cream milk from Amul. This milk is pasteurized and homogenized to ensure safety and consistency. Rich in calcium, protein, and essential nutrients. Perfect for drinking, making tea/coffee, and cooking.',
'{"Fat Content": "6%", "Protein": "3.2g per 100ml", "Calcium": "120mg per 100ml", "Pasteurized": "Yes", "Homogenized": "Yes"}',
ARRAY['Milk', 'Vitamin D3', 'Vitamin A'],
ARRAY['Milk'],
'{"Calories": "66 kcal", "Protein": "3.2g", "Fat": "6g", "Carbohydrates": "4.8g", "Calcium": "120mg", "Vitamin D": "1.2mcg"}',
'Keep refrigerated at 2-4°C. Do not freeze. Consume within 2-3 days of opening.',
'Shake well before use. Can be consumed directly or used in cooking and beverages.',
'India',
'Amul Dairy')
ON CONFLICT DO NOTHING;

-- Add sample user profiles
INSERT INTO user_profiles (phone_number, full_name, email, profile_image, date_of_birth, gender) VALUES
('+918179688221', 'John Doe', 'john@example.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', '1990-05-15', 'male'),
('+919876543210', 'Jane Smith', 'jane@example.com', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop', '1988-12-20', 'female'),
('+919876543211', 'Mike Johnson', 'mike@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', '1992-08-10', 'male')
ON CONFLICT (phone_number) DO NOTHING;

-- Add product reviews
INSERT INTO product_reviews (product_id, user_id, rating, review_text, review_images, is_verified_purchase, helpful_votes) VALUES
((SELECT id FROM products WHERE name = 'Fresh Onions'), (SELECT id FROM user_profiles WHERE phone_number = '+918179688221'), 5, 'Excellent quality onions! Very fresh and flavorful. Perfect for cooking.', ARRAY['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop'], true, 12),
((SELECT id FROM products WHERE name = 'Fresh Onions'), (SELECT id FROM user_profiles WHERE phone_number = '+919876543210'), 4, 'Good quality onions, but a bit expensive. Taste is great though.', ARRAY[], true, 8),
((SELECT id FROM products WHERE name = 'Amul Full Cream Milk'), (SELECT id FROM user_profiles WHERE phone_number = '+918179688221'), 5, 'Best milk I have ever tasted! Rich and creamy. Highly recommended.', ARRAY['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop'], true, 15),
((SELECT id FROM products WHERE name = 'Amul Full Cream Milk'), (SELECT id FROM user_profiles WHERE phone_number = '+919876543211'), 4, 'Good quality milk. Fresh and tasty. Will buy again.', ARRAY[], true, 6),
((SELECT id FROM products WHERE name = 'Lays Classic'), (SELECT id FROM user_profiles WHERE phone_number = '+919876543210'), 5, 'Perfect crunch and flavor! My favorite snack.', ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop'], true, 20),
((SELECT id FROM products WHERE name = 'Cadbury Dairy Milk'), (SELECT id FROM user_profiles WHERE phone_number = '+918179688221'), 5, 'Smooth and creamy chocolate. Absolutely delicious!', ARRAY['https://images.unsplash.com/photo-1549007994-cb92aebf54f1?w=200&h=200&fit=crop'], true, 18)
ON CONFLICT DO NOTHING;

-- Check data
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Product Details' as table_name, COUNT(*) as count FROM product_details
UNION ALL
SELECT 'User Profiles' as table_name, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'Product Reviews' as table_name, COUNT(*) as count FROM product_reviews;
