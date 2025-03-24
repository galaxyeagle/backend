const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Butta Books Restaurant 1 API' });
});

// Test Razorpay connection
app.get('/api/razorpay-test', async (req, res) => {
  try {
    const options = {
      amount: 50000, // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: "receipt_order_1",
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order,
      message: 'Razorpay is properly configured'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error testing Razorpay configuration',
      error: error.message
    });
  }
});

// Create order endpoint
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Razorpay configuration loaded');
}); 