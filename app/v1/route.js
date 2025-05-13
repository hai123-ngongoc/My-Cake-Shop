const {Router} = require('express');

const router = new Router();

router.use('/products', require('./products/route'));
router.use('/files', require('./files/route'));
router.use('/auth', require('./auth/route'));

module.exports = router;
