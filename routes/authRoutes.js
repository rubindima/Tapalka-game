const express = require('express');
const router = express.Router();
const { encodePassword, generateToken } = require('./cryptoUtils');


const users = [];


 
router.post('/sign-up', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email і пароль обовʼязкові.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Пароль має містити щонайменше 8 символів.' });
  }

  // Перевірка, чи користувач уже існує
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Користувач з таким email вже існує.' });
  }

  
  const hashedPassword = encodePassword(password);

  
  const newUser = {
    email,
    password: hashedPassword,
    balance: 0,
    coinsPerClick: 1,
    passiveIncomePerSecond: 1
  };

  users.push(newUser);

  return res.status(201).json({ message: 'Реєстрація успішна!' });
});


 */
router.post('/sign-in', (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email і пароль обовʼязкові.' });
  }

  const hashedPassword = encodePassword(password);

 
  const user = users.find(u => u.email === email && u.password === hashedPassword);

  if (!user) {
    return res.status(401).json({ message: 'Невірний email або пароль.' });
  }

  const token = generateToken(email);

  return res.status(200).json({ token });
});

module.exports = router;
