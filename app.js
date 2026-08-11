// app.js - Meal Decider Pro v2.0 Native Mobile App Logic

const DEFAULT_FOODS = [
    { id: '1', name: '日式拉麵', category: 'noodle', mealType: 'all', reason: '濃郁湯頭與彈牙麵條，能為忙碌的一天帶來滿滿療癒感！' },
    { id: '2', name: '排骨/雞腿便當', category: 'rice', mealType: 'lunch', reason: '主菜雙拼加三樣配菜，最懂台灣人的高CP值飽足首選。' },
    { id: '3', name: '健康舒肥雞餐盒', category: 'light', mealType: 'lunch', reason: '低升糖高蛋白質，午後不昏睡、身體輕盈無負擔。' },
    { id: '4', name: '紅燒牛肉麵', category: 'noodle', mealType: 'all', reason: '軟嫩牛肉搭配大骨慢熬高湯，每一口都是道地經典。' },
    { id: '5', name: '義大利麵 / 燉飯', category: 'exotic', mealType: 'dinner', reason: '奶油白醬或濃郁青醬，享受滿滿異國浪漫風味。' },
    { id: '6', name: '韓式泡菜鍋物', category: 'exotic', mealType: 'dinner', reason: '酸辣泡菜湯底配上融化起司，熱鬧開胃第一名。' },
    { id: '7', name: '手工煎餃 / 水餃', category: 'noodle', mealType: 'all', reason: '一口一個多汁飽滿，快速美味、不花時間思考！' },
    { id: '8', name: '美式雙層起司堡', category: 'fast', mealType: 'all', reason: '多汁牛肉排搭配爆汁起司，犒賞自己的快感首選。' },
    { id: '9', name: '迴轉壽司 / 丼飯', category: 'exotic', mealType: 'all', reason: '鮮甜生魚片與醋飯完美結合，輕巧無負擔的精緻享受。' },
    { id: '10', name: '泰式綠咖哩雞飯', category: 'exotic', mealType: 'dinner', reason: '椰奶香氣與微辣辛香料，秒飛東南亞的開胃神作。' },
    { id: '11', name: '滑嫩海南雞飯', category: 'rice', mealType: 'lunch', reason: '滑嫩雞肉搭配香氣爆棚的雞油飯，清爽又美味。' },
    { id: '12', name: '鹹酥雞 / 炸雞分享餐', category: 'fast', mealType: 'dinner', reason: '偶爾放縱一下，九層塔香氣配上紓壓炸物萬歲！' },
    { id: '13', name: '越式鮮牛河粉', category: 'noodle', mealType: 'all', reason: '清爽檸檬與九層塔高湯，滑順河粉暖心暖胃。' },
    { id: '14', name: '韓式石鍋拌飯', category: 'rice', mealType: 'dinner', reason: '香噴噴焦香鍋巴配上豐富配菜，一口接一口停不下來。' }
];

let foodList = JSON.parse(localStorage.getItem('meal_decider_foods')) || DEFAULT_FOODS;
let activeFilters = { mealType: 'all', category: 'all' };
let currentFilteredList = [...foodList];
let selectedFoodName = '';
let isRolling = false;

document.addEventListener('DOMContentLoaded', () => {
    initBottomNav();
    initFilterDrawer();
    initSlotMachine();
    initFoodManager();
    initWeeklyPlanner();
    updateFilteredList();
});

// 1. 底部導覽列切換
function initBottomNav() {
    const tabs = document.querySelectorAll('.bottom-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// 2. 情境篩選抽屜
function initFilterDrawer() {
    const toggleBtn = document.getElementById('toggleFilterBtn');
    const filterBody = document.getElementById('filterBody');

    if (toggleBtn && filterBody) {
        toggleBtn.addEventListener('click', () => {
            filterBody.classList.toggle('hidden');
        });
    }

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
        return matchMeal && matchCat;
    });

    if (currentFilteredList.length === 0) {
        currentFilteredList = [...foodList];
    }
}

// 3. 拉霸 Slot Machine 視覺滾動邏輯
function initSlotMachine() {
    const spinBtn = document.getElementById('slotSpinBtn');
    const blindBtn = document.getElementById('slotBlindBtn');
    const mapBtn = document.getElementById('slotMapBtn');
    const slotText = document.getElementById('slotText');
    const slotReason = document.getElementById('slotReasonText');
    const slotCategoryTag = document.getElementById('slotCategoryTag');

    if (spinBtn) {
        spinBtn.addEventListener('click', () => {
            if (isRolling) return;
            startSlotRoll(false);
        });
    }

    if (blindBtn) {
        blindBtn.addEventListener('click', () => {
            if (isRolling) return;
            startSlotRoll(true);
        });
    }

    if (mapBtn) {
        mapBtn.addEventListener('click', () => {
            if (!selectedFoodName) return;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const url = `https://www.google.com/maps/search/${encodeURIComponent(selectedFoodName)}/@${pos.coords.latitude},${pos.coords.longitude},15z`;
                        window.open(url, '_blank');
                    },
                    () => {
                        const url = `https://www.google.com/maps/search/${encodeURIComponent(selectedFoodName + ' 附近')}`;
                        window.open(url, '_blank');
                    }
                );
            } else {
                const url = `https://www.google.com/maps/search/${encodeURIComponent(selectedFoodName + ' 附近')}`;
                window.open(url, '_blank');
            }
        });
    }
}

function startSlotRoll(isBlind) {
    isRolling = true;
    const slotText = document.getElementById('slotText');
    const slotReason = document.getElementById('slotReasonText');
    const mapBtn = document.getElementById('slotMapBtn');
    const categoryTag = document.getElementById('slotCategoryTag');

    mapBtn.classList.add('hidden');
    slotText.classList.add('rolling');
    categoryTag.textContent = isBlind ? '🎁 盲盒驚喜抽取中...' : '🎰 美食拉霸旋轉中...';

    const pool = isBlind ? foodList : currentFilteredList;
    let rollCount = 0;
    const interval = setInterval(() => {
        const tempIndex = Math.floor(Math.random() * pool.length);
        slotText.textContent = pool[tempIndex].name;
        rollCount++;
    }, 60);

    setTimeout(() => {
        clearInterval(interval);
        slotText.classList.remove('rolling');

        const finalIndex = Math.floor(Math.random() * pool.length);
        const winner = pool[finalIndex];
        selectedFoodName = winner.name;

        slotText.textContent = winner.name;
        slotReason.textContent = winner.reason || '「就是這道美食！今天放膽去享用吧！」';
        categoryTag.textContent = '🎉 今日決策首選';

        mapBtn.classList.remove('hidden');
        isRolling = false;

        if (window.confetti) {
            confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        }
    }, 1600);
}

// 4. 口袋名單
function initFoodManager() {
    renderFoodList();
    const form = document.getElementById('addFoodForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('foodName');
            const catSelect = document.getElementById('foodCategory');

            const newFood = {
                id: Date.now().toString(),
                name: nameInput.value.trim(),
                category: catSelect.value,
                mealType: 'all',
                reason: '這是你親手新增的私房口袋美食！'
            };

            foodList.push(newFood);
            localStorage.setItem('meal_decider_foods', JSON.stringify(foodList));
            nameInput.value = '';
            renderFoodList();
            updateFilteredList();
        });
    }
}

function renderFoodList() {
    const listEl = document.getElementById('foodList');
    const countEl = document.getElementById('foodCount');
    if (!listEl) return;

    countEl.textContent = foodList.length;
    listEl.innerHTML = foodList.map(f => `
        <div class="food-chip">
            <span>${f.name}</span>
            <span onclick="deleteFood('${f.id}')" style="color: #ef4444; cursor: pointer; font-weight: bold;">✕</span>
        </div>
    `).join('');
}

window.deleteFood = function(id) {
    foodList = foodList.filter(f => f.id !== id);
    localStorage.setItem('meal_decider_foods', JSON.stringify(foodList));
    renderFoodList();
    updateFilteredList();
};

// 5. 一週菜單
function initWeeklyPlanner() {
    const genBtn = document.getElementById('genWeeklyBtn');
    if (genBtn) {
        genBtn.addEventListener('click', generateWeeklyGrid);
    }
    generateWeeklyGrid();
}

function generateWeeklyGrid() {
    const grid = document.getElementById('weeklyGrid');
    if (!grid) return;

    const days = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    grid.innerHTML = days.map(d => {
        const lunch = foodList[Math.floor(Math.random() * foodList.length)].name;
        const dinner = foodList[Math.floor(Math.random() * foodList.length)].name;
        return `
            <div class="day-card">
                <h4>${d} 🍱</h4>
                <div class="meal-slot"><span>🌞 午餐</span><strong>${lunch}</strong></div>
                <div class="meal-slot"><span>🌙 晚餐</span><strong>${dinner}</strong></div>
            </div>
        `;
    }).join('');
}
