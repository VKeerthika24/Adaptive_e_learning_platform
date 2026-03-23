const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await db.query(
    'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
    [fullName, email, hash]
  );

  res.json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [[user]] = await db.query('SELECT * FROM users WHERE email=?', [email]);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token, user: { id: user.id, name: user.full_name } });
};
