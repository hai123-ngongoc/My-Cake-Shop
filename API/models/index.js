const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Sequelize } = require('sequelize');
const { database, username, password, host, port } = require('../config/database');

console.log('DB Config:', { database, username, password, host, port });
const sequelize = new Sequelize({
    dialect: 'mysql',
    database,
    username,
    password,
    host,
    port,
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to database established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = { sequelize, Sequelize };