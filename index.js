const express = require("express");
const server = express();
const bodyParser = require('body-parser');
const CORS = require('cors');


const {
    crearProducto,
    obtenerProductos,
    modificarProducto,
    borrarProducto,
    obtenerUsuarios,
    validarUsuarioExistente,
    usuarioRegistrado,
    crearOrden,
    listaOrdenes,
    modificarEstadoOrden,
    borrarOrden,
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
server.get("/products", obtenerProductos, (req, res) =>{
    const {productList} = req;
    res.status(200).json(productList);
}) 

server.get("/products/:productId", obtenerProductos, (req, res) =>{
    const {productList} = req;
    const productId = (req.params.productId - 1);
    res.status(200).json(productList[productId]);
})

server.post("/products", validarAuth, crearProducto, (req, res)=>{
    const {productoAgregado} = req;
    res.status(201).json(productoAgregado);
})

server.put("/products/:productId", validarAuth, modificarProducto, (req, res) => {
    const { productoModificado } = req;
    res.status(202).json(productoModificado);
});
  
server.delete("/products/:productId", validarAuth, borrarProducto, (req, res) => {
    const { esEliminado } = req;
    esEliminado && res.status(200).json("Deleted");
});

// USERS ENDPOINTS
server.get("/users/", validarAuth, obtenerUsuarios, (req, res) => {
    const { usersList } = req;
    res.status(200).json(usersList);
});

server.post("/users/register", validarUsuarioExistente, usuarioRegistrado, (req, res) => {
    const { createdUserId } = req;
    res.status(201).json({ userId: createdUserId });
});

server.post("/users/login", validarCredenciales, (req, res) => {
    const { jwtToken } = req;
    const loginResponse = { token: jwtToken };
    res.status(200).json(loginResponse);
}); 

// ORDERS ENDPOINTS
server.post("/orders/", crearOrden, (req, res) => {
    const { createdOrder } = req;
    res.status(201).json(createdOrder);
});

server.get("/orders/", validarAuth, listaOrdenes, (req, res) => {
    const { ordersList } = req;
    res.status(200).json(ordersList);
});

server.put("/orders/:orderId",validarAuth, modificarEstadoOrden, (req, res) => {
      const { ordenModificada } = req;
      res.status(202).json(ordenModificada);
});

server.delete("/orders/:orderId", validarAuth, borrarOrden, (req, res) => {
    const { esEliminado } = req;
    esEliminado && res.status(200).json("Deleted");
  });


