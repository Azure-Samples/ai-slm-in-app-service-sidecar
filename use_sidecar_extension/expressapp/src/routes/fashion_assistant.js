const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const SLMService = require('../services/slm_service');

const slmService = new SLMService();

/**
 * GET /api/reactive-query
 * Process a query about a product and stream the response
 */
router.get('/reactive-query', async (req, res) => {
  try {
    const productId = parseInt(req.query.product_id);
    const message = req.query.message;

    if (!productId || !message) {
      return res.status(400).json({ error: 'Product ID and message are required' });
    }

    const product = Product.getProductById(productId);
    if (!product) {
      console.warn(`Product not found with ID: ${productId}`);
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create JSON payload
    const queryData = {
      user_message: message,
      product_name: product.name,
      product_description: product.description
    };

    const prompt = JSON.stringify(queryData);
    
    // Stream the response
    await slmService.streamChatCompletions(prompt, res);
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

module.exports = router;