const express = require('express');
const path = require('path');
const cors = require('cors');
const fashionAssistantRoutes = require('./routes/fashion_assistant');
const Product = require('./models/product');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', fashionAssistantRoutes);

// Default route for the frontend - render the EJS template with server-side loaded products
app.get('/', (req, res) => {
  try {
    const products = Product.getAllProducts();
    res.render('index', { 
      title: 'Fashion Store Assistant',
      products: products
    });
  } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).render('error', { error: 'Failed to load the application' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;