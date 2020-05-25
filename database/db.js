const dbHost = "localhost";
const dbName = "delilah_resto";
const dbPort = "3306";
const dbUser = "root";
const dbpassword = "fernanda25"
const dbPath = `mysql://${dbUser}:${dbpassword}@${dbHost}:${dbPort}`;


const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbPath);

// QUERIES

// CREATE SCHEMME
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
const csv = require("csv-parser");
const fs = require("fs");
const getStream = require("get-stream");

// UPDATE

// DELETE

// ADD PRODUCTS TO DATABASE
const productsData = async () => {
    const parseStream = csv({ delimiter: "," });
    const data = await getStream.array(
      fs.createReadStream("./database/datasets/products.csv").pipe(parseStream)
    );
    return data;
  };
  
const productsUpload = async () => {
    const dataToUpload = await productsData();
    await sequelize.query(useQuery(), { raw: true });
    for (let i = 0; i < dataToUpload.length; i++) {
        try {
        const { product_name, product_price, product_photo } = dataToUpload[i];
        const query = insertQuery(
            "products",
            "product_name, product_price, product_photo",
            [product_name, product_price, product_photo]
        );
        await sequelize.query(query, { raw: true });
        } catch (err) {
        throw new Error(err);
        }
    }
};

// ADD USERS TO DATABASE
const usersData = async () => {
    const parseStream = csv({ delimiter: "," });
    const data = await getStream.array(
      fs.createReadStream("./database/datasets/users.csv").pipe(parseStream)
    );
    return data;
  };
  
const usersUpload = async () => {
    const dataToUpload = await usersData();
    await sequelize.query(useQuery(), { raw: true });
    for (let i = 0; i < dataToUpload.length; i++) {
        try {
        const { username, password, name, address, email, phone_number, is_admin } = dataToUpload[i];
        const query = insertQuery(
            "users",
            "username, password, name, address, email, phone_number, is_admin",
            [username, password, name, address, email, phone_number, is_admin]
        );
        await sequelize.query(query, { raw: true });
        } catch (err) {
        throw new Error(err);
        }
    }
};


(async() =>{
    try{
        await sequelize.query(createDatabase(), {raw: true});
        await sequelize.query(usersTable(), {raw: true});
        await sequelize.query(productsTable(), {raw: true});
        await usersUpload();
        await productsUpload();
        
    }catch (err){
        throw new Error(err);
    }
})();


