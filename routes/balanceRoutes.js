const express = require('express');
const router = express.Router();


let user = {
  email: 'default@example.com',
  balance: 0,
  coinsPerClick: 1,
  passiveIncomePerSecond: 1
};


 
router.post('/click', (req, res) => {
  try {
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено.' });
    }

    user.balance += user.coinsPerClick;
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.' });
  }
});


router.post('/passive-income', (req, res) => {
  try {
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено.' });
    }

    user.balance += user.passiveIncomePerSecond;
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера.' });
  }
});

router.get('/user/balance', (req, res) => {
  if (!user) {
    return res.status(404).json({ message: 'Користувача не знайдено.' });
  }

  res.json({
    balance: user.balance,
    coinsPerClick: user.coinsPerClick,
    passiveIncomePerSecond: user.passiveIncomePerSecond
  });
});

module.exports = router;
