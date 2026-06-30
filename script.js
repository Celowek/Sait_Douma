// Функция открытия окон
function openModal(modalId) {
    closeAllModals(); // Сначала закроем другие, если были открыты
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
        targetModal.classList.add('active');
    }
}

// Функция закрытия конкретного окна
function closeModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
        targetModal.classList.remove('active');
    }
}

// Функция закрытия вообще всех окон
function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => modal.classList.remove('active'));
}

// ГЕНЕРАТОР СНЕГА
function createSnow() {
    const snowContainer = document.getElementById('snow-container');
    if (!snowContainer) return;
    
    const snowflakeCount = 85;
    const snowflakesSymbols = ['❄', '•', '*'];

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        snowflake.innerText = snowflakesSymbols[Math.floor(Math.random() * snowflakesSymbols.length)];
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.fontSize = (Math.random() * 15 + 10) + 'px';
        snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';

        snowContainer.appendChild(snowflake);
    }
}

// Запускаем снег сразу при загрузке страницы
window.onload = createSnow;

// Копирование IP адреса в буфер обмена
function copyIP() {
    const ipText = document.getElementById('ipText').innerText;
    navigator.clipboard.writeText(ipText).then(() => {
        const ipBox = document.getElementById('ipBox');
        const originalHTML = ipBox.innerHTML;
        
        ipBox.innerHTML = '<i class="fa-solid fa-check"></i> Скопировано!';
        setTimeout(() => { ipBox.innerHTML = originalHTML; }, 2000);
    }).catch(err => { console.error('Ошибка копирования: ', err); });
}

