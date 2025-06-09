const express = require('express');
const router = express.Router();
const users = require('../data/users');
const { hashPassword, comparePasswords } = require('../utils/cryptoUtils');

// POST /sign-up
router.post('/sign-up', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email і пароль обовʼязкові.' });
  if (password.length < 8) return res.status(400).json({ message: 'Пароль мінімум 8 символів.' });
  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Користувач вже існує.' });

  const hashed = await hashPassword(password);
  users.push({ email, password: hashed, balance: 0, coinsPerClick: 1, passiveIncomePerSecond: 1 });
  res.status(201).json({ message: 'Реєстрація успішна!' });
});

// POST /sign-in
router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email і пароль обовʼязкові.' });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Невірний email або пароль.' });
  const ok = await comparePasswords(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Невірний email або пароль.' });

  res.status(200).json({ message: 'Успішний вхід!', user: { email: user.email } });
});

module.exports = router;
