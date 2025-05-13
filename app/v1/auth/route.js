const {Router} = require('express');
const {login, register} = require('./controller');

const route = new Router();

route.post(
    '/register',
    register,
);

route.post(
    '/login',
    login,
);

module.exports = route;