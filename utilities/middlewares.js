const {
    deleteQuery,
    insertQuery,
    selectQuery,
    updateQuery,
    joinQuery,
  } = require("../database/queries");
  
const {sequelize} = require("../database/config");

// PRODUCTS
  
  // GET PRODUCTS
  async function obtenerProductos(req, res, next) {
    try {
      req.productList = await listaProductos();
      next();
    } catch (err) {
      next(new Error(err));
    }
  }

  async function listaProductos() {
    const query = selectQuery("products");
    const [dbProductos] = await sequelize.query(query, { raw: true });
    return dbProductos;
  }

  // POST PRODUCTS
  
  async function crearProducto(req, res, next) {
    const { product_name, product_photo, product_price } = req.body;
    if (product_name && product_photo && product_price >= 0) {
      try {
        const productoCreado = await nuevoProducto(
          product_name,
          product_photo,
          product_price
        );
        req.productoAgregado = { productId: await productoCreado };
        next();
      } catch (err) {
        next(new Error(err));
      }
    } else {
      res.status(400).json("Missing Arguments");
    }
  }

  async function nuevoProducto(product_name, product_photo, product_price) {
    const query = insertQuery(
      "products",
      "product_name, product_photo, product_price",
      [product_name, product_photo, product_price]
    );
    const [productoAgregado] = await sequelize.query(query, { raw: true });
    return productoAgregado;
  }

  // UPDATE PRODUCTS
  async function modificarProducto(req, res, next) {
    const id = +req.params.productId;
    const propiedadesModificadas = req.body;
    try {
      const productoAModificar = await encontrarProductoId(id);
      if (productoAModificar) {
        const productoModificado = await aplicarCambioProducto(
          productoAModificar,
          propiedadesModificadas
        );
        const productoGuardado = await modificarProductoDb(id, productoModificado);
        req.productoModificado = productoGuardado;
        next();
      } else {
        res.status(404).json("Product not found");
      }
    } catch (err) {
      next(new Error(err));
    }
  }

 
  async function aplicarCambioProducto(productoAModificar, propiedadesModificadas) {
    const properties = Object.keys(propiedadesModificadas).filter(
      (property) =>
        propiedadesModificadas[property] &&
        propiedadesModificadas[property] !== " " &&
        propiedadesModificadas[property] !== "undefined" &&
        propiedadesModificadas[property] !== "null" &&
        !propiedadesModificadas[property].toString().includes("  ")
    );
    nuevasPropiedades = properties.reduce((obj, property) => {
      obj[property] = propiedadesModificadas[property];
      return obj;
    }, {});
    const productoModificado = { ...productoAModificar, ...nuevasPropiedades };
    return productoModificado;
  }

  async function modificarProductoDb(id, product) {
    const { product_name, product_photo, product_price } = product;
    const query = updateQuery(
      "products",
      `product_name = '${product_name}', product_photo = '${product_photo}', product_price = '${product_price}'`,
      `product_id = ${id}`
    );
    await sequelize.query(query, { raw: true });
    const dbProducto = await encontrarProductoId(id);
    return dbProducto;
  }

// DELETE PRODUCTS
  async function borrarProducto(req, res, next) {
    const id = +req.params.productId;
    try {
      const productoAEliminar = await encontrarProductoId(id);
      if (productoAEliminar) {
        const esEliminado = async () => {
          const query = deleteQuery("products", `product_id = ${id}`);
          await sequelize.query(query, { raw: true });
          return true;
        };
        req.esEliminado = await esEliminado();
        next();
      } else {
        res.status(404).json("Product not found");
      }
    } catch (err) {
      next(new Error(err));
    }
  }
  
  
  async function encontrarProductoId(id) {
    const query = selectQuery("products ", "*", `product_id = ${id}`);
    const [dbProducto] = await sequelize.query(query, { raw: true });
    const encontrarProducto = await dbProducto.find(
      (element) => element.product_id === id
    );
    return encontrarProducto;
  }
  
  async function encontrarPrecioProducto(product) {
    const { productId, quantity } = product;
    const productPrice = (await encontrarProductoId(productId)).product_price;
    const subtotal = `${+productPrice * +quantity}`;
    return subtotal;
  }
  // USERS

  async function encontrarUsuarioPorNombreUsuario(username) {
    const query = selectQuery(
      "users ",
      "user_id, username, password, is_admin",
      `username = '${username}'`
    );
    const [dbUser] = await sequelize.query(query, { raw: true });
    const foundUser = dbUser[0];
    return foundUser;
  }

  async function usersList() {
    const query = selectQuery("users ");
    const [dbUsers] = await sequelize.query(query, { raw: true });
    return dbUsers;
  }
  // GET USERS
  async function obtenerUsuarios(req, res, next) {
    try {
      req.usersList = await usersList();
      next();
    } catch (err) {
      next(new Error(err));
    }
  }

  async function encontrarUsuarioPorNombre(name) {
    const query = selectQuery(
      "users ",
      `name = '${name}'`
    );
    const [dbUser] = await sequelize.query(query, { raw: true });
    const existingUser = await dbUser.find(
      (element) =>
        element.name === name
    );
    return existingUser ? true : false;
  }

  async function validarUsuarioExistente(req, res, next) {
    const { name, username } = req.body;
    try {
      const existingUser = await encontrarUsuarioPorNombre(name);
      if (!existingUser) {
        const dbUsers = await encontrarUsuarioPorNombreUsuario(username);
        if (!dbUsers) {
          next();
        } else {
          res.status(409).json("Username already in use");
        }
      } else {
        res.status(409).json("User already exists");
      }
    } catch (err) {
      next(new Error(err));
    }
  }
  // REGISTER USER
  async function usuarioRegistrado(req, res, next) {
    const {username, password, name, address, email, phone_number, is_admin,} = req.body;
    if (username && password && name && address && email && phone_number) {
      try {
        const query = insertQuery(
          "users ",
          "username, password, name, address, email, phone_number, is_admin",
          [
            username,
            password,
            name,
            address,
            email,
            phone_number,
            is_admin,
          ]
        );
        [userId] = await sequelize.query(query, { raw: true });
        req.createdUserId = userId;
        next();
      } catch (err) {
        next(new Error(err));
      }
    } else {
      res.status(400).json("Missing Arguments");
    }
  }

// ORDERS

async function addOrderInDb(req, res) {
  const { username, products, payment_method } = req.body;
  console.log(req.body);
  if (username && products && payment_method) {
    const userData = await encontrarUsuarioPorNombreUsuario(username);
    if (userData) {
      const userId = userData.user_id;
      const orderTime = new Date().toLocaleTimeString();
      const [orderDesc, totalPrice] = await obtenerPrecioOrden(products);
      const addedOrder = await crearOrdenRegistry(
        orderTime,
        orderDesc,
        totalPrice,
        payment_method,
        userId
      );
      await crearRelacionOrdenes(addedOrder, products);
      return await imprimirInfoOrden(addedOrder);
    } else {
      res.status(400).json("User not found");
    }
  } else {
    res.status(405).json("Missing Arguments");
  }
}

async function completeDesc(informacionOrden) {
  const order = informacionOrden[0];
  const productsQuery = joinQuery(
    "orders_products",
    "orders_products.product_quantity, products.*",
    [`products ON orders_products.product_id = products.product_id`],
    `order_id = ${order.order_id}`
  );
  const [productsInfo] = await sequelize.query(productsQuery, {
    raw: true,
  });
  order.products = await productsInfo;
  return order;
}

async function crearOrden(req, res, next) {
  try {
    req.createdOrder = await addOrderInDb(req, res);
    next();
  } catch (err) {
    next(new Error(err));
  }
}

async function crearOrdenRegistry(
  orderTime,
  orderDescription,
  totalPrice,
  paymentMethod,
  user
) {
  const query = insertQuery(
    "orders",
    "order_time, order_description, order_amount, payment_method, user_id",
    [orderTime, orderDescription, totalPrice, paymentMethod, user]
  );
  const [añadirRegistro] = await sequelize.query(query, { raw: true });
  return añadirRegistro;
}

async function crearRelacionOrdenes(orderId, products) {
  products.forEach(async (product) => {
    const { productId, quantity } = product;
    const query = insertQuery(
      "orders_products",
      "order_id, product_id, product_quantity",
      [orderId, productId, quantity]
    );
    await sequelize.query(query, { raw: true });
  });
  return true;
}

async function borrarOrden(req, res, next) {
  const id = +req.params.orderId;
  try {
    const orderToDelete = await encontrarOrdenId(id);
    if (orderToDelete) {
      const query = deleteQuery("orders", `order_id = ${id}`);
      await sequelize.query(query, { raw: true });
      req.esEliminado = true;
      next();
    } else {
      res.status(404).json("Order not found");
    }
  } catch (err) {
    next(new Error(err));
  }
}

async function encontrarOrdenId(orderId) {
  const query = selectQuery("orders ", "*", `order_id = ${orderId}`);
  const [dbOrder] = await sequelize.query(query, { raw: true });
  const foundOrder = await dbOrder.find(
    (element) => element.order_id === orderId
  );
  return foundOrder;
}

async function listaOrdenes(req, res, next) {
  try {
    const ordersQuery = selectQuery("orders", "order_id");
    const [ordersIds] = await sequelize.query(ordersQuery, { raw: true });
    const detailedOrders = async () => {
      return Promise.all(
        ordersIds.map(async (order) => imprimirInfoOrden(order.order_id))
      );
    };
    req.ordersList = await detailedOrders();
    next();
  } catch (err) {
    next(new Error(err));
  }
}

async function obtenerPrecioOrden(products) {
  let orderDescription = "";
  let subtotal = 0;
  for (let i = 0; i < products.length; i++) {
    orderDescription = orderDescription + (await imprimirOrdenName(products[i]));
    subtotal = +subtotal + +(await encontrarPrecioProducto(products[i]));
  }
  return [orderDescription, subtotal];
}

async function imprimirOrdenName(product) {
  const { productId, quantity } = product;
  const nombreProducto = (await encontrarProductoId(productId)).product_name;
  const productDesc = `${quantity}x${nombreProducto.slice(0, 5)} `;
  return productDesc;
}

async function imprimirInfoOrden(orderId) {
  const ordersQuery = joinQuery(
    "orders",
    "orders.*, users.username, users.name ,users.address, users.email, users.phone_number",
    ["users ON orders.user_id = users.user_id"],
    `order_id = ${orderId}`
  );
  const [informacionOrden] = await sequelize.query(ordersQuery, { raw: true });
  return completeDesc(informacionOrden);
}

async function modificarEstadoOrden(req, res, next) {
  const id = +req.params.orderId;
  const { status } = req.body;
  const estadoValido = validarEstado(status);
  if (estadoValido) {
    try {
      console.log("Hola")
      const ordenAModificar = await encontrarOrdenId(id); 
      console.log("Adios");
      if (ordenAModificar) {
        const query = updateQuery(
          "orders",
          `order_status = '${status}'`,
          `order_id = ${id}`
        );
        console.log(query)
        await sequelize.query(query, { raw: true });
        req.ordenModificada = await encontrarOrdenId(id);
      } else {
        res.status(404).json("Order not found");
      }
      next();
    } catch (err) {
      next(new Error(err));
    }
  } else {
    res.status(405).json("Invalid status suplied");
  }
}

function validarEstado(estadoEnviado) {
  const estadoValido = [
    "new",
    "confirmed",
    "preparing",
    "delivering",
    "delivered",
  ];
  const estadoActual = estadoValido.find(
    (status) => status === estadoEnviado
  );
  return estadoActual;
}

  module.exports = {
    obtenerUsuarios,
    validarUsuarioExistente,
    aplicarCambioProducto,
    crearProducto,
    borrarProducto,
    encontrarProductoId,
    encontrarPrecioProducto,
    obtenerProductos,
    nuevoProducto,
    usuarioRegistrado,
    modificarProducto,
    modificarProductoDb,
    encontrarUsuarioPorNombreUsuario,
    completeDesc,
    crearOrden,
    borrarOrden,
    listaOrdenes,
    modificarEstadoOrden,
  };