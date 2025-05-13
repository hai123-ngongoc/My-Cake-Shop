const {Sequelize} = require('sequelize');
const {database, username, password, host, port} = require('../config/database');

const db = new Sequelize ({ //tạo một kết nối tới cơ sở dữ liệu bằng thư viện Sequelize,
    dialect: 'mysql',
    database,
    username,
    password,
    host,
    port,
});

module.exports = db;