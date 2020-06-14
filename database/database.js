const {usersUpload, productsUpload} = require('./datasets');
const {
    createDatabase,
    usersTable,
    productsTable,
    ordersTable,
    ordersRelationshipTable,
} = require('./queries');
const {sequelize} = require('./config');

(async() =>{
    try{
        await sequelize.query(createDatabase(), {raw: true});
        await sequelize.query(usersTable(), {raw: true});
        await sequelize.query(productsTable(), {raw: true});
        await sequelize.query(ordersTable(), {raw: true});
        await sequelize.query(ordersRelationshipTable(), {raw: true});
        await usersUpload();
        await productsUpload();
        
    }catch (err){
        throw new Error(err);
    }
})();
