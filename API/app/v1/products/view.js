const viewList = (res, products) => {
    res.json({
        items: (products || []).map((product) => ({
            id: product.id,
            name: product.name,
            salesPrice: product.salesPrice,
        })),
    });
};

const viewItem = (res, product) => {
    res.json({
        id: product.id,
        name: product.name,
        salesPrice: product.salesPrice,
        quantity: product.quantity,
    });
};

module.exports = {
    viewList,
    viewItem
};