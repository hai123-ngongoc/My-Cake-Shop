
const { Router } = require('express');

const productsRouter = require('./v1/products/route');

const router = new Router();


router.use('/api/products', productsRouter);

router.use('/api/files', require('./files/route'));
router.use('/api/auth', require('./auth/route'));

router.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

module.exports = router;