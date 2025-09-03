const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client
const config = require('../config');
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// GET /api/cart - Get user's cart
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products(*)
      `)
      .eq('user_id', user_id);

    if (error) {
      console.error('Get Cart Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      data: data,
      count: data.length
    });

  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const { user_id, product_id, quantity = 1 } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check Cart Item Error:', checkError);
      return res.status(500).json({ error: checkError.message });
    }

    let result;
    if (existingItem) {
      // Update existing item
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('user_id', user_id)
        .eq('product_id', product_id)
        .select();

      if (error) {
        console.error('Update Cart Item Error:', error);
        return res.status(500).json({ error: error.message });
      }
      result = data[0];
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id, product_id, quantity }])
        .select();

      if (error) {
        console.error('Add Cart Item Error:', error);
        return res.status(500).json({ error: error.message });
      }
      result = data[0];
    }

    res.json({
      success: true,
      data: result,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cart - Update cart item quantity
router.put('/', async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || quantity === undefined) {
      return res.status(400).json({ error: 'User ID, Product ID, and Quantity are required' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user_id)
        .eq('product_id', product_id);

      if (error) {
        console.error('Remove Cart Item Error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.json({
        success: true,
        message: 'Item removed from cart'
      });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .select();

    if (error) {
      console.error('Update Cart Item Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      data: data[0],
      message: 'Cart item updated successfully'
    });

  } catch (error) {
    console.error('Update Cart Item Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart - Remove item from cart
router.delete('/', async (req, res) => {
  try {
    const { user_id, product_id } = req.query;

    if (!user_id || !product_id) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id)
      .eq('product_id', product_id);

    if (error) {
      console.error('Remove from Cart Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from Cart Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);

    if (error) {
      console.error('Clear Cart Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear Cart Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
