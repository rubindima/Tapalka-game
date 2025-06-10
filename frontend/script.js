const API = 'http://localhost:3000'; // бекенд адреса
let email = '';
const balanceEl = document.getElementById('balance');
const emailInput = document.getElementById('email');
const registerBtn = document.getElementById('registerBtn');
const clickBtn = document.getElementById('clickBtn');

// Реєстрація користувача
registerBtn.addEventListener('click', () => {
  email = emailInput.value.trim();
  if (!email) {
    alert('Введіть email');
    return;
  }

  fetch(`${API}/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Користувач вже існує') {
        alert('Користувач вже існує. Просто продовжуйте.');
      } else {
        alert('Успішна реєстрація!');
      }
      updateBalance();
    })
    .catch(() => alert('Помилка сервера'));
});

// Клік по кнопці
clickBtn.addEventListener('click', () => {
  if (!email) return alert('Спочатку зареєструйтесь');

  fetch(`${API}/click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      balanceEl.textContent = 'Баланс: ' + data.balance;
    });
});

// Пасивний дохід кожну секунду
setInterval(() => {
  if (!email) return;

  fetch(`${API}/passive-income`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      balanceEl.textContent = 'Баланс: ' + data.balance;
    });
}, 1000);

// Оновлення балансу при завантаженні
function updateBalance() {
  if (!email) return;
  fetch(`${API}/user/balance?email=${email}`)
    .then(res => res.json())
    .then(data => {
      balanceEl.textContent = 'Баланс: ' + data.balance;
    });
}
