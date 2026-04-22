const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secret_key";

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) return res.status(401).json({ error: "Access Denied. No Token Provided." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Access Denied. No user session." });
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access Denied. Insufficient permissions." });
    }
    
    next();
  };
};

module.exports = { verifyToken, verifyRole, JWT_SECRET };
