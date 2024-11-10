// Аутентификация и обновление интерфейса
function login(username) {
    localStorage.setItem('username', username);
    updateUI();
}

function logout() {
    localStorage.removeItem('username');
    updateUI();
}

function updateUI() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('auth-status').textContent = `Добро пожаловать, ${username}`;
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
    } else {
        document.getElementById('auth-status').textContent = 'Вы не вошли';
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
    }
}

// Обработчики для кнопок "Войти" и "Выйти"
document.getElementById('login-btn').addEventListener('click', () => {
    const username = prompt('Введите ваше имя:');
    if (username) login(username);
});
document.getElementById('logout-btn').addEventListener('click', logout);

// Регистрация пользователя
document.getElementById('signup-submit').addEventListener('click', () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const phone = document.getElementById('signup-phone').value;

    if (validateForm(name, email, password, phone)) {
        localStorage.setItem('user', JSON.stringify({ name, email, password, phone }));
        alert('Регистрация прошла успешно!');
        showProfilePage();
    } else {
        alert('Ошибка: Проверьте введенные данные.');
    }
});

// Вход пользователя
document.getElementById('login-submit').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
        alert(`Добро пожаловать, ${storedUser.name}`);
        showProfilePage();
    } else {
        alert('Неправильный email или пароль.');
    }
});

// Показ профиля пользователя
function showProfilePage() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        document.body.innerHTML = `
            <h2>Профиль</h2>
            <p>Имя: ${storedUser.name}</p>
            <p>Email: ${storedUser.email}</p>
            <p>Телефон: ${storedUser.phone}</p>
            <button id="logout-btn" onclick="logout()">Выйти</button>
        `;
    }
}

// Валидация данных формы
function validateForm(name, email, password, phone) {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const phonePattern = /^\+?[0-9]{10,15}$/;

    return name && emailPattern.test(email) && passwordPattern.test(password) && phonePattern.test(phone);
}

// Настройка переключения темы
const themeToggleButton = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.toggle('night-theme', savedTheme === 'night');
}

themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('night-theme');
    const theme = document.body.classList.contains('night-theme') ? 'night' : 'day';
    localStorage.setItem('theme', theme);
});

// Фильтрация и сохранение выбранного фильтра
document.getElementById('filter-select').addEventListener('change', (event) => {
    const selectedFilter = event.target.value;
    localStorage.setItem('filter', selectedFilter);
    applyFilter(selectedFilter);
});

function applyFilter(filter) {
    const roomItems = document.querySelectorAll('.room-item');
    roomItems.forEach(item => {
        const roomType = item.getAttribute('data-type');
        item.style.display = (filter === 'all' || roomType === filter) ? 'block' : 'none';
    });
}

// Поиск номеров
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-bar').value.toLowerCase();
    localStorage.setItem('lastSearch', query);
    filterRooms(query);
});

function filterRooms(query) {
    const roomItems = document.querySelectorAll('.room-item');
    roomItems.forEach(item => {
        const roomText = item.textContent.toLowerCase();
        item.style.display = roomText.includes(query) ? 'block' : 'none';
    });
}

// Загрузка сохраненных настроек при старте
window.addEventListener('load', () => {
    const lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch) {
        document.getElementById('search-bar').value = lastSearch;
        filterRooms(lastSearch);
    }

    const savedFilter = localStorage.getItem('filter');
    if (savedFilter) {
        document.getElementById('filter-select').value = savedFilter;
        applyFilter(savedFilter);
    }

    updateUI();
});

// Обработчик для кнопок "Показать больше"
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', (event) => {
        const moreInfo = event.target.previousElementSibling;
        if (moreInfo.style.display === 'none' || moreInfo.style.display === '') {
            moreInfo.style.display = 'block';
            button.textContent = 'Скрыть';
        } else {
            moreInfo.style.display = 'none';
            button.textContent = 'Показать больше';
        }
    });
});

// Обработчик для звезд рейтинга
document.querySelectorAll('.star-rating .star').forEach((star, index, stars) => {
    star.addEventListener('click', () => {
        stars.forEach((s, i) => {
            s.classList.toggle('selected', i <= index);
        });
    });
});

// Обработчик отправки формы бронирования
document.getElementById('submit-btn').addEventListener('click', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const room = document.getElementById('room').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('http://localhost:5000/api/book-room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, room, message })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.success);
            checkRoomStatus(room);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error("Произошла ошибка при бронировании:", error);
        alert("Произошла ошибка при бронировании: " + error.message);
    }
});

// Функция для проверки статуса всех номеров
async function checkAllRoomStatuses() {
    const roomElements = document.querySelectorAll('.room-item');

    for (let roomElement of roomElements) {
        const roomType = roomElement.getAttribute('data-type');

        try {
            const response = await fetch(`http://localhost:5000/api/check-room-status?room=${roomType}`);
            const result = await response.json();

            if (response.ok && result.status === "Забронирован") {
                roomElement.querySelector('.read-more').textContent = "Забронирован";
                roomElement.classList.add('booked');
            }
        } catch (error) {
            console.error("Ошибка при проверке статуса номера:", error);
        }
    }
}

// Вызываем проверку статусов при загрузке страницы
window.addEventListener('load', checkAllRoomStatuses);
// Function to check room status for a specific room type
async function checkRoomStatus(roomType) {
    try {
        const response = await fetch(`http://localhost:5000/api/check-room-status?room=${roomType}`);
        const result = await response.json();

        if (response.ok) {
            alert(`Статус комнаты: ${result.status}`);
        } else {
            console.error("Ошибка при проверке статуса комнаты:", result.error);
        }
    } catch (error) {
        console.error("Произошла ошибка при проверке статуса комнаты:", error);
    }
}
