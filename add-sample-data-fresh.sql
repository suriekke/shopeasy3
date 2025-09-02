-- Add Sample Data to Fresh Database
-- Run this in your Supabase project SQL Editor

-- Add sample categories
INSERT INTO categories (name, description, icon, image_url, sort_order) VALUES
('Fruits & Vegetables', 'Fresh fruits and vegetables', '🥬', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop', 1),
('Dairy & Bakery', 'Milk, bread, and dairy products', '🥛', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', 2),
('Staples', 'Rice, dal, oil, and basic groceries', '🍚', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', 3),
('Snacks & Branded Foods', 'Chips, biscuits, and packaged foods', '🍿', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', 4),
('Beverages', 'Tea, coffee, juices, and soft drinks', '🥤', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop', 5),
('Personal Care', 'Soaps, shampoos, and personal hygiene', '🧴', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', 6),
('Home Care', 'Cleaning supplies and household items', '🧽', 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop', 7),
('Baby Care', 'Baby food, diapers, and baby products', '👶', 'https://images.unsplash.com/photo-1519689680058-324119c77d7b?w=400&h=300&fit=crop', 8);

-- Add sample products
INSERT INTO products (name, description, price, original_price, stock_quantity, category_id, image_url, unit, discount_percentage, is_featured) VALUES
-- Fruits & Vegetables
('Fresh Onions', 'Fresh onions from local farms', 40.00, 50.00, 50, (SELECT id FROM categories WHERE name = 'Fruits & Vegetables'), 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', '1 kg', 20, true),
('Fresh Tomatoes', 'Fresh red tomatoes', 30.00, 40.00, 40, (SELECT id FROM categories WHERE name = 'Fruits & Vegetables'), 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', '500 g', 25, true),
('Fresh Potatoes', 'Fresh potatoes for all your cooking needs', 25.00, 35.00, 60, (SELECT id FROM categories WHERE name = 'Fruits & Vegetables'), 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', '1 kg', 29, false),
('Fresh Carrots', 'Sweet and crunchy carrots', 35.00, 45.00, 30, (SELECT id FROM categories WHERE name = 'Fruits & Vegetables'), 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', '500 g', 22, false),

-- Dairy & Bakery
('Amul Full Cream Milk', 'Pure and fresh full cream milk', 60.00, 70.00, 30, (SELECT id FROM categories WHERE name = 'Dairy & Bakery'), 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', '1 L', 14, true),
('Britannia Brown Bread', 'Healthy brown bread', 35.00, 45.00, 25, (SELECT id FROM categories WHERE name = 'Dairy & Bakery'), 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', '400 g', 22, true),
('Amul Butter', 'Pure butter for your bread', 55.00, 65.00, 20, (SELECT id FROM categories WHERE name = 'Dairy & Bakery'), 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', '100 g', 15, false),
('Curd', 'Fresh homemade curd', 25.00, 30.00, 35, (SELECT id FROM categories WHERE name = 'Dairy & Bakery'), 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', '500 g', 17, false),

-- Staples
('Fortune Sunflower Oil', 'Pure sunflower oil for cooking', 120.00, 140.00, 20, (SELECT id FROM categories WHERE name = 'Staples'), 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', '1 L', 14, true),
('Basmati Rice', 'Premium basmati rice', 80.00, 100.00, 30, (SELECT id FROM categories WHERE name = 'Staples'), 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', '1 kg', 20, true),
('Toor Dal', 'Fresh toor dal', 45.00, 55.00, 25, (SELECT id FROM categories WHERE name = 'Staples'), 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', '500 g', 18, false),
('Sugar', 'Pure white sugar', 40.00, 50.00, 40, (SELECT id FROM categories WHERE name = 'Staples'), 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', '1 kg', 20, false),
('Salt', 'Iodized salt', 15.00, 20.00, 50, (SELECT id FROM categories WHERE name = 'Staples'), 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', '1 kg', 25, false),

-- Snacks & Branded Foods
('Lays Classic', 'Classic potato chips', 20.00, 25.00, 60, (SELECT id FROM categories WHERE name = 'Snacks & Branded Foods'), 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', '30 g', 20, true),
('Parle-G Biscuits', 'Glucose biscuits', 10.00, 12.00, 100, (SELECT id FROM categories WHERE name = 'Snacks & Branded Foods'), 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', '100 g', 17, true),
('Cadbury Dairy Milk', 'Chocolate bar', 50.00, 60.00, 40, (SELECT id FROM categories WHERE name = 'Snacks & Branded Foods'), 'https://images.unsplash.com/photo-1549007994-cb92aebf54f1?w=400&h=300&fit=crop', '80 g', 17, true),
('Kurkure', 'Spicy snack', 15.00, 20.00, 45, (SELECT id FROM categories WHERE name = 'Snacks & Branded Foods'), 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', '60 g', 25, false),
('Oreo Cookies', 'Chocolate sandwich cookies', 30.00, 40.00, 30, (SELECT id FROM categories WHERE name = 'Snacks & Branded Foods'), 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', '137 g', 25, false),

-- Beverages
('Tata Tea', 'Premium tea leaves', 45.00, 55.00, 35, (SELECT id FROM categories WHERE name = 'Beverages'), 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop', '250 g', 18, true),
('Nescafe Classic', 'Instant coffee', 35.00, 45.00, 25, (SELECT id FROM categories WHERE name = 'Beverages'), 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop', '50 g', 22, true),
('Coca Cola', 'Refreshing soft drink', 40.00, 50.00, 40, (SELECT id FROM categories WHERE name = 'Beverages'), 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop', '2 L', 20, false),
('Sprite', 'Lemon-lime soft drink', 35.00, 45.00, 30, (SELECT id FROM categories WHERE name = 'Beverages'), 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop', '2 L', 22, false),

-- Personal Care
('Dove Soap', 'Moisturizing soap bar', 25.00, 35.00, 40, (SELECT id FROM categories WHERE name = 'Personal Care'), 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', '75 g', 29, true),
('Head and Shoulders Shampoo', 'Anti-dandruff shampoo', 180.00, 220.00, 20, (SELECT id FROM categories WHERE name = 'Personal Care'), 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', '180 ml', 18, true),
('Colgate Toothpaste', 'Fresh mint toothpaste', 45.00, 55.00, 35, (SELECT id FROM categories WHERE name = 'Personal Care'), 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', '100 g', 18, false),
('Gillette Razor', 'Mens razor blades', 120.00, 150.00, 15, (SELECT id FROM categories WHERE name = 'Personal Care'), 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop', '4 blades', 20, false),

-- Home Care
('Surf Excel Liquid', 'Laundry detergent', 85.00, 105.00, 25, (SELECT id FROM categories WHERE name = 'Home Care'), 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop', '1 L', 19, true),
('Harpic Bathroom Cleaner', 'Bathroom cleaner', 65.00, 85.00, 20, (SELECT id FROM categories WHERE name = 'Home Care'), 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop', '1 L', 24, true),
('Scotch Brite Scrub Pad', 'Kitchen scrub pad', 15.00, 20.00, 30, (SELECT id FROM categories WHERE name = 'Home Care'), 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop', '3 pieces', 25, false),
('Good Knight Mosquito Repellent', 'Mosquito repellent', 45.00, 60.00, 15, (SELECT id FROM categories WHERE name = 'Home Care'), 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop', '45 ml', 25, false),

-- Baby Care
('Pampers Diapers', 'Baby diapers', 450.00, 550.00, 20, (SELECT id FROM categories WHERE name = 'Baby Care'), 'https://images.unsplash.com/photo-1519689680058-324119c77d7b?w=400&h=300&fit=crop', '30 pieces', 18, true),
('Cerelac Baby Food', 'Infant cereal', 120.00, 150.00, 25, (SELECT id FROM categories WHERE name = 'Baby Care'), 'https://images.unsplash.com/photo-1519689680058-324119c77d7b?w=400&h=300&fit=crop', '300 g', 20, true),
('Johnsons Baby Soap', 'Gentle baby soap', 35.00, 45.00, 30, (SELECT id FROM categories WHERE name = 'Baby Care'), 'https://images.unsplash.com/photo-1519689680058-324119c77d7b?w=400&h=300&fit=crop', '75 g', 22, false),
('Baby Oil', 'Baby massage oil', 85.00, 110.00, 15, (SELECT id FROM categories WHERE name = 'Baby Care'), 'https://images.unsplash.com/photo-1519689680058-324119c77d7b?w=400&h=300&fit=crop', '200 ml', 23, false);

-- Check if data was added successfully
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products' as table_name, COUNT(*) as count FROM products;

