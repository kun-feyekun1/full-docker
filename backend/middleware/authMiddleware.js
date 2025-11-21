
require('dotenv').config();
const jwt = require("jsonwebtoken");

const { User } = require("../models");

const JWT_SECRET = process.env.JWT_TOKEN_SECRET;

module.exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "role"],
    });
    
    if (!user) {
      return res.status(401).json({ message: "User not found or unauthorized" });
    }
    req.user = user;
    
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
