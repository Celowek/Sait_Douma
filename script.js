// Генератор падающего снега для всех страниц
function createSnow() {
    let snowContainer = document.getElementById('snow-container') || document.querySelector('.snowflakes');
    
    if (!snowContainer) {
        snowContainer = document.createElement('div');
        snowContainer.id = 'snow-container';
        document.body.prepend(snowContainer);
    } else {
        snowContainer.innerHTML = ''; // Очищаем статичные снежинки, чтобы сделать плавный снег
    }

    const snowflakeCount = 55;
    const snowflakesSymbols = ['❅', '❆', '❄', '•'];

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');

        snowflake.innerText = snowflakesSymbols[Math.floor(Math.random() * snowflakesSymbols.length)];
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.fontSize = (Math.random() * 14 + 8) + 'px';
        snowflake.style.animationDuration = (Math.random() * 7 + 6) + 's';
        snowflake.style.animationDelay = (Math.random() * 6) + 's';

        snowContainer.appendChild(snowflake);
    }
}

document.addEventListener('DOMContentLoaded', createSnow);

// Копирование IP адреса сервера в буфер обмена
function copyIP() {
    const ipTextElement = document.getElementById('ipText');
    if (!ipTextElement) return;

    const ipText = ipTextElement.innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        const ipBox = document.getElementById('ipBox');
        const originalHTML = ipBox.innerHTML;

        ipBox.innerHTML = '<i class="fa-solid fa-check"></i> <span>Скопировано!</span>';
        setTimeout(() => {
            ipBox.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Ошибка копирования: ', err);
    });
}

// Переключение вида карточек на странице Магии крови (Список / Плитка)
function setBloodView(mode, btn) {
    const list = document.getElementById('bloodArtsList');
    if (!list) return;

    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (mode === 'grid') {
        list.classList.add('grid-mode');
    } else {
        list.classList.remove('grid-mode');
    }
}

// Копирование текста молитвы для быстрого использования в РП
function copyPrayer(button) {
    const tablet = button.closest('.prayer-tablet');
    const content = tablet.querySelector('.prayer-content').innerText;

    navigator.clipboard.writeText(content).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> Молитва скопирована';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    });
}