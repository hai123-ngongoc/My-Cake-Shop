const {Router} = require('express');
const {upload, view} = require('./controller');

const route = new Router();

route.get(
    '/presigned-upload-urls',
    upload,
);

route.get(
    '/presigned-view-urls',
    view,
);

module.exports = route;