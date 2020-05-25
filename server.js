const express = require("express");
const server = express();
const bodyParser = require('body-parser');
const CORS = require('cors');

server.use(bodyParser.json(), CORS());
server.listen(3000, ()=>{
    console.log("Servidor Iniciado")
})

// PRODUCTS ENDPOINTS
