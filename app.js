// app.js - Meal Decider Pro Logic

// 1. 預設豐富美食資料庫
const DEFAULT_FOODS = [
    { id: '1', name: '日式拉麵', category: 'noodle', mealType: 'all', speed: 'sit', reason: '濃郁湯頭與彈牙麵條，能為忙碌的一天帶來滿滿療癒感！' },
    { id: '2', name: '經典便當 (排骨/雞腿)', category: 'rice', mealType: 'lunch', speed: 'quick', reason: '主菜雙拼加三樣配菜，最懂台灣人的高CP值飽足首選。' },
    { id: '3', name: '健康舒肥雞餐盒', category: 'light', mealType: 'lunch', speed: 'quick', reason: '低升糖高蛋白質，午後不昏睡、身體輕盈無負擔。' },
    { id: '4', name: '牛肉麵 (紅燒/清燉)', category: 'noodle', mealType: 'all', speed: 'sit', reason: '軟嫩牛肉搭配大骨慢熬高湯，每一口都是道地經典。' },
    { id: '5', name: '義大利麵 / 燉飯', category: 'exotic', mealType: 'dinner', speed: 'sit', reason: '奶油白醬或濃郁青醬，享受滿滿異國浪漫風味。' },
    { id: '6', name: '韓式鍋物 / 部隊鍋', category: 'exotic', mealType: 'dinner', speed: 'sit', reason: '酸辣泡菜湯底配上融化起司，跟朋友聚餐熱鬧又開胃。' },
    { id: '7', name: '手工水餃 / 煎餃', category: 'noodle', mealType: 'all', speed: 'quick', reason: '一口一個多汁飽滿，快速美味、不花時間思考！' },
    { id: '8', name: '美式漢堡 / 薯條', category: 'fast', mealType: 'all', speed: 'quick', reason: '多汁牛肉排搭配爆汁起司，犒賞自己的快感首選。' },
    { id: '9', name: '旋轉壽司 / 海鮮丼', category: 'exotic', mealType: 'all', speed: 'sit', reason: '鮮甜生魚片與醋飯完美結合，輕巧無負擔的精緻享受。' },
    { id: '10', name: '泰式綠咖哩飯', category: 'exotic', mealType: 'dinner', speed: 'sit', reason: '椰奶香氣與微辣辛香料，秒飛東南亞的開胃神作。' },
    { id: '11', name: '海南雞飯', category: 'rice', mealType: 'lunch', speed: 'quick', reason: '滑嫩雞肉搭配香氣爆棚的雞油飯，清爽又美味。' },
    { id: '12', name: '鹹酥雞 / 宵夜炸物', category: 'fast', mealType: 'dinner', speed: 'quick', reason: '偶爾放縱一下，九層塔香氣配上紓壓炸物萬歲！' },
    { id: '13', name: '越南河粉 (Pho)', category: 'noodle', mealType: 'all', speed: 'quick', reason: '清爽檸檬與九層塔高湯，滑順河粉暖心暖胃。' },
    { id: '14', name: '石鍋拌飯 / 燒肉飯', category: 'rice', mealType: 'dinner', speed: 'sit', reason: '香噴噴焦香鍋巴配上豐富配菜，一口接一口停不下來。' }
];

// 色彩庫 (輪盤扇形顏色)
const WHEEL_COLORS = [
    '#6366f1', '#ec4899', '#10b981', '#f59e0b', 
    '#06b6d4', '#8b5cf6', '#f43f5e', '#84cc16'
];

// App 狀態
let foodList = JSON.parse(localStorage.getItem('meal_decider_foods')) || DEFAULT_FOODS;
let activeFilters = {
    mealType: 'all',
    category: 'all',
    speed: 'all'
};

// Canvas & Wheel 狀態
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let currentRotation = 0;
let isSpinning = false;
let currentFilteredList = [...foodList];

// 2. 初始化與事件綁定
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initFilterChips();
    initWheel();
    initFoodManager();
    initWeeklyPlanner();

    window.addEventListener('resize', () => {
        drawWheel();
    });

    // 輪盤抽籤按鈕
    document.getElementById('spinBtn').addEventListener('click', spinWheel);
    document.getElementById('quickSpinBtn').addEventListener('click', quickSpin);
    document.getElementById('blindBoxBtn').addEventListener('click', blindBoxSpin);

    // 結果處置按鈕
    document.getElementById('acceptBtn').addEventListener('click', () => {
        if (window.confetti) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        alert('🎉 太棒了！今天就享受美味吧！已為你記下這美妙的一餐。');
    });

    document.getElementById('retryBtn').addEventListener('click', () => {
        spinWheel();
    });
});

// 3. 頁籤切換邏輯
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');

            if (target === 'wheel-sec') {
                drawWheel();
            }
        });
    });
}

// 4. 情境篩選晶片邏輯
function initFilterChips() {
    const chipGroups = document.querySelectorAll('.chip-group');

    chipGroups.forEach(group => {
        const filterType = group.getAttribute('data-filter');
        const chips = group.querySelectorAll('.chip');

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                activeFilters[filterType] = chip.getAttribute('data-val');
                updateFilteredList();
            });
        });
    });
}

function updateFilteredList() {
    currentFilteredList = foodList.filter(item => {
        const matchMeal = activeFilters.mealType === 'all' || item.mealType === 'all' || item.mealType === activeFilters.mealType;
        const matchCat = activeFilters.category === 'all' || item.category === activeFilters.category;
        const matchSpeed = activeFilters.speed === 'all' || item.speed === 'all' || item.speed === activeFilters.speed;
        return matchMeal && matchCat && matchSpeed;
    });

    if (currentFilteredList.length === 0) {
        currentFilteredList = [...foodList]; // Fallback 如果篩選為空
    }

    drawWheel();
}

// 5. Canvas 轉盤繪製與物理動畫
function initWheel() {
    updateFilteredList();
}

function drawWheel() {
    if (!ctx || !canvas) return;

    // 手機高 DPI 螢幕與動態寬度優化
    const wrapper = canvas.parentElement;
    if (wrapper) {
        const size = Math.min(wrapper.clientWidth, wrapper.clientHeight) || 320;
        if (canvas.width !== size * 2) {
            canvas.width = size * 2;
            canvas.height = size * 2;
        }
    }

    const count = currentFilteredList.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 16;
    const sliceAngle = (Math.PI * 2) / count;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < count; i++) {
        const angle = i * sliceAngle + currentRotation;
        
        // 繪製扇形
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.5)';
        ctx.stroke();

        // 繪製文字
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px "Noto Sans TC", sans-serif';
        ctx.fillText(currentFilteredList[i].name, radius - 25, 5);
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning || currentFilteredList.length === 0) return;
    isSpinning = true;
    document.getElementById('resultBox').classList.add('hidden');

    const totalRounds = 5 + Math.random() * 5; // 旋轉 5~10 圈
    const targetAngle = totalRounds * Math.PI * 2;
    const startTime = performance.now();
    const duration = 4000; // 4秒

    function animateSpin(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease Out Cubic 緩降效果
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentRotation = targetAngle * easeOut;

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            isSpinning = false;
            showSpinResult();
        }
    }

    requestAnimationFrame(animateSpin);
}

function showSpinResult() {
    const count = currentFilteredList.length;
    const sliceAngle = (Math.PI * 2) / count;
    
    // 頂點針頭在 -90度 (Math.PI * 1.5)
    let normalizedRotation = (currentRotation % (Math.PI * 2));
    let winningIndex = Math.floor((Math.PI * 2 - (normalizedRotation % (Math.PI * 2)) + Math.PI * 1.5) % (Math.PI * 2) / sliceAngle);
    winningIndex = (winningIndex + count) % count;

    const selectedFood = currentFilteredList[winningIndex];
    displayResult(selectedFood);
}

function quickSpin() {
    if (isSpinning) return;
    const randomIndex = Math.floor(Math.random() * currentFilteredList.length);
    displayResult(currentFilteredList[randomIndex]);
}

function blindBoxSpin() {
    if (isSpinning) return;
    const randomIndex = Math.floor(Math.random() * foodList.length);
    const chosen = foodList[randomIndex];
    displayResult({
        ...chosen,
        name: `🎁 盲盒驚喜：${chosen.name}`,
        reason: `「不敢相信吧！命運盲盒為你抽中了【${chosen.name}】，閉上眼睛吃就對了！」`
    });
}

let lastSelectedFoodName = '';

function displayResult(food) {
    const resultBox = document.getElementById('resultBox');
    lastSelectedFoodName = food.name.replace('🎁 盲盒驚喜：', '');
    document.getElementById('resultTitle').textContent = food.name;
    document.getElementById('resultReason').textContent = food.reason || '「試試這款美食，今天絕對不會失望！」';

    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (window.confetti) {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }
}

// 聯網地圖與外送平台即時搜尋
document.addEventListener('DOMContentLoaded', () => {
    const searchMapBtn = document.getElementById('searchMapBtn');
    const searchUberBtn = document.getElementById('searchUberBtn');

    if (searchMapBtn) {
        searchMapBtn.addEventListener('click', () => {
            if (!lastSelectedFoodName) return;
            
            // 嘗試獲取使用者目前位置，開啟精準 Google 地圖搜尋
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        const url = `https://www.google.com/maps/search/${encodeURIComponent(lastSelectedFoodName)}/@${lat},${lng},15z`;
                        window.open(url, '_blank');
                    },
                    () => {
                        // 定位拒絕或失敗時，直接搜尋名稱
                        const url = `https://www.google.com/maps/search/${encodeURIComponent(lastSelectedFoodName + ' 附近')}`;
                        window.open(url, '_blank');
                    }
                );
            } else {
                const url = `https://www.google.com/maps/search/${encodeURIComponent(lastSelectedFoodName + ' 附近')}`;
                window.open(url, '_blank');
            }
        });
    }

    if (searchUberBtn) {
        searchUberBtn.addEventListener('click', () => {
            if (!lastSelectedFoodName) return;
            const url = `https://www.google.com/search?q=${encodeURIComponent(lastSelectedFoodName + ' 外送 foodpanda ubereats')}`;
            window.open(url, '_blank');
        });
    }
});

// 6. 口袋名單管理
function initFoodManager() {
    renderFoodManagerList();

    const form = document.getElementById('addFoodForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('foodName');
        const catSelect = document.getElementById('foodCategory');
        const mealSelect = document.getElementById('foodMealType');

        const newFood = {
            id: Date.now().toString(),
            name: nameInput.value.trim(),
            category: catSelect.value,
            mealType: mealSelect.value,
            speed: 'all',
            reason: '這是你親手加入的私房口袋美食，一定超符合你的口味！'
        };

        foodList.push(newFood);
        saveFoods();
        nameInput.value = '';
        renderFoodManagerList();
        updateFilteredList();
    });
}

function renderFoodManagerList() {
    const container = document.getElementById('foodList');
    const countEl = document.getElementById('foodCount');
    if (!container) return;

    countEl.textContent = foodList.length;
    container.innerHTML = foodList.map(food => `
        <div class="food-chip">
            <span>${getCategoryEmoji(food.category)} ${food.name}</span>
            <button class="del-btn" onclick="deleteFood('${food.id}')">✕</button>
        </div>
    `).join('');
}

window.deleteFood = function(id) {
    foodList = foodList.filter(f => f.id !== id);
    saveFoods();
    renderFoodManagerList();
    updateFilteredList();
};

function saveFoods() {
    localStorage.setItem('meal_decider_foods', JSON.stringify(foodList));
}

function getCategoryEmoji(cat) {
    const map = { rice: '🍚', noodle: '🍜', light: '🥗', fast: '🍔', exotic: '🍕' };
    return map[cat] || '🍱';
}

// 7. 一週菜單自動生成邏輯
function initWeeklyPlanner() {
    const genBtn = document.getElementById('genWeeklyBtn');
    const copyBtn = document.getElementById('copyWeeklyBtn');

    if (genBtn) genBtn.addEventListener('click', generateWeeklyPlan);
    if (copyBtn) copyBtn.addEventListener('click', copyWeeklyMenuText);

    // 初次預設生成一週
    generateWeeklyPlan();
}

const DAYS = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

function generateWeeklyPlan() {
    const grid = document.getElementById('weeklyGrid');
    if (!grid) return;

    let available = [...foodList];
    let html = '';

    DAYS.forEach(day => {
        // 隨機抽午餐與晚餐，盡量不重複
        const lunchIdx = Math.floor(Math.random() * available.length);
        const lunch = available[lunchIdx] || foodList[0];
        
        let dinnerIdx = Math.floor(Math.random() * available.length);
        if (dinnerIdx === lunchIdx) dinnerIdx = (dinnerIdx + 1) % available.length;
        const dinner = available[dinnerIdx] || foodList[1];

        html += `
            <div class="day-card">
                <h4><span>${day}</span> <span>🍱</span></h4>
                <div class="meal-slot">
                    <span class="type">🌞 午餐首選</span>
                    <span class="name">${lunch.name}</span>
                </div>
                <div class="meal-slot dinner">
                    <span class="type">🌙 晚餐犒賞</span>
                    <span class="name">${dinner.name}</span>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function copyWeeklyMenuText() {
    const dayCards = document.querySelectorAll('.day-card');
    let text = '🍱 【本週靈感美饌備忘錄】\n------------------\n';

    dayCards.forEach(card => {
        const day = card.querySelector('h4 span').textContent;
        const lunch = card.querySelectorAll('.meal-slot .name')[0].textContent;
        const dinner = card.querySelectorAll('.meal-slot .name')[1].textContent;
        text += `${day} | 午餐：${lunch} | 晚餐：${dinner}\n`;
    });

    text += '------------------\n💪 不再浪費大腦時間，快樂享受美食！';

    navigator.clipboard.writeText(text).then(() => {
        alert('📋 一週菜單已成功複製到剪貼簿！可貼至 Line、Notion 或記事本。');
    });
}
