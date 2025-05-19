const express = require('express');
const router = express.Router();

let upgrades = [];
let currentId = 1;


router.get('/upgrades', (req, res) => {
  res.json(upgrades);
});


router.get('/upgrades/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const upgrade = upgrades.find(u => u.id === id);

  if (!upgrade) {
    return res.status(404).json({ message: 'Апгрейд не знайдено.' });
  }

  res.json(upgrade);
});


router.post('/upgrades', (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: 'Невірні дані апгрейду.' });
  }

  const newUpgrade = {
    id: currentId++,
    name,
    description,
    price
  };

  upgrades.push(newUpgrade);
  res.status(201).json(newUpgrade);
});


router.put('/upgrades/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const upgrade = upgrades.find(u => u.id === id);

  if (!upgrade) {
    return res.status(404).json({ message: 'Апгрейд не знайдено.' });
  }

  const { name, description, price } = req.body;

  if (!name || !description || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: 'Невірні дані для оновлення.' });
  }

  upgrade.name = name;
  upgrade.description = description;
  upgrade.price = price;

  res.json({ message: 'Апгрейд оновлено.', upgrade });
});


router.delete('/upgrades/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = upgrades.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Апгрейд не знайдено.' });
  }

  upgrades.splice(index, 1);
  res.json({ message: 'Апгрейд видалено.' });
});

module.exports = router;
