const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_super_secret_key'; // IMPORTANT: Use an environment variable in a real app

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = { id: decodedToken.userId }; // Attach user info to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;