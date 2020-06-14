const {cargarUsuarios, cargarProductos} = require('./datasets');
const {
    crearDatabase,
    tablaUsuarios,
    tablaProductos,
    tablaOrdenes,
    tablaRelacionOrdenes,
} = require('./queries');
const {sequelize} = require('./config');

(async() =>{
    try{
        await sequelize.query(crearDatabase(), {raw: true});
        await sequelize.query(tablaUsuarios(), {raw: true});
        await sequelize.query(tablaProductos(), {raw: true});
        await sequelize.query(tablaOrdenes(), {raw: true});
        await sequelize.query(tablaRelacionOrdenes(), {raw: true});
        await cargarUsuarios();
        await cargarProductos();
        
    }catch (err){
        throw new Error(err);
    }
})();
