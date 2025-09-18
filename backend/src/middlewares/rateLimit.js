const rateLimit = {};
const WINDOW = 60 * 1000; // 1 dakika
const MAX_ATTEMPTS = 5;

module.exports = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  if (!rateLimit[ip]) rateLimit[ip] = [];
  rateLimit[ip] = rateLimit[ip].filter(ts => now - ts < WINDOW);
  if (rateLimit[ip].length >= MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }
  rateLimit[ip].push(now);
  next();
};
