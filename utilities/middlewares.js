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
  async function getProductos(req, res, next) {
    try {
      req.productList = await listaProductos();
      next();
    } catch (err) {
      next(new Error(err));
    }
  }

  async function listaProductos() {
    const query = selectQuery("products");
    const [dbProductoos] = await sequelize.query(query, { raw: true });
    return dbProductoos;
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
        propiedadesModificadas[property] !== "null" &&
        propiedadesModificadas[property] !== "undefined" &&
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
  async function deleteProduct(req, res, next) {
    const id = +req.params.productId;
    try {
      const productToDelete = await encontrarProductoId(id);
      if (productToDelete) {
        const isDeleted = async () => {
          const query = deleteQuery("products", `product_id = ${id}`);
          await sequelize.query(query, { raw: true });
          return true;
        };
        req.isDeleted = await isDeleted();
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

  async function findUserByUsername(username) {
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
  async function getUsers(req, res, next) {
    try {
      req.usersList = await usersList();
      next();
    } catch (err) {
      next(new Error(err));
    }
  }

  async function findUserByName(name) {
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

  async function validateExistingUser(req, res, next) {
    const { name, username } = req.body;
    try {
      const existingUser = await findUserByName(name);
      if (!existingUser) {
        const dbUsers = await findUserByUsername(username);
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
  async function registerUser(req, res, next) {
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
    const userData = await findUserByUsername(username);
    if (userData) {
      const userId = userData.user_id;
      const orderTime = new Date().toLocaleTimeString();
      const [orderDesc, totalPrice] = await obtainOrderDescAndPrice(products);
      const addedOrder = await createOrderRegistry(
        orderTime,
        orderDesc,
        totalPrice,
        payment_method,
        userId
      );
      await createOrderRelationship(addedOrder, products);
      return await printOrderInfo(addedOrder);
    } else {
      res.status(400).json("User not found");
    }
  } else {
    res.status(405).json("Missing Arguments");
  }
}

async function completeDesc(orderInfo) {
  const order = orderInfo[0];
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

async function createOrder(req, res, next) {
  try {
    req.createdOrder = await addOrderInDb(req, res);
    next();
  } catch (err) {
    next(new Error(err));
  }
}

async function createOrderRegistry(
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
  const [addedRegistry] = await sequelize.query(query, { raw: true });
  return addedRegistry;
}

async function createOrderRelationship(orderId, products) {
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

async function deleteOrder(req, res, next) {
  const id = +req.params.orderId;
  try {
    const orderToDelete = await findOrderbyId(id);
    if (orderToDelete) {
      const query = deleteQuery("orders", `order_id = ${id}`);
      await sequelize.query(query, { raw: true });
      req.isDeleted = true;
      next();
    } else {
      res.status(404).json("Order not found");
    }
  } catch (err) {
    next(new Error(err));
  }
}

async function findOrderbyId(orderId) {
  const query = selectQuery("orders ", "*", `order_id = ${orderId}`);
  const [dbOrder] = await sequelize.query(query, { raw: true });
  const foundOrder = await dbOrder.find(
    (element) => element.order_id === orderId
  );
  return foundOrder;
}

async function listOrders(req, res, next) {
  try {
    const ordersQuery = selectQuery("orders", "order_id");
    const [ordersIds] = await sequelize.query(ordersQuery, { raw: true });
    const detailedOrders = async () => {
      return Promise.all(
        ordersIds.map(async (order) => printOrderInfo(order.order_id))
      );
    };
    req.ordersList = await detailedOrders();
    next();
  } catch (err) {
    next(new Error(err));
  }
}

async function obtainOrderDescAndPrice(products) {
  let orderDescription = "";
  let subtotal = 0;
  for (let i = 0; i < products.length; i++) {
    orderDescription = orderDescription + (await printDescName(products[i]));
    subtotal = +subtotal + +(await encontrarPrecioProducto(products[i]));
  }
  return [orderDescription, subtotal];
}

async function printDescName(product) {
  const { productId, quantity } = product;
  const productName = (await encontrarProductoId(productId)).product_name;
  const productDesc = `${quantity}x${productName.slice(0, 5)} `;
  return productDesc;
}

async function printOrderInfo(orderId) {
  const ordersQuery = joinQuery(
    "orders",
    "orders.*, users.username, users.name ,users.address, users.email, users.phone_number",
    ["users ON orders.user_id = users.user_id"],
    `order_id = ${orderId}`
  );
  const [orderInfo] = await sequelize.query(ordersQuery, { raw: true });
  return completeDesc(orderInfo);
}

async function updateOrderStatus(req, res, next) {
  const id = +req.params.orderId;
  const { status } = req.body;
  const validStatus = validateStatus(status);
  if (validStatus) {
    try {
      console.log("Hola")
      const orderToUpdate = await findOrderbyId(id); 
      console.log("Adios");
      if (orderToUpdate) {
        const query = updateQuery(
          "orders",
          `order_status = '${status}'`,
          `order_id = ${id}`
        );
        console.log(query)
        await sequelize.query(query, { raw: true });
        req.updatedOrder = await findOrderbyId(id);
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

function validateStatus(submittedStatus) {
  const validStatus = [
    "new",
    "confirmed",
    "preparing",
    "delivering",
    "delivered",
  ];
  const existingStatus = validStatus.find(
    (status) => status === submittedStatus
  );
  return existingStatus;
}

  module.exports = {
    getUsers,
    validateExistingUser,
    aplicarCambioProducto,
    crearProducto,
    deleteProduct,
    encontrarProductoId,
    encontrarPrecioProducto,
    getProductos,
    nuevoProducto,
    registerUser,
    modificarProducto,
    modificarProductoDb,
    findUserByUsername,
    completeDesc,
    createOrder,
    deleteOrder,
    listOrders,
    updateOrderStatus,
  };