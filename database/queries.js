const {dbName} = require('./config');

// CREATE DATABASE
function crearDatabase(){
    return `CREATE SCHEMA IF NOT EXISTS ${dbName}`
}

// USERS TABLE
function tablaUsuarios(){
    return `CREATE TABLE IF NOT EXISTS ${dbName}.users (
        user_id INT UNSIGNED AUTO_INCREMENT,
        username VARCHAR(60) NOT NULL,
        password VARCHAR(60) NOT NULL,
        name VARCHAR(60) NOT NULL,
        address VARCHAR(60) NOT NULL,
        email VARCHAR(60) NOT NULL,
        phone_number VARCHAR(60) NOT NULL,
        is_admin TINYINT UNSIGNED NOT NULL,
        PRIMARY KEY (user_id)
    );`
}

// PRODUCTS TABLE
function tablaProductos(){
    return `CREATE TABLE IF NOT EXISTS ${dbName}.products (
        product_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_name VARCHAR(45) NOT NULL,
        product_price VARCHAR(45) NOT NULL,
        product_photo VARCHAR(400) NOT NULL,
        PRIMARY KEY (product_id)
    );`
}

// ORDERS TABLE
function tablaOrdenes(){
  return `CREATE TABLE IF NOT EXISTS ${dbName}.orders (
    order_id int unsigned NOT NULL AUTO_INCREMENT,
    order_status enum('new','confirmed','preparing','delivering','delivered') NOT NULL DEFAULT 'new',
    order_time time NOT NULL,
    order_description varchar(45) NOT NULL,
    order_amount int unsigned NOT NULL,
    payment_method enum('cash','credit') NOT NULL,
    user_id int unsigned NOT NULL,
    PRIMARY KEY (order_id),
    KEY user_id_idx (user_id),
    CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users (user_id)
  );`
}

// ORDERS RELATIONSHIP TABLE QUERY
function tablaRelacionOrdenes() {
  return `CREATE TABLE IF NOT EXISTS ${dbName}.orders_products (
        relationship_id int unsigned NOT NULL AUTO_INCREMENT,
        order_id int unsigned NOT NULL,
        product_id int unsigned NOT NULL,
        product_quantity int unsigned NOT NULL,
        PRIMARY KEY (relationship_id),
        KEY order_id_idx (order_id),
        KEY product_id_idx (product_id),
        CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
        CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE RESTRICT
      );`
}
// USE
function useQuery(){
    const query = "USE " + dbName;
    return query;
}
// INSERT
function insertQuery(table, properties, values){
    const data = values.map((values) => `'${values}'`).join(",");
    const query = `INSERT INTO ${dbName}.${table} (${properties}) VALUES (${data})`
    return query;
}

// SELECT
function selectQuery(table, columns = "*", conditions = null){
    const query = `SELECT ${columns} FROM ${dbName}.${table}` +
                `${conditions ? `WHERE ${conditions}` : ""}`;
    return query;
}

//UPDATE
function updateQuery(table, changes, conditions) {
    const query =
      `UPDATE ${dbName}.${table} SET ${changes}` + `WHERE ${conditions}`;
    return query;
  }

//DELETE
function deleteQuery(table, conditions) {
  const query = `DELETE FROM ${dbName}.${table} `+  `WHERE ${conditions}`;
  return query;
}

// JOIN
function joinQuery(mainTable, columns, joiners, conditions) {
    const fullJoiners = joiners
      .map((element) => `JOIN ${dbName}.${element} `)
      .toString()
      .replace(/,/g, "");
    const query =
      `SELECT ${columns} FROM ${dbName}.${mainTable}` +
      ` ${fullJoiners}` +
      `${conditions ? ` WHERE ${conditions}` : ""}`;
    return query;
  }

module.exports = {
    crearDatabase,
    tablaUsuarios,
    tablaProductos,
    tablaOrdenes,
    tablaRelacionOrdenes,
    useQuery,
    insertQuery,
    selectQuery,
    updateQuery,
    deleteQuery,
    joinQuery
}