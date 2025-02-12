const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Failed to authenticate token." });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userStatus = decoded.status;
    next();
  });
};

module.exports = verifyToken;
