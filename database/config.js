const dbHost = "localhost";
const dbName = "delilah_resto";
const dbPort = "3306";
const dbUser = "root";
const dbpassword = ""
const dbPath = `mysql://${dbUser}:${dbpassword}@${dbHost}:${dbPort}`;


const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbPath);

module.exports = {
    dbName,
    sequelize
}