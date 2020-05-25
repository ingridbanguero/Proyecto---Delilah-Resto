const dbHost = "localhost";
const dbName = "delilah_resto";
const dbPort = "3306";
const dbUser = "root";
const dbpassword = "fernanda25"

const dbPath = `mysql://${dbUser}:${dbpassword}@${dbHost}:${dbPort}`;

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbPath);

// QUERIES

// CRTEATE SCHEMME
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
        adress VARCHAR(60) NOT NULL,
        email VARCHAR(60) NOT NULL,
        phone_number VARCHAR(60) NOT NULL,
        is_admin TINYINT UNSIGNED NOT NULL,
        PRIMARY KEY (user_id)
    );`
}

// PRODUCTS TABLE
function productsTable(){
    return `CREATE TABLE ${dbName}.products (
        product_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        product_name VARCHAR(45) NOT NULL,
        product_price VARCHAR(45) NOT NULL,
        product_photo VARCHAR(400) NOT NULL,
        PRIMARY KEY (product_id)
    );`
}


(async() =>{
    try{
        await sequelize.query(createDatabase(), {raw: true});
        await sequelize.query(usersTable(), {raw: true});
        await sequelize.query(productsTable(), {raw: true});
    } catch (err){
        throw new Error(err);
    }
})();