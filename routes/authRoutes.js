const express = require('express');
const router = express.Router();
const { hashPassword, comparePasswords } = require('../utils/cryptoUtils');
const users = require('../data/users');

// Реєстрація
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email і пароль обов’язкові.' });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'Користувач з таким email вже існує.' });
  }

  const hashedPassword = await hashPassword(password);

  users.push({
    email,
    password: hashedPassword,
    balance: 0,
    coinsPerClick: 1,
    passiveIncomePerSecond: 1
  });

  res.status(201).json({ message: 'Користувач зареєстрований успішно.' });
});

// Логін
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ message: 'Користувача не знайдено.' });
  }

  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Неправильний пароль.' });
  }

  res.status(200).json({ message: 'Успішний вхід.', user });
});

module.exports = router;
