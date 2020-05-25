const express = require("express");
const server = express();
const bodyParser = require('body-parser');
const CORS = require('cors');


const {
    createProduct,
    getProducts
} = require("./utilities/middlewares");

// START SERVER
server.use(bodyParser.json(), CORS());
server.listen(3000, ()=>{
    console.log("Servidor Iniciado")
})

// PRODUCTS ENDPOINTS
server.get("/products", getProducts, (req, res) =>{
    const {productList} = req;
    res.status(200).json(productList);
}) 

server.post("/products", createProduct, (req, res)=>{
    const {addProduct} = req;
    res.status(201).json(addProduct)
})