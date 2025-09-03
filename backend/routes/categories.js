const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client
const config = require('../config');
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const { active, parent_id } = req.query;

    let query = supabase
      .from('categories')
      .select(`
        *,
        products(count)
      `)
      .order('sort_order', { ascending: true });

    // Apply filters
    if (active === 'true') {
      query = query.eq('is_active', true);
    }
    if (parent_id) {
      query = query.eq('parent_category_id', parent_id);
    } else {
      query = query.is('parent_category_id', null); // Only top-level categories
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Format the response
    const categoriesWithProductCount = data.map(category => ({
      ...category,
      product_count: category.products?.[0]?.count || 0
    }));

    res.json({
      success: true,
      data: categoriesWithProductCount,
      count: categoriesWithProductCount.length
    });

  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/categories/:id - Get single category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        products(count)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryWithProductCount = {
      ...data,
      product_count: data.products?.[0]?.count || 0
    };

    res.json({
      success: true,
      data: categoryWithProductCount
    });

  } catch (error) {
    console.error('Get Category Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/categories - Create new category
router.post('/', async (req, res) => {
  try {
    const categoryData = req.body;

    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select();

    if (error) {
      console.error('Create Category Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({
      success: true,
      data: data[0],
      message: 'Category created successfully'
    });

  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update Category Error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      success: true,
      data: data[0],
      message: 'Category updated successfully'
    });

  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (productsError) {
      console.error('Check Products Error:', productsError);
      return res.status(500).json({ error: productsError.message });
    }

    if (products && products.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing products' 
      });
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete Category Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
