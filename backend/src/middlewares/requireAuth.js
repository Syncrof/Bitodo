const jwt = require('jsonwebtoken');
const { JWT_SECRET, COOKIE_NAME } = require('../lib/config');

module.exports = (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
