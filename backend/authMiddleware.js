const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_super_secret_key'; // IMPORTANT: Use an environment variable in a real app

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // --- THIS IS THE FIX ---
    // The decoded token payload is { id: ..., email: ... }
    // We can just attach the whole decoded object to req.user.
    // The previous code was `req.user = { id: decodedToken.userId }`,
    // but the property name in the token is `id`, not `userId`.
    req.user = decodedToken; 

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;