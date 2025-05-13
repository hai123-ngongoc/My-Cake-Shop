const Product = require('../../../models/product');
const {viewList, viewItem} = require('./view');
const createError = require('http-errors');

const list = async (req, res, next) => {
    const products = await Product.findAll();

    return viewList(res, products);
};

const get = async (req, res, next) => {
    try {
        const {id} = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            throw createError(404, 'Product not found');
        }

        return viewItem(res, product);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const {name, salesPrice, quantity} = req.body || {};

        const product = await Product.create({
            name,
            salesPrice,
            quantity,
        });

        return res.status(201).json({id: product.id});
    } catch (error) {
        next(error);
    }
};

const edit = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {name, importPrice, salesPrice, quantity, barcode} = req.body;

        const product  = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }

        await product.update({name, importPrice, salesPrice, quantity, barcode});

        return res.status(200).json(product);
    } catch(error) {
        next(error);
    }
};

module.exports = {
    list,
    get,
    create,
    edit,
};