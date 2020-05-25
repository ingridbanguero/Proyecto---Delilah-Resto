const express = require("express");
const server = express();
const bodyParser = require('body-parser');
const CORS = require('cors');

const {
    getProducts,
    createProduct
} = require('./utilities/middlewares')


server.use(bodyParser.json(), CORS());
server.listen(3000, ()=>{
    console.log("Servidor Iniciado")
})


// PRODUCTS ENDPOINTS
server.get("/v1/products", getProducts, (req, res) => {
    const { productList } = req;
    res.status(200).json(productList);
  });
  
server.post("/v1/products", createProduct, (req, res) => {
const { addedProduct } = req;
res.status(201).json(addedProduct);
});