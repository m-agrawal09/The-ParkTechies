const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Expect Bearer token
  if (!token) return res.status(401).json({ error: 'Auth token required' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId, role
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
