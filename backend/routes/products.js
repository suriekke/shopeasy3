const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken, requireAdmin, requireOwnership } = require('../middleware/auth');

const router = express.Router();

// Initialize Supabase client
const config = require('../config');
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// GET /api/products - Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { 
      category_id, 
      featured, 
      bestseller, 
      new_arrival, 
      search, 
      min_price, 
      max_price,
      sort_by = 'created_at',
      sort_order = 'desc',
      limit = 50,
      offset = 0
    } = req.query;

    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name, icon),
        product_reviews(rating, review_text, created_at)
      `);

    // Apply filters
    if (category_id) {
      query = query.eq('category_id', category_id);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    if (bestseller === 'true') {
      query = query.eq('is_bestseller', true);
    }
    if (new_arrival === 'true') {
      query = query.eq('is_new_arrival', true);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (min_price) {
      query = query.gte('price', parseFloat(min_price));
    }
    if (max_price) {
      query = query.lte('price', parseFloat(max_price));
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Calculate average ratings
    const productsWithRatings = data.map(product => {
      const reviews = product.product_reviews || [];
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;
      
      return {
        ...product,
        average_rating: Math.round(averageRating * 10) / 10,
        review_count: reviews.length
      };
    });

    res.json({
      success: true,
      data: productsWithRatings,
      count: productsWithRatings.length
    });

  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, icon),
        product_reviews(rating, review_text, created_at)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate average rating
    const reviews = data.product_reviews || [];
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    const productWithRating = {
      ...data,
      average_rating: Math.round(averageRating * 10) / 10,
      review_count: reviews.length
    };

    res.json({
      success: true,
      data: productWithRating
    });

  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products - Create new product (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const productData = req.body;

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();

    if (error) {
      console.error('Create Product Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({
      success: true,
      data: data[0],
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update Product Error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      data: data[0],
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete Product Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

