
const prisma = require('../lib/prisma');
const { hash, verify } = require('../lib/hash');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, COOKIE_NAME, NODE_ENV } = require('../lib/config');

const cookieOpts = {
  httpOnly: true,
  sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
  secure: NODE_ENV === 'production',
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email in use' });
    const passwordHash = await hash(password);
    const user = await prisma.user.create({ data: { email, name, passwordHash }});
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, cookieOpts);
    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }});
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await verify(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, cookieOpts);
    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) { next(e); }
};

exports.logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOpts, maxAge: 0 });
  return res.json({ message: 'ok' });
};

exports.me = async (req, res) => {
  // requireAuth sonrası req.user garanti
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id:true, email:true, name:true }});
  return res.json(user);
};
