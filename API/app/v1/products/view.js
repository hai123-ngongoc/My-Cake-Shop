const viewList = (res, products) => {
    res.json({
        items: (products || []).map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category ? product.category.name : null,
            quantity: product.quantity,
            imageSrc: product.imageSrc || './hinh_anh/banh2.jpg', 
        })),
    });
};

const viewItem = (res, product) => {
    res.json({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category ? product.category.name : null,
        quantity: product.quantity,
        imageSrc: product.imageSrc || './hinh_anh/banh2.jpg',
    });
};

module.exports = {
    viewList,
    viewItem,
};