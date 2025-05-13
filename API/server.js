require('./bootstrap');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./app/route');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

app.use(router);

app.listen(port, '0.0.0.0', () => { // 0.0.0.0 khi vào internet thì phải cùng mạng, sau đó nhập mã của IPv4address thì sẽ chạy vd: (http://localhost:8080//...)
    console.log(`example app listening on port ${port}`)
});