require('dotenv').config();
require('./bootstrap');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'web')));

app.get('/products', (req, res) => {
    res.redirect('/api/products');
});

app.get('/health-check', (req, res) => {
    res.status(200).send('OK');
});

const { models } = require('./models/init-model'); 
const productsController = require('./app/v1/products/controller');

app.get('/api/products', productsController.list);
app.get('/api/products/:id', productsController.get);
app.post('/api/products', productsController.create);
app.put('/api/products/:id', productsController.edit);
app.delete('/api/products/:id', productsController.remove);

app.get('/admin-products', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'web', 'admin-products.html'));
});

app.get('/admin-orders', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'web', 'admin-orders.html'));
});

app.get('/admin-customers', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'web', 'admin-customers.html'));
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`API available at http://localhost:${port}/api/products`);
});