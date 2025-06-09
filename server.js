const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------
// 1) AUTH (register + login)
// -------------------------
let users = [];

/**
 * Хешує пароль SHA-256
 */
function encodePassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Генерує токен (sha256 email+timestamp)
 */
function generateToken(email) {
    const timestamp = Date.now().toString();
    return crypto.createHash('sha256').update(email + timestamp).digest('hex');
}

// РЕЄСТРАЦІЯ
app.post('/sign-up', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email та пароль обовʼязкові.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Пароль має бути не менше 8 символів.' });
    }
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Користувач з таким email вже існує.' });
    }
    const hashed = encodePassword(password);
    users.push({ email, password: hashed, balance: 0, coinsPerClick: 1, passiveIncomePerSecond: 1 });
    return res.status(201).json({ message: 'Реєстрація успішна!' });
});

// ЛОГІН
app.post('/sign-in', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email та пароль обовʼязкові.' });
    }
    const user = users.find(u => u.email === email);
    if (!user || user.password !== encodePassword(password)) {
        return res.status(401).json({ error: 'Невірний email або пароль.' });
    }
    const token = generateToken(email);
    return res.status(200).json({ token });
});

// ------------------------------------
// 2) UPGRADES CRUD
// ------------------------------------
let upgrades = [];
let nextUpgradeId = 1;

function validateUpgrade(data) {
    const { name, description, price } = data;
    if (!name || !description ||
        typeof name !== 'string' || typeof description !== 'string' ||
        name.trim() === '' || description.trim() === '') {
        return 'Поля name та description обовʼязкові і не можуть бути порожніми.';
    }
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
        return 'Поле price має бути числом ≥ 0.';
    }
    return null;
}

// GET all
app.get('/upgrades', (req, res) => {
    res.json(upgrades);
});

// GET by id
app.get('/upgrades/:id', (req, res) => {
    const u = upgrades.find(x => x.id === +req.params.id);
    if (!u) return res.status(404).json({ error: 'Апгрейд не знайдено.' });
    res.json(u);
});

// CREATE
app.post('/upgrades', (req, res) => {
    const err = validateUpgrade(req.body);
    if (err) return res.status(400).json({ error: err });
    const newU = { id: nextUpgradeId++, ...req.body };
    upgrades.push(newU);
    res.status(201).json(newU);
});

// UPDATE
app.put('/upgrades/:id', (req, res) => {
    const u = upgrades.find(x => x.id === +req.params.id);
    if (!u) return res.status(404).json({ error: 'Апгрейд не знайдено.' });
    const err = validateUpgrade(req.body);
    if (err) return res.status(400).json({ error: err });
    Object.assign(u, req.body);
    res.json(u);
});

// DELETE
app.delete('/upgrades/:id', (req, res) => {
    const idx = upgrades.findIndex(x => x.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Апгрейд не знайдено.' });
    upgrades.splice(idx, 1);
    res.status(204).end();
});

// ------------------------------------
// 3) BALANCE (click + passive income)
// ------------------------------------
// Ми працюємо з тим самим масивом users, тому balance зберігається там

// POST /click
app.post('/click', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email обовʼязковий.' });
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    user.balance += user.coinsPerClick;
    return res.status(200).json({ balance: user.balance });
});

// POST /passive-income
app.post('/passive-income', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email обовʼязковий.' });
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    user.balance += user.passiveIncomePerSecond;
    return res.status(200).json({ balance: user.balance });
});

// GET /user/balance
app.get('/user/balance', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email обовʼязковий.' });
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено.' });
    return res.json({
        balance: user.balance,
        coinsPerClick: user.coinsPerClick,
        passiveIncomePerSecond: user.passiveIncomePerSecond
    });
});

// -------------------------
// Запуск сервера
// -------------------------
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
