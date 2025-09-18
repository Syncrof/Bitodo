const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;


exports.hash = async (password) => {
  if (!password || typeof password !== 'string') throw new Error('Geçersiz şifre');
  return await bcrypt.hash(password, SALT_ROUNDS);
};

exports.verify = async (password, hash) => {
  if (!password || typeof password !== 'string') return false;
  if (!hash || typeof hash !== 'string') return false;
  return await bcrypt.compare(password, hash);
};
