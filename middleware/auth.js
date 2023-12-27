const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token Provided");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username, nama, nrp, prodi, status } = decoded;
    req.user = { id, username, nama, nrp, prodi, status };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

module.exports = authenticationMiddleware;
