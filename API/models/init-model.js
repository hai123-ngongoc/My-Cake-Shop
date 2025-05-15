const { sequelize, Sequelize } = require('./index');
const Product = require('./product');
const Category = require('./category');

const models = {
    Product: Product(sequelize),
    Category: Category(sequelize),
};

models.Product.associate = (models) => {
    models.Product.belongsTo(models.Category, {
        foreignKey: 'categorie_id',
        as: 'category',
    });
};

models.Category.associate = (models) => {
    models.Category.hasMany(models.Product, {
        foreignKey: 'categorie_id',
    });
};

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });

module.exports = { db: sequelize, models };