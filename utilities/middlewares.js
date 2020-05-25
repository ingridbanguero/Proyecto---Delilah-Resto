const {
    insertQuery,
    selectQuery,
} = require("../database/db");


// MIDDLEWARES

// Productos
/* async function getProducts(req, res, next){
    try{
        req.productList = await productList();
        next();
    } catch(err){
        next(new Error(err));
    }
}

async function productList(){
    const query = select("products");
    const [dbProducts] = await sequelize.query(query, {raw: true});
    return dbProducts;
} */

async function createProduct(req, res, next){
    const {product_name, product_photo, product_price} = req.body;
    if(product_name && product_photo && product_price >= 0){
        try{
            const createdProduct = await newProduct(
                product_name,
                product_photo,
                product_price
            );
            req.addProduct = {productId: await createdProduct};
            next();
        } catch(err){
            next(new Error(err));
        }
    } else {
        res.status(400).json("Missing Arguments");
    }
}

async function newProduct(product_name, product_photo, product_price){
    const query = insertQuery(
        "products", // Table
        "product_name, product_photo, product_price", // Properties
        [product_name, product_photo, product_price] // Values
    );
}

module.exports = {
    createProduct,
    newProduct
}