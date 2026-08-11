// app.js - Meal Decider Pro v5.0 Store Menu & Note System

const DEFAULT_FOODS = [
    { 
        id: '1', name: '日式拉麵', category: 'noodle', mealType: 'all', 
        reason: '濃郁湯頭與彈牙麵條，能為忙碌的一天帶來滿滿療癒感！',
        menuText: '• 特濃豚骨拉麵 $260\n• 雞白湯拉麵 $240\n• 焦香黑蒜拉麵 $270\n• 替玉(加麵) $30\n• 糖心蛋 $30',
        menuImage: ''
    },
    { 
        id: '2', name: '排骨/雞腿便當', category: 'rice', mealType: 'lunch', 
        reason: '主菜雙拼加三樣配菜，最懂台灣人的高CP值午餐首選。',
        menuText: '• 招牌大排骨飯 $110\n• 酥炸大雞腿飯 $120\n• 控肉飯 $100\n• 每日例湯 $20',
        menuImage: ''
    },
    { 
        id: '3', name: '健康舒肥雞餐盒', category: 'light', mealType: 'lunch', 
        reason: '低升糖高蛋白質，午後不昏睡、身體輕盈無負擔。',
        menuText: '• 蒜香舒肥雞胸餐盒 $150\n• 鹽烤鮭魚餐盒 $180\n• 嫩煎牛排餐盒 $200\n• 無糖冷泡茶 $35',
        menuImage: ''
    },
    { 
        id: '4', name: '紅燒牛肉麵', category: 'noodle', mealType: 'all', 
        reason: '軟嫩牛肉搭配大骨慢熬高湯，每一口都是道地經典。',
        menuText: '• 紅燒半筋半肉麵 $210\n• 清燉牛肉麵 $190\n• 麻辣牛肉乾拌麵 $180\n• 招牌花苔/滷大腸 $60',
        menuImage: ''
    },
    { 
        id: '5', name: '義大利麵 / 燉飯', category: 'exotic', mealType: 'dinner', 
        reason: '奶油白醬或濃郁青醬，享受滿滿異國浪漫晚餐。',
        menuText: '• 粉紅醬奶油海鮮麵 $280\n• 青醬培根燉飯 $260\n• 蒜香辣味培根麵 $220\n• 主廚濃湯 $50',
        menuImage: ''
    },
    { 
        id: '6', name: '韓式泡菜鍋物 / 燒肉', category: 'exotic', mealType: 'dinner', 
        reason: '酸辣泡菜湯底配上融化起司，晚餐聚餐熱鬧開胃。',
        menuText: '• 起司泡菜豬肉鍋 $240\n• 韓式海鮮煎餅 $200\n• 辣炒年糕 $150',
        menuImage: ''
    }
];

let foodList = JSON.parse(localStorage.getItem('meal_decider_foods')) || DEFAULT_FOODS;
let activeFilters = { category: 'all' };
let timeMode = 'auto';
let currentMealTime = 'lunch';
let currentFilteredList = [...foodList];
let selectedFood = null;
let currentModalFood = null;
let tempMenuImage = '';
let isRolling = false;

document.addEventListener('DOMContentLoaded', () => {
    initBottomNav();
    initTimeDetection();
    initFilterDrawer();
    initSlotMachine();
    initFoodManager();
    initWeeklyPlanner();
    initMenuModal();
    updateTimeAndFilter();
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

// 2. ⏰ 時間感知
function initTimeDetection() {
    const btnAuto = document.getElementById('timeBtnAuto');
    const btnLunch = document.getElementById('timeBtnLunch');
    const btnDinner = document.getElementById('timeBtnDinner');

    btnAuto.addEventListener('click', () => setTimeMode('auto', [btnAuto, btnLunch, btnDinner]));
    btnLunch.addEventListener('click', () => setTimeMode('lunch', [btnAuto, btnLunch, btnDinner], btnLunch));
    btnDinner.addEventListener('click', () => setTimeMode('dinner', [btnAuto, btnLunch, btnDinner], btnDinner));
}

function setTimeMode(mode, allBtns, activeBtn = null) {
    timeMode = mode;
    allBtns.forEach(b => b.classList.remove('active'));
    if (mode === 'auto') {
        document.getElementById('timeBtnAuto').classList.add('active');
    } else if (activeBtn) {
        activeBtn.classList.add('active');
    }
    updateTimeAndFilter();
}

function updateTimeAndFilter() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;

    if (timeMode === 'auto') {
        currentMealTime = (hour >= 5 && hour < 14.5) ? 'lunch' : 'dinner';
        const label = currentMealTime === 'lunch' ? '🌞 午餐時段' : '🌙 晚餐時段';
        document.getElementById('autoTimeBadge').textContent = `⏰ 系統已自動對時：${label}`;
    } else if (timeMode === 'lunch') {
        currentMealTime = 'lunch';
        document.getElementById('autoTimeBadge').textContent = '⏰ 已手動指定：🌞 午餐時段';
    } else {
        currentMealTime = 'dinner';
        document.getElementById('autoTimeBadge').textContent = '⏰ 已手動指定：🌙 晚餐時段';
    }

    updateFilteredList();
}

function updateFilteredList() {
    currentFilteredList = foodList.filter(item => {
        const matchMeal = (item.mealType === 'all' || item.mealType === currentMealTime);
        const matchCat = activeFilters.category === 'all' || item.category === activeFilters.category;
        return matchMeal && matchCat;
    });

    if (currentFilteredList.length === 0) {
        currentFilteredList = foodList.filter(item => activeFilters.category === 'all' || item.category === activeFilters.category);
    }
}

// 3. 情境快篩
function initFilterDrawer() {
    const toggleBtn = document.getElementById('toggleFilterBtn');
    const filterBody = document.getElementById('filterBody');

    if (toggleBtn && filterBody) {
        toggleBtn.addEventListener('click', () => filterBody.classList.toggle('hidden'));
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

// 4. 拉霸機與按鈕觸發
function initSlotMachine() {
    const spinBtn = document.getElementById('slotSpinBtn');
    const blindBtn = document.getElementById('slotBlindBtn');
    const mapBtn = document.getElementById('slotMapBtn');
    const menuBtn = document.getElementById('slotMenuBtn');

    if (spinBtn) spinBtn.addEventListener('click', () => { if (!isRolling) startSlotRoll(false); });
    if (blindBtn) blindBtn.addEventListener('click', () => { if (!isRolling) startSlotRoll(true); });

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (selectedFood) {
                openMenuModal(selectedFood);
            }
        });
    }

    if (mapBtn) {
        mapBtn.addEventListener('click', () => {
            if (!selectedFood) return;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const url = `https://www.google.com/maps/search/${encodeURIComponent(selectedFood.name)}/@${pos.coords.latitude},${pos.coords.longitude},15z`;
                        window.open(url, '_blank');
                    },
                    () => {
                        const url = `https://www.google.com/maps/search/${encodeURIComponent(selectedFood.name + ' 附近')}`;
                        window.open(url, '_blank');
                    }
                );
            } else {
                const url = `https://www.google.com/maps/search/${encodeURIComponent(selectedFood.name + ' 附近')}`;
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
    const menuBtn = document.getElementById('slotMenuBtn');
    const categoryTag = document.getElementById('slotCategoryTag');

    mapBtn.classList.add('hidden');
    menuBtn.classList.add('hidden');
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
        selectedFood = pool[finalIndex];

        slotText.textContent = selectedFood.name;
        slotReason.textContent = selectedFood.reason || '「就是這道美味！今天放膽去享用吧！」';
        
        const mealTag = selectedFood.mealType === 'lunch' ? ' [午餐限定]' : (selectedFood.mealType === 'dinner' ? ' [晚餐限定]' : '');
        categoryTag.textContent = `🎉 今日決策首選${mealTag}`;

        mapBtn.classList.remove('hidden');
        menuBtn.classList.remove('hidden');
        isRolling = false;

        if (window.confetti) {
            confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        }
    }, 1600);
}

// 5. 📖 菜單與店家詳細彈窗 Modal 邏輯
function initMenuModal() {
    const modal = document.getElementById('menuModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const saveBtn = document.getElementById('saveMenuBtn');
    const imgInput = document.getElementById('menuImgInput');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenuModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeMenuModal();
        });
    }

    // 上傳照片轉 Base64 預覽
    if (imgInput) {
        imgInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    tempMenuImage = evt.target.result;
                    const imgDisplay = document.getElementById('menuImageDisplay');
                    const hint = document.querySelector('.no-menu-hint');
                    imgDisplay.src = tempMenuImage;
                    imgDisplay.classList.remove('hidden');
                    if (hint) hint.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 儲存菜單資料
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (!currentModalFood) return;

            const textarea = document.getElementById('menuTextarea');
            currentModalFood.menuText = textarea.value.trim();
            if (tempMenuImage) {
                currentModalFood.menuImage = tempMenuImage;
            }

            // 更新至主資料庫與 LocalStorage
            const idx = foodList.findIndex(f => f.id === currentModalFood.id);
            if (idx !== -1) {
                foodList[idx] = { ...currentModalFood };
                localStorage.setItem('meal_decider_foods', JSON.stringify(foodList));
            }

            alert(`✅ 已成功儲存【${currentModalFood.name}】的菜單資料！`);
            closeMenuModal();
            renderFoodList();
        });
    }
}

function openMenuModal(food) {
    currentModalFood = food;
    tempMenuImage = food.menuImage || '';

    document.getElementById('modalStoreName').textContent = food.name;
    document.getElementById('menuTextarea').value = food.menuText || '';

    const imgDisplay = document.getElementById('menuImageDisplay');
    const hint = document.querySelector('.no-menu-hint');
    const tagsEl = document.getElementById('modalStoreTags');

    const mealLabel = food.mealType === 'lunch' ? '🌞 午餐限定' : (food.mealType === 'dinner' ? '🌙 晚餐限定' : '🌞🌙 全天候');
    tagsEl.innerHTML = `<span class="badge-meal">${mealLabel}</span>`;

    if (tempMenuImage) {
        imgDisplay.src = tempMenuImage;
        imgDisplay.classList.remove('hidden');
        if (hint) hint.classList.add('hidden');
    } else {
        imgDisplay.src = '';
        imgDisplay.classList.add('hidden');
        if (hint) hint.classList.remove('hidden');
    }

    document.getElementById('menuModal').classList.remove('hidden');
}

function closeMenuModal() {
    document.getElementById('menuModal').classList.add('hidden');
    currentModalFood = null;
    tempMenuImage = '';
}

// 6. 美食庫與口袋名單
function initFoodManager() {
    renderFoodList();
    const form = document.getElementById('addFoodForm');
    if (form) {
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
                reason: '這是你親手新增的私房口袋美食！',
                menuText: '',
                menuImage: ''
            };

            foodList.push(newFood);
            localStorage.setItem('meal_decider_foods', JSON.stringify(foodList));
            nameInput.value = '';
            renderFoodList();
            updateFilteredList();

            // 自動開啟新店家的菜單編輯
            openMenuModal(newFood);
        });
    }
}

function renderFoodList() {
    const listEl = document.getElementById('foodList');
    const countEl = document.getElementById('foodCount');
    if (!listEl) return;

    countEl.textContent = foodList.length;
    listEl.innerHTML = foodList.map(f => {
        const mealBadge = f.mealType === 'lunch' ? '🌞 午餐' : (f.mealType === 'dinner' ? '🌙 晚餐' : '🌞🌙 全天');
        const hasMenu = (f.menuText || f.menuImage) ? ' 📋' : '';
        return `
            <div class="food-chip" onclick="openFoodMenuById('${f.id}')">
                <span>${f.name}${hasMenu}</span>
                <span class="badge-meal">${mealBadge}</span>
                <span onclick="event.stopPropagation(); deleteFood('${f.id}')" style="color: #ef4444; cursor: pointer; font-weight: bold; margin-left: 0.2rem;">✕</span>
            </div>
        `;
    }).join('');
}

window.openFoodMenuById = function(id) {
    const food = foodList.find(f => f.id === id);
    if (food) openMenuModal(food);
};

window.deleteFood = function(id) {
    foodList = foodList.filter(f => f.id !== id);
    localStorage.setItem('meal_decider_foods', JSON.stringify(foodList));
    renderFoodList();
    updateFilteredList();
};

// 7. 一週菜單
function initWeeklyPlanner() {
    const genBtn = document.getElementById('genWeeklyBtn');
    if (genBtn) genBtn.addEventListener('click', generateWeeklyGrid);
    generateWeeklyGrid();
}

function generateWeeklyGrid() {
    const grid = document.getElementById('weeklyGrid');
    if (!grid) return;

    const days = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    const lunchPool = foodList.filter(f => f.mealType === 'all' || f.mealType === 'lunch');
    const dinnerPool = foodList.filter(f => f.mealType === 'all' || f.mealType === 'dinner');

    grid.innerHTML = days.map(d => {
        const lunch = lunchPool[Math.floor(Math.random() * lunchPool.length)]?.name || '排骨便當';
        const dinner = dinnerPool[Math.floor(Math.random() * dinnerPool.length)]?.name || '日式拉麵';
        return `
            <div class="day-card">
                <h4>${d} 🍱</h4>
                <div class="meal-slot"><span>🌞 午餐提案</span><strong>${lunch}</strong></div>
                <div class="meal-slot"><span>🌙 晚餐提案</span><strong>${dinner}</strong></div>
            </div>
        `;
    }).join('');
}
