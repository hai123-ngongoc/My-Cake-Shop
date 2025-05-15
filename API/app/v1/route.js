const {Router} = require('express');

const router = new Router();

router.use('/api/products', require('./products/route'));
router.use('/api/files', require('./files/route'));
router.use('/api/auth', require('./auth/route'));

module.exports = router;