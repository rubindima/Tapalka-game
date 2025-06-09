const express = require('express');
const router = express.Router();
const upgrades = require('../data/upgrades');

let nextId = upgrades.length ? Math.max(...upgrades.map(u=>u.id)) + 1 : 1;

// GET /upgrades
router.get('/upgrades', (req, res) => res.json(upgrades));

// GET /upgrades/:id
router.get('/upgrades/:id', (req, res) => {
  const u = upgrades.find(x => x.id === +req.params.id);
  if (!u) return res.status(404).json({ message: 'Апгрейд не знайдено.' });
  res.json(u);
});

// POST /upgrades
router.post('/upgrades', (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !description || typeof price !== 'number' || price < 0)
    return res.status(400).json({ message: 'Невірні дані.' });

  const newU = { id: nextId++, name, description, price };
  upgrades.push(newU);
  res.status(201).json(newU);
});

// PUT /upgrades/:id
router.put('/upgrades/:id', (req, res) => {
  const u = upgrades.find(x => x.id === +req.params.id);
  if (!u) return res.status(404).json({ message: 'Апгрейд не знайдено.' });

  const { name, description, price } = req.body;
  if (!name || !description || typeof price !== 'number' || price < 0)
    return res.status(400).json({ message: 'Невірні дані для оновлення.' });

  u.name = name; u.description = description; u.price = price;
  res.json(u);
});

// DELETE /upgrades/:id
router.delete('/upgrades/:id', (req, res) => {
  const idx = upgrades.findIndex(x => x.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Апгрейд не знайдено.' });
  upgrades.splice(idx, 1);
  res.status(204).end();
});

module.exports = router;
