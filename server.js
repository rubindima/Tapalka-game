const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

let users = [];

function encodePassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken(email) {
    const timestamp = Date.now().toString();
    return crypto.createHash('sha256').update(email + timestamp).digest('hex');
}

app.post('/sign-up', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email та пароль обовʼязкові.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Пароль має бути не менше 8 символів.' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Користувач з таким email вже існує.' });
    }

    const hashedPassword = encodePassword(password);
    users.push({ email, password: hashedPassword });

    return res.status(201).json({ message: 'Реєстрація успішна!' });
});

app.post('/sign-in', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email та пароль обовʼязкові.' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Користувача не знайдено.' });
    }

    const hashedPassword = encodePassword(password);
    if (user.password !== hashedPassword) {
        return res.status(401).json({ error: 'Невірний пароль.' });
    }

    const token = generateToken(email);
    return res.status(200).json({ token });
});

let upgrades = [];
let nextId = 1;

function validateUpgrade(data) {
    const { name, description, price } = data;

    if (!name || !description || typeof name !== 'string' || typeof description !== 'string') {
        return 'Поле "name" та "description" обовʼязкові і мають бути рядками.';
    }

    if (name.trim() === '' || description.trim() === '') {
        return 'Поле "name" або "description" не може бути порожнім.';
    }

    if (typeof price !== 'number' || isNaN(price) || price < 0) {
        return 'Поле "price" має бути числом більше або дорівнювати 0.';
    }

    return null;
}

app.get('/upgrades', (req, res) => {
    res.json(upgrades);
});

app.get('/upgrades/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const upgrade = upgrades.find(u => u.id === id);

    if (!upgrade) {
        return res.status(404).json({ error: 'Апгрейд не знайдено.' });
    }

    res.json(upgrade);
});

app.post('/upgrades', (req, res) => {
    const error = validateUpgrade(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    const newUpgrade = {
        id: nextId++,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    };

    upgrades.push(newUpgrade);
    res.status(201).json(newUpgrade);
});

app.put('/upgrades/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const upgrade = upgrades.find(u => u.id === id);

    if (!upgrade) {
        return res.status(404).json({ error: 'Апгрейд не знайдено.' });
    }

    const error = validateUpgrade(req.body);
    if (error) {
        return res.status(400).json({ error });
    }

    upgrade.name = req.body.name;
    upgrade.description = req.body.description;
    upgrade.price = req.body.price;

    res.json(upgrade);
});

app.delete('/upgrades/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = upgrades.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Апгрейд не знайдено.' });
    }

    upgrades.splice(index, 1);
    res.json({ message: 'Апгрейд видалено.' });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
