const JWT = require('jsonwebtoken');
const firma = "delilah";

const { encontrarUsuarioPorNombreUsuario } = require("../utilities/middlewares");

function validarAuth(req, res, next) {
    const token = req.headers.authorization;
    const validatedUser = JWT.verify(token, firma);
    const { is_admin } = validatedUser;
    if (is_admin) {
      req.is_admin = is_admin;
      next();
    } else {
      res.status(403).json("Acceso denegado");
    }
  }
  
  async function validarCredenciales(req, res, next) {
    const { username, password } = req.body;
    try {
      const registeredUser = await encontrarUsuarioPorNombreUsuario(username);
      if (registeredUser) {
        const { password: dbPassword, is_admin } = registeredUser;
        if (password === dbPassword) {
          const token = JWT.sign({ username, is_admin }, firma, {
            expiresIn: "50m",
          });
          req.jwtToken = token;
          next();
        } else {
          res.status(400).json("Wrong password");
        }
      } else {
        res.status(400).json("Invalid Username");
      }
    } catch (err) {
      next(new Error(err));
    }
  }
  
  module.exports = { validarAuth, validarCredenciales };