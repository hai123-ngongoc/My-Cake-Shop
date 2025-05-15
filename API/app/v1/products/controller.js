

const { models } = require('../../../models/init-model');
const Product = models.Product;
const Category = models.Category;
const { viewList, viewItem } = require('./view');
const createError = require('http-errors');


const logError = (error) => {
    console.error('Database Error:', error);
    if (error.sql) {
        console.error('SQL Query:', error.sql);
    }
    if (error.parent) {
        console.error('Parent Error:', error.parent);
    }
};

const list = async (req, res, next) => {
    try {
        console.log('Listing products from database...');
        
        const products = await Product.findAll({
            include: [{ model: Category, as: 'category' }],
            where: {
                deleted_at: null  
            }
        });

        console.log(`Found ${products.length} products`);
        return viewList(res, products);
    } catch (error) {
        logError(error);
        next(error);
    }
};

const get = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`Fetching product with ID: ${id}`);

        const product = await Product.findByPk(id, {
            include: [{ model: Category, as: 'category' }],
        });
        
        if (!product) {
            console.log(`Product with ID ${id} not found`);
            throw createError(404, 'Product not found');
        }

        return viewItem(res, product);
    } catch (error) {
        logError(error);
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const { name, price, description, quantity, category } = req.body || {};
        console.log('Tạo sản phẩm mới:', { name, category });

        if (!name || !category) {
            throw createError(400, 'Tên và danh mục là bắt buộc');
        }

        let categoryRecord = await Category.findOne({ where: { name: category } });
        if (!categoryRecord) {
            console.log(`Danh mục "${category}" không tìm thấy, đang tạo...`);
            categoryRecord = await Category.create({
                name: category,
                created_at: new Date(),
            });
        }

        const product = await Product.create({
            name,
            price: price || 0,
            description: description || '',
            quantity: quantity || 0,
            categorie_id: categoryRecord.id,
            created_at: new Date(),
        });

        console.log(`Sản phẩm được tạo với ID: ${product.id}`);
        return res.status(201).json({ id: product.id });
    } catch (error) {
        logError(error);
        return res.status(500).json({ 
            error: error.message || 'Không thể tạo sản phẩm',
            details: error.name === 'SequelizeValidationError' ? error.errors : null
        });
    }
};

const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description, quantity, category } = req.body;
    console.log(`Updating product with ID: ${id}`);

    const product = await Product.findByPk(id);
    if (!product) {
      console.log(`Product with ID ${id} not found for update`);
      return res.status(404).json({ error: 'Product not found' });
    }

    let categoryRecord = await Category.findOne({ where: { name: category } });
    if (!categoryRecord) {
      console.log(`Category "${category}" not found, creating it...`);
      categoryRecord = await Category.create({
        id: Math.floor(Date.now() / 1000),
        name: category,
        created_at: new Date()
      });
    }

    await product.update({
      name: name || product.name,
      price: price !== undefined ? price : product.price,
      description: description || product.description,
      quantity: quantity !== undefined ? quantity : product.quantity,
      categorie_id: categoryRecord.id,
      updated_at: new Date(),
    });

    console.log(`Product ${id} updated successfully`);
    return res.status(200).json(product);
  } catch (error) {
    logError(error);
    next(error);
  }
};

const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`Permanently deleting product with ID: ${id}`);

        const product = await Product.findByPk(id);
        if (!product) {
            console.log(`Product with ID ${id} not found for deletion`);
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.destroy(); 

        console.log(`Product ${id} permanently deleted`);
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        logError(error);
        next(error);
    }
};

module.exports = {
    list,
    get,
    create,
    edit,
    remove,
};