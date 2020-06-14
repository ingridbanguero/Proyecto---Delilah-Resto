const express = require("express");
const server = express();
const bodyParser = require('body-parser');
const CORS = require('cors');


const {
    crearProducto,
    getProductos,
    modificarProducto,
    deleteProduct,
    getUsers,
    validateExistingUser,
    registerUser,
    createOrder,
    listOrders,
    updateOrderStatus,
    deleteOrder,
} = require("./utilities/middlewares");

const { 
    validarAuth, 
    validarCredenciales 
} = require("./utilities/auth")

// START SERVER
server.use(bodyParser.json(), CORS());
server.listen(3000, ()=>{
    console.log("Servidor Iniciado")
})

// PRODUCTS ENDPOINTS
server.get("/products", getProductos, (req, res) =>{
    const {productList} = req;
    res.status(200).json(productList);
}) 

server.get("/products/:productId", getProductos, (req, res) =>{
    const {productList} = req;
    const productId = (req.params.productId - 1);
    res.status(200).json(productList[productId]);
}) // Falta verificacion de que exista el producto

server.post("/products", validarAuth, crearProducto, (req, res)=>{
    const {addProduct} = req;
    res.status(201).json(addProduct);
})

server.put("/products/:productId", validarAuth, modificarProducto, (req, res) => {
    const { updatedProduct } = req;
    res.status(202).json(updatedProduct);
});
  
server.delete("/products/:productId", validarAuth, deleteProduct, (req, res) => {
    const { isDeleted } = req;
    isDeleted && res.status(200).json("Deleted");
});

// USERS ENDPOINTS
server.get("/users/", validarAuth, getUsers, (req, res) => {
    const { usersList } = req;
    res.status(200).json(usersList);
});

server.post("/users/register", validateExistingUser, registerUser, (req, res) => {
    const { createdUserId } = req;
    res.status(201).json({ userId: createdUserId });
});

server.post("/users/login", validarCredenciales, (req, res) => {
    const { jwtToken } = req;
    const loginResponse = { token: jwtToken };
    res.status(200).json(loginResponse);
}); 

// ORDERS ENDPOINTS
server.post("/orders/", createOrder, (req, res) => {
    const { createdOrder } = req;
    res.status(201).json(createdOrder);
});

server.get("/orders/", validarAuth, listOrders, (req, res) => {
    const { ordersList } = req;
    res.status(200).json(ordersList);
});

server.put("/orders/:orderId",validarAuth, updateOrderStatus, (req, res) => {
      const { updatedOrder } = req;
      res.status(202).json(updatedOrder);
});

server.delete("/orders/:orderId", validarAuth, deleteOrder, (req, res) => {
    const { isDeleted } = req;
    isDeleted && res.status(200).json("Deleted");
  });


/* server.get("/orders/", validarAuth, listOrders, (req, res) => {
    const { ordersList } = req;
    res.status(200).json(ordersList);
  });
  
  server.post("/orders/", createOrder, (req, res) => {
    const { createdOrder } = req;
    res.status(201).json(createdOrder);
  });
  
  server.put(
    "/v1/orders/:orderId",
    validarAuth,
    updateOrderStatus,
    (req, res) => {
      const { updatedOrder } = req;
      res.status(202).json(updatedOrder);
    }
  );
  
  server.delete("/v1/orders/:orderId", validarAuth, deleteOrder, (req, res) => {
    const { isDeleted } = req;
    isDeleted && res.status(200).json("Deleted");
  }); */
