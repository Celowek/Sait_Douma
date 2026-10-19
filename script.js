// 1. СИСТЕМА АТМОСФЕРЫ (Метель / Кровавые лепестки / Выкл)
let currentAmbiance = localStorage.getItem('cult_ambiance') || 'ice';

function createParticles() {
    let container = document.getElementById('snow-container') || document.querySelector('.snowflakes');
    if (!container) {
        container = document.createElement('div');
        container.id = 'snow-container';
        document.body.prepend(container);
    }
    container.innerHTML = '';

    if (currentAmbiance === 'off') return;

    const count = 48;
    const iceSymbols = ['❅', '❆', '❄', '•'];
    const crimsonSymbols = ['❀', '✿', '❅', '•'];

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('snowflake');

        if (currentAmbiance === 'crimson' && i % 2 === 0) {
            p.classList.add('crimson-petal');
            p.innerText = crimsonSymbols[Math.floor(Math.random() * crimsonSymbols.length)];
        } else {
            p.innerText = iceSymbols[Math.floor(Math.random() * iceSymbols.length)];
        }

        p.style.left = Math.random() * 100 + 'vw';
        p.style.fontSize = (Math.random() * 14 + 8) + 'px';
        p.style.animationDuration = (Math.random() * 7 + 6) + 's';
        p.style.animationDelay = (Math.random() * 6) + 's';
        container.appendChild(p);
    }
}

function toggleAmbiance() {
    const modes = ['ice', 'crimson', 'off'];
    const labels = {
        'ice': '<i class="fa-solid fa-snowflake"></i> Атмосфера: Метель',
        'crimson': '<i class="fa-solid fa-fan"></i> Атмосфера: Кровавый лотос',
        'off': '<i class="fa-solid fa-eye-slash"></i> Атмосфера: Выкл'
    };
    const nextIndex = (modes.indexOf(currentAmbiance) + 1) % modes.length;
    currentAmbiance = modes[nextIndex];
    localStorage.setItem('cult_ambiance', currentAmbiance);

    const btn = document.getElementById('ambianceBtn');
    if (btn) btn.innerHTML = labels[currentAmbiance];
    createParticles();
}

function initAmbianceButton() {
    const btn = document.createElement('button');
    btn.id = 'ambianceBtn';
    btn.className = 'ambiance-toggle';
    const labels = {
        'ice': '<i class="fa-solid fa-snowflake"></i> Атмосфера: Метель',
        'crimson': '<i class="fa-solid fa-fan"></i> Атмосфера: Кровавый лотос',
        'off': '<i class="fa-solid fa-eye-slash"></i> Атмосфера: Выкл'
    };
    btn.innerHTML = labels[currentAmbiance] || labels['ice'];
    btn.onclick = toggleAmbiance;
    document.body.appendChild(btn);
}

// 2. ИНТЕРАКТИВНЫЙ ЧЕК-ЛИСТ ЗАДАНИЙ НА ПОВЫШЕНИЕ (localStorage)
function initRankChecklist() {
    const savedTasks = JSON.parse(localStorage.getItem('cult_rank_tasks') || '{}');
    const items = document.querySelectorAll('.check-task-item');
    if (items.length === 0) return;

    items.forEach(item => {
        const id = item.getAttribute('data-task-id');
        if (savedTasks[id]) {
            item.classList.add('completed');
        }
        item.addEventListener('click', () => {
            item.classList.toggle('completed');
            const currentSaved = JSON.parse(localStorage.getItem('cult_rank_tasks') || '{}');
            currentSaved[id] = item.classList.contains('completed');
            localStorage.setItem('cult_rank_tasks', JSON.stringify(currentSaved));
            updateRankProgressBars();
        });
    });

    updateRankProgressBars();
}

function updateRankProgressBars() {
    const cards = document.querySelectorAll('.rank-step-card');
    let totalTasks = 0;
    let totalCompleted = 0;

    cards.forEach(card => {
        const tasks = card.querySelectorAll('.check-task-item');
        const done = card.querySelectorAll('.check-task-item.completed');
        totalTasks += tasks.length;
        totalCompleted += done.length;

        const percent = tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0;
        const fill = card.querySelector('.step-bar-fill');
        const label = card.querySelector('.step-progress-label');
        if (fill) fill.style.width = percent + '%';
        if (label) label.innerText = `Выполнено: ${done.length} из ${tasks.length} (${percent}%)`;
    });

    const overallFill = document.getElementById('overallBarFill');
    const overallText = document.getElementById('overallProgressText');
    if (overallFill && totalTasks > 0) {
        const totalPercent = Math.round((totalCompleted / totalTasks) * 100);
        overallFill.style.width = totalPercent + '%';
        if (overallText) {
            overallText.innerText = `${totalCompleted} / ${totalTasks} заданий (${totalPercent}%)`;
        }
    }
}

// 3. ГЕНЕРАТОР ОТЧЁТА НА ПОВЫШЕНИЕ (ДЛЯ DISCORD / TICKET TOOL)
function copyRankReport(button, rankTitle) {
    const card = button.closest('.rank-step-card');
    const tasks = card.querySelectorAll('.check-task-item');
    let reportLines = [`📜 **Запрос на повышение: ${rankTitle}**`, `────────────────────────`];

    tasks.forEach(t => {
        const isDone = t.classList.contains('completed');
        const text = t.querySelector('.task-text').innerText.trim();
        reportLines.push(`${isDone ? '✅' : '⬜'} ${text} — [Ссылка на Imgur: ]`);
    });

    reportLines.push(`────────────────────────`);
    reportLines.push(`📎 *Примечание: Все скриншоты загружены на Imgur.*`);

    navigator.clipboard.writeText(reportLines.join('\n')).then(() => {
        const orig = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> Шаблон скопирован!';
        setTimeout(() => { button.innerHTML = orig; }, 2200);
    });
}

// 4. ФИЛЬТРАЦИЯ РАНГОВ ПО УРОВНЮ КРОВИ
function filterRanks(tier, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.rank-step-card').forEach(card => {
        if (tier === 'all' || card.classList.contains(tier)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// 5. ТАЙМЕР ОТКАТА ПОВЫШЕНИЯ (КД 1 / 2 / 3 ДНЯ)
let cdInterval = null;

function startCooldownTimer(days) {
    const targetTime = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem('cult_cd_target', targetTime);
    updateCooldownDisplay();
}

function resetCooldownTimer() {
    localStorage.removeItem('cult_cd_target');
    updateCooldownDisplay();
}

function updateCooldownDisplay() {
    const display = document.getElementById('cdTimerDisplay');
    if (!display) return;

    const target = parseInt(localStorage.getItem('cult_cd_target') || '0', 10);
    if (!target || target <= Date.now()) {
        display.innerText = 'КД ОТСУТСТВУЕТ — ГОТОВ К ПОВЫШЕНИЮ';
        display.style.color = '#10b981';
        return;
    }

    display.style.color = '#00f0ff';
    const diff = target - Date.now();
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    display.innerText = `${d}д : ${String(h).padStart(2, '0')}ч : ${String(m).padStart(2, '0')}м : ${String(s).padStart(2, '0')}с`;
}

// 6. КОПИРОВАНИЕ IP, МОЛИТВ И АЛТАРЬ ДОУМЫ
function copyIP() {
    const ipTextElement = document.getElementById('ipText');
    if (!ipTextElement) return;
    navigator.clipboard.writeText(ipTextElement.innerText).then(() => {
        const ipBox = document.getElementById('ipBox');
        const originalHTML = ipBox.innerHTML;
        ipBox.innerHTML = '<i class="fa-solid fa-check"></i> <span>IP Скопирован!</span>';
        setTimeout(() => { ipBox.innerHTML = originalHTML; }, 2000);
    });
}

function setBloodView(mode, btn) {
    const list = document.getElementById('bloodArtsList');
    if (!list) return;
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    list.classList.toggle('grid-mode', mode === 'grid');
}

function copyPrayer(button) {
    const tablet = button.closest('.prayer-tablet');
    const content = tablet.querySelector('.prayer-content').innerText;
    navigator.clipboard.writeText(content).then(() => {
        const orig = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> Молитва скопирована';
        setTimeout(() => { button.innerHTML = orig; }, 2000);
    });
}

function prayAtAltar() {
    const blessings = [
        "«Ледяной лотос расцвёл в твоих руках — Доума заметил твоё усердие. На следующей вылазке удача будет на твоей стороне.»",
        "«Холодный туман скрывает твои шаги. Ни один клинок Ничирин не коснётся твоей шеи этой ночью.»",
        "«Господин Вечного Рая улыбается тебе: твоя кровь становится гуще, а регенерация — стремительнее.»",
        "«Снежинки кружатся в тишине Храма. Скоро тебе выпадет шанс доказать свою верность перед Высшими Лунами.»",
        "«Кристальное дитя шепчет твоё имя. Твоя следующая дуэль принесёт тебе славу и приблизит к новому рангу.»"
    ];
    const box = document.getElementById('altarResult');
    if (!box) return;
    box.style.opacity = '0';
    setTimeout(() => {
        box.innerText = blessings[Math.floor(Math.random() * blessings.length)];
        box.style.opacity = '1';
    }, 200);
}

// 7. ПОЛНОЭКРАННОЕ ОТКРЫТИЕ КАРТИНОК МАГИИ КРОВИ
function initLightbox() {
    const imgs = document.querySelectorAll('.blood-art-img');
    if (imgs.length === 0) return;

    const modal = document.createElement('div');
    modal.className = 'image-lightbox';
    modal.innerHTML = '<img src="" alt="Preview">';
    modal.onclick = () => modal.classList.remove('active');
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    imgs.forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modal.classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initAmbianceButton();
    initRankChecklist();
    initLightbox();
    updateCooldownDisplay();
    if (document.getElementById('cdTimerDisplay')) {
        cdInterval = setInterval(updateCooldownDisplay, 1000);
    }
});