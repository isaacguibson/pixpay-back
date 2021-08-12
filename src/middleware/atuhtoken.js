const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send("Token de autenticação necessário");
    }
    try {
      const decoded = jwt.verify(token, config.SECRET);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Token inválido");
    }
    return next();
};

module.exports = verifyToken;