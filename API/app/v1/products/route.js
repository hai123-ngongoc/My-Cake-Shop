const { Router } = require('express');
const { list, get, create, edit, remove } = require('./controller');

const route = new Router();

route.get('/', list);
route.get('/:id', get);
route.post('/', create);
route.put('/:id', edit);
route.delete('/:id', remove); 

module.exports = route;