// Zod validasyon middleware
module.exports = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    return res.status(422).json({ error: parsed.error.flatten() });
  }
  next();
};
