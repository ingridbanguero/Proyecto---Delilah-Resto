const express = require("express");
const server = express();
const bodyParser = require('body-parser');
const CORS = require('cors');


const {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
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

server.get("/products/:productId", getProducts, (req, res) =>{
    const {productList} = req;
    const productId = (req.params.productId - 1);
    res.status(200).json(productList[productId]);
}) // Falta verificacion de que exista el producto

server.post("/products", createProduct, (req, res)=>{
    const {addProduct} = req;
    res.status(201).json(addProduct);
})

server.put("/products/:productId", updateProduct, (req, res) => {
    const { updatedProduct } = req;
    res.status(202).json(updatedProduct);
});
  
server.delete("/products/:productId", deleteProduct, (req, res) => {
    const { isDeleted } = req;
    isDeleted && res.status(200).json("Deleted");
});

// USERS ENDPOINTS
/*  server.get("/users/", validateAuth, getUsers, (req, res) => {
    const { usersList } = req;
    res.status(200).json(usersList);
  });
  
  server.post("/users/register", validateExistingUser, registerUser, (req, res) => {
    const { createdUserId } = req;
    res.status(201).json({ userId: createdUserId });
  });
  
  server.post("/users/login", validateCredentials, (req, res) => {
    const { jwtToken } = req;
    const loginResponse = { token: jwtToken };
    res.status(200).json(loginResponse);
  });  */

 
