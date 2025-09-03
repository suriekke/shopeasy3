const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');

const router = express.Router();

// Initialize Supabase client
const config = require('../config');
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// GET /api/auth - Root auth route for testing
router.get('/', (req, res) => {
  res.json({ 
    message: 'Auth routes are working!',
    available_endpoints: [
      'POST /api/auth/send-otp',
      'POST /api/auth/verify-otp',
      'POST /api/auth/login',
      'GET /api/auth/profile/:id',
      'PUT /api/auth/profile/:id',
      'GET /api/auth/orders/:user_id'
    ]
  });
});

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// GET /api/auth/send-otp - Test route (for browser testing)
router.get('/send-otp', (req, res) => {
  res.json({ 
    message: 'Send OTP endpoint is working!',
    method: 'POST',
    body_format: { phone_number: "string" },
    example: { phone_number: "+918179688221" }
  });
});

// POST /api/auth/send-otp - Send OTP to phone number
router.post('/send-otp', async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Format phone number for Twilio (add +91 if not present)
    const formattedPhone = phone_number.startsWith('+') ? phone_number : `+91${phone_number}`;

    // Send OTP via Twilio
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: formattedPhone,
        channel: 'sms'
      });

    res.json({
      success: true,
      message: 'OTP sent successfully',
      phone_number: formattedPhone
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ 
      error: 'Failed to send OTP',
      details: error.message 
    });
  }
});

// GET /api/auth/verify-otp - Test route (for browser testing)
router.get('/verify-otp', (req, res) => {
  res.json({ 
    message: 'Verify OTP endpoint is working!',
    method: 'POST',
    body_format: { 
      phone_number: "string",
      otp: "string"
    },
    example: { 
      phone_number: "+918179688221",
      otp: "123456"
    }
  });
});

// POST /api/auth/verify-otp - Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone_number, otp } = req.body;

    if (!phone_number || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    // Format phone number for Twilio
    const formattedPhone = phone_number.startsWith('+') ? phone_number : `+91${phone_number}`;

    // Verify OTP via Twilio
    const verificationCheck = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: formattedPhone,
        code: otp
      });

    if (verificationCheck.status === 'approved') {
      // OTP verified successfully
      // Check if user exists, create if not
      const { data: existingUser, error: checkError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', phone_number)
        .single();

      let userData;
      if (checkError && checkError.code !== 'PGRST116') {
        // User doesn't exist, create new user
        const { data: newUser, error: createError } = await supabase
          .from('user_profiles')
          .insert([{ 
            phone_number,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createError) {
          throw createError;
        }
        userData = newUser;
      } else {
        // User exists, just return the user data
        userData = existingUser;
      }

      res.json({
        success: true,
        message: 'OTP verified successfully',
        data: userData
      });

    } else {
      res.status(400).json({ 
        error: 'Invalid OTP',
        status: verificationCheck.status 
      });
    }

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ 
      error: 'Failed to verify OTP',
      details: error.message 
    });
  }
});

// POST /api/auth/login - User login with phone number (legacy, keep for backward compatibility)
router.post('/login', async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('phone_number', phone_number)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Check User Error:', checkError);
      return res.status(500).json({ error: checkError.message });
    }

    if (existingUser) {
      // User exists, return user data
      res.json({
        success: true,
        data: existingUser,
        message: 'Login successful'
      });
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('user_profiles')
        .insert([{ phone_number }])
        .select()
        .single();

      if (createError) {
        console.error('Create User Error:', createError);
        return res.status(500).json({ error: createError.message });
      }

      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
      });
    }

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/profile/:id - Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get Profile Error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/auth/profile/:id - Update user profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update Profile Error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (data && data.length > 0) {
      res.json({
        success: true,
        data: data[0],
        message: 'Profile updated successfully'
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/orders/:user_id - Get user orders
router.get('/orders/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(*)
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get Orders Error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      data: data,
      count: data.length
    });

  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
