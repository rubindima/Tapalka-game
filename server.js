const express = require('express');
const cors = require('cors');
const { encodePassword, generateToken } = require('./auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const users = [];

// POST /sign-up
app.post('/sign-up', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email і пароль обов’язкові.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Пароль має бути не менше 8 символів.' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Користувач з таким email вже існує.' });
    }

    const hashedPassword = encodePassword(password);
    users.push({ email, password: hashedPassword });

    return res.status(201).json({ message: 'Реєстрація успішна!' });
});

// POST /sign-in
app.post('/sign-in', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email і пароль обов’язкові.' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Невірний email або пароль.' });
    }

    const hashedPassword = encodePassword(password);
    if (user.password !== hashedPassword) {
        return res.status(401).json({ error: 'Невірний email або пароль.' });
    }

    const token = generateToken(email);
    return res.status(200).json({ token });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
