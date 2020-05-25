const csv = require("csv-parser");
const fs = require("fs");
const getStream = require("get-stream");

const {useQuery, insertQuery, selectQuery} = require('./queries');
const {dbName, sequelize} = require('./config');
// ADD PRODUCTS TO DATABASE
const productsData = async () => {
    const parseStream = csv({ delimiter: "," });
    const data = await getStream.array(
      fs.createReadStream("./datasets/products.csv").pipe(parseStream)
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
      fs.createReadStream("./datasets/users.csv").pipe(parseStream)
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

module.exports = {
    usersUpload,
    productsUpload
}