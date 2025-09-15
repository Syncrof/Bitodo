module.exports = function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Unexpected error';
  res.status(err.status || 500).json({ error: { code, message } });
};
