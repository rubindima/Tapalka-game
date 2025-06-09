const express = require('express');
const router = express.Router();
const users = require('../data/users');

// POST /click
router.post('/click', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email обовʼязковий.' });

  const u = users.find(x => x.email === email);
  if (!u) return res.status(404).json({ message: 'Користувача не знайдено.' });

  u.balance += u.coinsPerClick;
  res.json({ balance: u.balance });
});

// POST /passive-income
router.post('/passive-income', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email обовʼязковий.' });

  const u = users.find(x => x.email === email);
  if (!u) return res.status(404).json({ message: 'Користувача не знайдено.' });

  u.balance += u.passiveIncomePerSecond;
  res.json({ balance: u.balance });
});

// GET /user/balance
router.get('/user/balance', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email обовʼязковий.' });

  const u = users.find(x => x.email === email);
  if (!u) return res.status(404).json({ message: 'Користувача не знайдено.' });

  res.json({
    balance: u.balance,
    coinsPerClick: u.coinsPerClick,
    passiveIncomePerSecond: u.passiveIncomePerSecond
  });
});

module.exports = router;
