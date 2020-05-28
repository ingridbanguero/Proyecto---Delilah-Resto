const {dbName} = require('./config');

// CREATE DATABASE
function createDatabase(){
    return `CREATE SCHEMA IF NOT EXISTS ${dbName}`
}

// USERS TABLE
function usersTable(){
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
function productsTable(){
    return `CREATE TABLE IF NOT EXISTS ${dbName}.products (
        product_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_name VARCHAR(45) NOT NULL,
        product_price VARCHAR(45) NOT NULL,
        product_photo VARCHAR(400) NOT NULL,
        PRIMARY KEY (product_id)
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
    createDatabase,
    usersTable,
    productsTable,
    useQuery,
    insertQuery,
    selectQuery,
    updateQuery,
    deleteQuery,
    joinQuery
}