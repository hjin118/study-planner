let currentDate = new Date();
let tasks = [];
let customSettings = null;

try {
    const storedTasks = localStorage.getItem('studyTasks');
    if (storedTasks) {
        const parsed = JSON.parse(storedTasks);
        if (Array.isArray(parsed)) {
            tasks = parsed;
        } else if (typeof parsed === 'object' && parsed !== null) {
            tasks = [];
        }
    }
} catch (e) {
    console.error('Error loading tasks:', e);
    localStorage.removeItem('studyTasks');
}

try {
    customSettings = JSON.parse(localStorage.getItem('customSettings'));
} catch (e) {
    console.error('Error loading settings:', e);
    localStorage.removeItem('customSettings');
}

const calendar = document.getElementById('calendar');
const currentMonthEl = document.getElementById('currentMonth');
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const endDateInput = document.getElementById('endDateInput');
const taskColor = document.getElementById('taskColor');
const taskIcon = document.getElementById('taskIcon');
const addTaskBtn = document.getElementById('addTaskBtn');
const themeToggle = document.getElementById('themeToggle');
const settingsBtn = document.getElementById('settingsBtn');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettings');
const saveSettingsBtn = document.getElementById('saveSettings');
const resetSettingsBtn = document.getElementById('resetSettings');
const clearDataBtn = document.getElementById('clearData');
const appIconSelector = document.getElementById('appIconSelector');
const character = document.getElementById('character');
const speechBubble = document.getElementById('speechBubble');

const defaultSettings = {
    bgPrimary: '#fef7f0',
    bgCard: '#ffffff',
    accent: '#ffb6c1',
    textPrimary: '#5a4a3a',
    appIcon: '📚'
};

const supportiveMessages = [
    '할 수 있어! 💪',
    '파이팅! 🎯',
    '넌 최고야! ⭐',
    '하나씩 해나가자! 📝',
    '잘하고 있어! 🌟',
    '쉬어도 돼! ☕',
    '넌 멋져! 💫',
    '포기하지 마! 🔥',
    '넌 해낼 거야! 🚀',
    '응원할게! 💖',
    '오늘도 화이팅! 🎉',
    '자신감을 가져! 🌈',
    '넌 특별해! ✨',
    '할 수 있을 거야! 💕',
    '잘 하고 있어! 🎊',
    '끝까지 해보자! 🏃',
    '넌 천재야! 🧠',
    '아자아자! 🎵',
    '넌 대단해! 🏆',
    '항상 응원할게! 💗'
];

function init() {
    setDefaultDate();
    loadTheme();
    loadCustomSettings();
    renderCalendar();
    setupEventListeners();
    initCharacter();
}

function initCharacter() {
    setRandomPosition();
    
    character.addEventListener('click', showSupportiveMessage);
    character.addEventListener('contextmenu', spinCharacter);
    
    character.classList.add('walking');
    startContinuousMovement();
}

let currentX = 0;
let currentY = 0;
let velocityX = 0.5;
let velocityY = 0.5;
let lastVelocityX = 0.5;

function setRandomPosition() {
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;
    const padding = 100;
    
    currentX = Math.max(padding, Math.min(maxX - padding, Math.random() * maxX));
    currentY = Math.max(padding, Math.min(maxY - padding, Math.random() * maxY));
    
    character.style.left = currentX + 'px';
    character.style.top = currentY + 'px';
    
    velocityX = (Math.random() - 0.5) * 2;
    velocityY = (Math.random() - 0.5) * 2;
    lastVelocityX = velocityX;
    
    updateCharacterDirection();
}

function startContinuousMovement() {
    function animate() {
        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 100;
        const padding = 50;
        
        currentX += velocityX;
        currentY += velocityY;
        
        if (currentX <= padding || currentX >= maxX - padding) {
            velocityX *= -1;
            changeDirection();
            updateCharacterDirection();
        }
        
        if (currentY <= padding || currentY >= maxY - padding) {
            velocityY *= -1;
            changeDirection();
        }
        
        character.style.left = currentX + 'px';
        character.style.top = currentY + 'px';
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
    
    setInterval(() => {
        changeDirection();
        updateCharacterDirection();
    }, 3000);
}

function updateCharacterDirection() {
    const shouldFaceLeft = velocityX < 0;
    
    if ((shouldFaceLeft && lastVelocityX >= 0) || (!shouldFaceLeft && lastVelocityX < 0)) {
        character.style.transform = shouldFaceLeft ? 'scaleX(-1)' : 'scaleX(1)';
        lastVelocityX = velocityX;
    }
}

function changeDirection() {
    velocityX = (Math.random() - 0.5) * 1.5;
    velocityY = (Math.random() - 0.5) * 1.5;
}

function spinCharacter(e) {
    e.preventDefault();
    
    character.classList.add('spinning');
    character.style.transition = 'transform 1s ease-in-out';
    character.style.transform = 'rotate(1080deg)';
    
    setTimeout(() => {
        character.classList.remove('spinning');
        character.style.transition = 'transform 0.3s ease, left 0.5s ease, top 0.5s ease';
        character.style.transform = '';
    }, 1000);
}

function showSupportiveMessage() {
    const randomMessage = supportiveMessages[Math.floor(Math.random() * supportiveMessages.length)];
    
    speechBubble.textContent = randomMessage;
    speechBubble.classList.add('show');
    
    setTimeout(() => {
        speechBubble.classList.remove('show');
    }, 2000);
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    endDateInput.value = '';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function loadCustomSettings() {
    if (customSettings) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            document.documentElement.style.setProperty('--bg-primary', customSettings.darkBgPrimary || defaultSettings.bgPrimary);
            document.documentElement.style.setProperty('--bg-card', customSettings.darkBgCard || defaultSettings.bgCard);
            document.documentElement.style.setProperty('--accent', customSettings.darkAccent || defaultSettings.accent);
            document.documentElement.style.setProperty('--text-primary', customSettings.darkTextPrimary || defaultSettings.textPrimary);
        } else {
            document.documentElement.style.setProperty('--bg-primary', customSettings.bgPrimary || defaultSettings.bgPrimary);
            document.documentElement.style.setProperty('--bg-card', customSettings.bgCard || defaultSettings.bgCard);
            document.documentElement.style.setProperty('--accent', customSettings.accent || defaultSettings.accent);
            document.documentElement.style.setProperty('--text-primary', customSettings.textPrimary || defaultSettings.textPrimary);
        }
        
        if (customSettings.appIcon) {
            document.querySelector('h1').textContent = `${customSettings.appIcon} 공부 플래너`;
        }
    }
}

function saveCustomSettings(settings) {
    localStorage.setItem('customSettings', JSON.stringify(settings));
    customSettings = settings;
    loadCustomSettings();
}

function resetCustomSettings() {
    localStorage.removeItem('customSettings');
    customSettings = null;
    
    const root = document.documentElement;
    root.style.removeProperty('--bg-primary');
    root.style.removeProperty('--bg-card');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--text-primary');
    
    document.querySelector('h1').textContent = '📚 공부 플래너';
    
    loadCustomSettings();
}

function clearAllData() {
    if (confirm('정말 모든 데이터를 삭제하시겠습니까? 모든 일정과 설정이 삭제되며 되돌릴 수 없습니다!')) {
        localStorage.clear();
        tasks = [];
        customSettings = null;
        
        const root = document.documentElement;
        root.style.removeProperty('--bg-primary');
        root.style.removeProperty('--bg-card');
        root.style.removeProperty('--accent');
        root.style.removeProperty('--text-primary');
        
        document.querySelector('h1').textContent = '📚 공부 플래너';
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
        
        renderCalendar();
        closeSettingsModal();
        
        alert('모든 데이터가 삭제되었습니다!');
    }
}

function getMonthName(date) {
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

function formatDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
}

function compareDates(date1, date2) {
    return new Date(date1) - new Date(date2);
}

function getTasksForDate(dateKey) {
    return tasks.filter(task => {
        return dateKey >= task.startDate && dateKey <= task.endDate;
    }).sort((a, b) => compareDates(a.startDate, b.startDate));
}

function getTaskPosition(task, dateKey) {
    if (task.startDate === task.endDate) return '';
    if (dateKey === task.startDate) return 'multi-day-start';
    if (dateKey === task.endDate) return 'multi-day-end';
    return 'multi-day-middle';
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonthEl.textContent = getMonthName(currentDate);
    calendar.innerHTML = '';
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        calendar.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        
        if (isToday(year, month, day)) {
            dayEl.classList.add('today');
        }
        
        const dateKey = formatDateKey(year, month, day);
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayEl.appendChild(dayNumber);
        
        const dayTasks = getTasksForDate(dateKey);
        
        dayTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task';
            
            if (task.startDate !== task.endDate) {
                taskEl.classList.add('multi-day');
                const position = getTaskPosition(task, dateKey);
                if (position) taskEl.classList.add(position);
                taskEl.style.borderLeftColor = task.color;
            }
            
            taskEl.style.backgroundColor = task.color + '40';
            taskEl.style.color = task.color;
            
            const iconSpan = document.createElement('span');
            iconSpan.textContent = task.icon;
            taskEl.appendChild(iconSpan);
            
            const textSpan = document.createElement('span');
            textSpan.textContent = task.name;
            taskEl.appendChild(textSpan);
            
            taskEl.addEventListener('click', (e) => {
                e.stopPropagation();
                editTask(task.id);
            });
            
            dayEl.appendChild(taskEl);
        });
        
        calendar.appendChild(dayEl);
    }
}

function generateTaskId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function addTask() {
    const taskText = taskInput.value.trim();
    const startDate = dateInput.value;
    const endDate = endDateInput.value || startDate;
    const color = taskColor.value;
    const icon = taskIcon.value;
    
    if (!taskText) {
        alert('내용을 입력해주세요!');
        return;
    }
    
    if (!startDate) {
        alert('시작일을 선택해주세요!');
        return;
    }
    
    if (compareDates(endDate, startDate) < 0) {
        alert('종료일은 시작일보다 빠를 수 없습니다!');
        return;
    }
    
    const newTask = {
        id: generateTaskId(),
        name: taskText,
        startDate: startDate,
        endDate: endDate,
        color: color,
        icon: icon
    };
    
    tasks.push(newTask);
    saveTasks();
    renderCalendar();
    
    taskInput.value = '';
    endDateInput.value = '';
    setDefaultDate();
}

function editTask(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    const isMultiDay = task.startDate !== task.endDate;
    
    const action = prompt(`"${task.name}" 편집 (새 이름 입력 또는 'delete'로 삭제):`, task.name);
    
    if (action === null) return;
    
    if (action.toLowerCase() === 'delete') {
        if (confirm(`"${task.name}"를 삭제하시겠습니까?`)) {
            tasks.splice(taskIndex, 1);
            saveTasks();
            renderCalendar();
        }
        return;
    }
    
    if (action.trim() !== '') {
        task.name = action.trim();
        saveTasks();
        renderCalendar();
    }
}

function saveTasks() {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

function openSettingsModal() {
    settingsModal.classList.add('show');
    
    if (customSettings) {
        document.getElementById('bgPrimaryColor').value = customSettings.bgPrimary || defaultSettings.bgPrimary;
        document.getElementById('bgCardColor').value = customSettings.bgCard || defaultSettings.bgCard;
        document.getElementById('accentColor').value = customSettings.accent || defaultSettings.accent;
        document.getElementById('textColor').value = customSettings.textPrimary || defaultSettings.textPrimary;
        
        const selectedIcon = customSettings.appIcon || defaultSettings.appIcon;
        document.querySelectorAll('.icon-option').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.icon === selectedIcon);
        });
    } else {
        document.querySelectorAll('.icon-option').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.icon === defaultSettings.appIcon);
        });
    }
}

function closeSettingsModal() {
    settingsModal.classList.remove('show');
}

function saveCustomTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const selectedIconBtn = document.querySelector('.icon-option.selected');
    
    const settings = {
        bgPrimary: document.getElementById('bgPrimaryColor').value,
        bgCard: document.getElementById('bgCardColor').value,
        accent: document.getElementById('accentColor').value,
        textPrimary: document.getElementById('textColor').value,
        appIcon: selectedIconBtn ? selectedIconBtn.dataset.icon : defaultSettings.appIcon,
        darkBgPrimary: isDark ? document.getElementById('bgPrimaryColor').value : '#2d2a2a',
        darkBgCard: isDark ? document.getElementById('bgCardColor').value : '#454141',
        darkAccent: isDark ? document.getElementById('accentColor').value : '#c7a9c8',
        darkTextPrimary: isDark ? document.getElementById('textColor').value : '#e8e0d8'
    };
    
    saveCustomSettings(settings);
    closeSettingsModal();
}

function setupEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    themeToggle.addEventListener('click', toggleTheme);
    
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    
    nextMonthBtn.addEventListener('click', () => changeMonth(1));
    
    settingsBtn.addEventListener('click', openSettingsModal);
    
    closeSettingsBtn.addEventListener('click', closeSettingsModal);
    
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettingsModal();
    });
    
    saveSettingsBtn.addEventListener('click', saveCustomTheme);
    
    resetSettingsBtn.addEventListener('click', () => {
        if (confirm('모든 커스텀 설정을 기본값으로 초기화하시겠습니까?')) {
            resetCustomSettings();
            closeSettingsModal();
        }
    });
    
    clearDataBtn.addEventListener('click', clearAllData);
    
    appIconSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('icon-option')) {
            document.querySelectorAll('.icon-option').forEach(btn => btn.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
}

init();