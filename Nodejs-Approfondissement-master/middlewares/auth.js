const UnauthorizedError = require("../errors/unauthorized")
const jwt = require("jsonwebtoken")
const config = require("../config")

module.exports = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"]
    if (!token) {
      throw "not token"
    }
    const decoded = jwt.verify(token, config.secretJwtToken)
    console.log("token :", decoded)
    req.user = {
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      id: decoded.id,
    };
    next();
  } catch (message) {
    console.error("erreur auth", message)
    next(new UnauthorizedError(message))
  }
};
