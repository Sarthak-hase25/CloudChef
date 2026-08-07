const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'cloudkitchen-ai-super-secret-key-2026'
      );

      // Attach user info to request
      req.user = decoded;

      next();
    } catch (error) {
      console.error('Not authorized, token failed');
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };
