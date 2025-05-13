require('./bootstrap');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./app/route');
const path = require('path');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', 'web')));

app.use(router);

app.get('/admin-products', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'web', 'admin-products.html'));
});

app.get('/admin-orders', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'web', 'admin-orders.html'));
});

app.get('/admin-customers', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'web', 'admin-customers.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`example app listening on port ${port}`);
});