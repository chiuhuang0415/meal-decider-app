// app.js - Meal Decider Pro v7.0 Ultimate Edition

const DEFAULT_FOODS = [
    { id: '1', name: '日式拉麵', category: 'noodle', mealType: 'all', reason: '濃郁湯頭與彈牙麵條，帶來滿滿療癒感！', menuText: '• 特濃豚骨拉麵 $260\n• 雞白湯拉麵 $240\n• 焦香黑蒜拉麵 $270\n• 替玉(加麵) $30' },
    { id: '2', name: '排骨/雞腿便當', category: 'rice', mealType: 'lunch', reason: '主菜配菜一次到位，CP值午餐首選。', menuText: '• 招牌大排骨飯 $110\n• 酥炸大雞腿飯 $120\n• 控肉飯 $100' },
    { id: '3', name: '健康舒肥雞餐盒', category: 'light', mealType: 'lunch', reason: '低升糖高蛋白質，午後精神好。', menuText: '• 蒜香舒肥雞胸餐盒 $150\n• 鹽烤鮭魚餐盒 $180' },
    { id: '4', name: '紅燒牛肉麵', category: 'noodle', mealType: 'all', reason: '軟嫩牛肉搭配慢熬高湯，經典美味。', menuText: '• 紅燒半筋半肉麵 $210\n• 清燉牛肉麵 $190\n• 滷大腸 $60' },
    { id: '5', name: '義大利麵 / 燉飯', category: 'exotic', mealType: 'dinner', reason: '奶油白醬或濃郁青醬，異國浪漫晚餐。', menuText: '• 粉紅醬海鮮麵 $280\n• 青醬培根燉飯 $260' },
    { id: '6', name: '韓式泡菜鍋物', category: 'exotic', mealType: 'dinner', reason: '酸辣泡菜湯底配融化起司，聚餐首選。', menuText: '• 起司泡菜豬肉鍋 $240\n• 辣炒年糕 $150' },
    { id: '7', name: '手工煎餃 / 水餃', category: 'noodle', mealType: 'all', reason: '一口一個多汁飽滿，快速美味！', menuText: '' },
    { id: '8', name: '美式雙層起司堡', category: 'fast', mealType: 'all', reason: '多汁牛肉排爆汁起司，犒賞自己！', menuText: '' },
    { id: '9', name: '迴轉壽司 / 丼飯', category: 'exotic', mealType: 'all', reason: '鮮甜生魚片與醋飯，精緻享受。', menuText: '' },
    { id: '10', name: '泰式綠咖哩雞飯', category: 'exotic', mealType: 'dinner', reason: '椰奶與微辣辛香料，東南亞開胃神作。', menuText: '' },
    { id: '11', name: '滑嫩海南雞飯', category: 'rice', mealType: 'lunch', reason: '雞油飯配滑嫩雞肉，清爽午餐。', menuText: '' },
    { id: '12', name: '鹹酥雞 / 炸雞', category: 'fast', mealType: 'dinner', reason: '九層塔香氣配上紓壓炸物萬歲！', menuText: '' }
];

const DEFAULT_RECIPES = [
    { id: 'r1', title: '經典番茄炒蛋', ingredients: '• 番茄 2顆\n• 雞蛋 3顆\n• 蔥花 1根\n• 鹽 1/2小匙\n• 糖 1小匙\n• 番茄醬 1大匙', steps: '1. 熱鍋加油，雞蛋炒至7分熟盛起。\n2. 爆香蔥白，下番茄塊炒出汁水。\n3. 加雞蛋與調味料翻炒，撒蔥花出鍋！' },
    { id: 'r2', title: '蒜香奶油煎雞腿排', ingredients: '• 去骨雞腿排 2片\n• 蒜頭 5瓣\n• 無鹽奶油 15g\n• 黑胡椒、鹽 適量', steps: '1. 雞腿排皮朝下小火煎6-8分鐘。\n2. 翻面加蒜片與奶油，反覆淋在雞腿上。\n3. 兩面金黃後撒胡椒鹽即完成！' },
    { id: 'r3', title: '麻婆豆腐', ingredients: '• 嫩豆腐 1盒\n• 豬絞肉 100g\n• 辣豆瓣醬 1.5大匙\n• 花椒粉 1小匙\n• 蒜末、薑末 少許\n• 太白粉水 適量', steps: '1. 豆腐丁川燙備用。\n2. 炒香絞肉，加辣豆瓣醬炒出紅油。\n3. 加水與豆腐煮滾，勾薄芡出鍋！' },
    { id: 'r4', title: '蔥燒豆腐', ingredients: '• 板豆腐 1盒（務必板豆腐，嫩豆腐會失去口感，切約1公分多厚片）\n• 蔥 2-3根（蔥白蔥綠分開，蔥白稍微拍打較好出味）\n• 食用油 適量（煎豆腐、煸蔥用）\n• 糖 1.5匙（可依口味調整）\n• 水 適量\n• 老抽 少許（增添醬色）\n• 一般醬油 適量\n• 香油 少許（起鍋前用）\n• 太白粉水 適量（非必須，想收濃稠再用）', steps: '1. 豆腐切片，蔥白拍過，蔥白蔥綠分開放。\n2. 鍋燒熱轉小火，豆腐滑入慢煎，約5分鐘翻面一次，過程輕搖鍋子防沾。煎至兩面金黃、豆香味出來後盛出備用（大火會外焦內生又容易破，翻面可用筷子從下方撥、湯匙輔助保持完整；不想煎太油也可將豆腐重壓出水後直接煨煮）。\n3. 鍋中補一點油，小火將蔥白蔥綠煸香，煸到蔥白稍變色、蔥油香明顯。\n4. 加入糖1.5匙，接著先加水、再加醬油（含老抽），豆腐放回鍋中開火煨煮（一定要先水後醬油，醬油才不會因高溫燒焦；豆腐煎過流失水分，煨煮時會像海綿吸飽湯汁更入味）。\n5. 煨至入味後依喜好收乾湯汁或用太白粉水勾芡，收汁時可持續搖晃鍋子讓鍋邊醬油微焦化，增添鍋氣與層次，起鍋前滴幾滴香油即可！' },
    { id: 'r5', title: '照燒雞腿排', ingredients: '• 去骨雞腿排 2片\n• 洋蔥絲 1顆\n• 蒜頭碎 3瓣\n• 青蔥(切蔥花) 1支\n• 白芝麻 少許\n• 醬油 4大匙\n• 味醂 3大匙\n• 米酒 2大匙\n• 水 2大匙\n• 砂糖 1.5大匙\n• 蜂蜜 1小匙', steps: '1. 雞腿排肉面輕劃幾刀，皮面擦乾備用。\n2. 平底鍋下少許油，雞皮朝下冷鍋中火慢煎至金黃酥脆，翻面再煎3-4分鐘至熟。\n3. 雞排推到鍋邊，下蒜碎與洋蔥絲炒到軟化帶甜香。\n4. 倒入調好的照燒醬汁(醬油、味醂、米酒、水、砂糖、蜂蜜)，轉中小火，雞排翻面裹醬。\n5. 持續把醬汁淋在雞排上，收到濃稠出現照燒光澤。\n6. 雞排取出切塊，鋪洋蔥、淋醬汁，撒蔥花與白芝麻。' },
    { id: 'r6', title: '冬瓜蘑菇湯', ingredients: '• 冬瓜 去皮去囊切0.3cm片\n• 洋菇 對切\n• 培根 切片\n• 薑絲 適量\n• 蔥花 適量\n• 水 1200cc\n• 鹽 1.5小匙\n• 白胡椒粉 1/3小匙\n• 味醂 1大匙(或冰糖/味精)', steps: '1. 熱鍋不加油，下培根大火炒出油脂與香氣約1分鐘。\n2. 加洋菇繼續大火炒至表面微焦香。\n3. 倒入水、冬瓜片，加鹽、白胡椒粉、味醂調味。\n4. 水滾後轉中小火煮10-12分鐘至冬瓜熟透。\n5. 起鍋前撒上薑絲與蔥花。' },
    { id: 'r7', title: '番茄蛤蜊湯', ingredients: '• 牛番茄 對切\n• 洋蔥 切小塊\n• 板豆腐 切塊\n• 蛤蜊 吐沙備用\n• 蔥花 適量\n• 橄欖油 1大匙\n• 水 1000cc\n• 鹽 1小匙\n• 白胡椒粉 1/3小匙\n• 味醂 適量', steps: '1. 鍋中加橄欖油，中火炒洋蔥約1分鐘至微焦糖色。\n2. 加番茄轉大火炒2分鐘至軟化糊狀，釋放茄紅素。\n3. 倒入水、板豆腐，加鹽、白胡椒粉、味醂，滾後轉小火煮10分鐘。\n4. 轉大火放入蛤蜊，煮至開口。\n5. 撒上蔥花上桌。' },
    { id: 'r8', title: '昆布牛肉蛋花湯', ingredients: '• 杏鮑菇 切薄片\n• 乾燥昆布 一小段\n• 牛肉火鍋肉片(梅花牛) 適量\n• 雞蛋 打散\n• 老薑 切絲\n• 蔥花 適量\n• 水 1200cc\n• 鹽 1.5小匙\n• 味醂 2小匙', steps: '1. 冷水放入杏鮑菇片，煮滾後轉小火煮10-12分鐘煮出鮮味。\n2. 關火放入乾燥昆布浸泡10分鐘，利用餘溫泡出鮮味且不混濁。\n3. 重新開大火煮滾，關火倒入蛋花靜置30秒定型，再開火稍滾一下讓蛋花蓬鬆後關火。\n4. 碗中先放生牛肉片和薑絲，將滾燙湯底直接沖入碗中泡熟牛肉，不要攪動，最後撒蔥花。' },
    { id: 'r9', title: '麻油雞蔬菜湯', ingredients: '• 雞翅或雞腿肉 適量\n• 老薑 切片再切粗條\n• 香菇、木耳、高麗菜 各適量\n• 菜心頭 熬湯用可省略\n• 麻油 3大匙\n• 米酒 200cc\n• 水 1000cc\n• 鹽 1.5小匙\n• 冰糖 1小匙(中和麻油苦味)', steps: '1. 中火乾鍋不加油，先煸炒薑條約1分鐘至香氣出來。\n2. 加雞翅中火炒2分鐘至表面變色出油。\n3. 加麻油轉小火煸炒2分鐘，避免麻油變苦。\n4. 加米酒開大火煮1分鐘揮發酒氣，再倒入水煮滾。\n5. 放入所有蔬菜，加鹽和冰糖，煮熟後撈出菜心頭，起鍋前可撒枸杞點綴。' }
];

// 狀態管理
let foodList = JSON.parse(localStorage.getItem('meal_decider_foods_v8')) || DEFAULT_FOODS;
let recipeList = JSON.parse(localStorage.getItem('meal_decider_recipes_v8')) || DEFAULT_RECIPES;
let eatingHistory = JSON.parse(localStorage.getItem('meal_decider_history')) || [];
let weeklyLocks = JSON.parse(localStorage.getItem('meal_decider_weekly_locks')) || {};
let weeklyData = JSON.parse(localStorage.getItem('meal_decider_weekly_data')) || null;

let activeFilters = { category: 'all' };
let timeMode = 'auto';
let currentMealTime = 'lunch';
let currentFilteredList = [...foodList];
let selectedFood = null;
let currentModalFood = null;
let currentModalRecipe = null;
let recentPicks = [];
let isRolling = false;

// Toast 通知系統
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('exit');
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}
// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initBottomNav();
    initTimeDetection();
    initFilterDrawer();
    initSlotMachine();
    initFoodManager();
    initWeeklyPlanner();
    initMenuModal();
    initRecipeHub();
    initHistory();
    updateTimeAndFilter();
});

// 1. 底部導覽列
function initBottomNav() {
    const tabs = document.querySelectorAll('.bottom-tab');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// 2. 時間感知
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
    (mode === 'auto' ? document.getElementById('timeBtnAuto') : activeBtn)?.classList.add('active');
    updateTimeAndFilter();
}

function updateTimeAndFilter() {
    const hour = new Date().getHours() + new Date().getMinutes() / 60;
    if (timeMode === 'auto') {
        currentMealTime = (hour >= 5 && hour < 14.5) ? 'lunch' : 'dinner';
        const label = currentMealTime === 'lunch' ? '🌞 午餐時段' : '🌙 晚餐時段';
        document.getElementById('autoTimeBadge').textContent = `⏰ 系統已自動對時：${label}`;
    } else {
        currentMealTime = timeMode;
        const label = currentMealTime === 'lunch' ? '🌞 午餐時段' : '🌙 晚餐時段';
        document.getElementById('autoTimeBadge').textContent = `⏰ 已手動指定：${label}`;
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

// 3. 快篩
function initFilterDrawer() {
    const toggleBtn = document.getElementById('toggleFilterBtn');
    const filterBody = document.getElementById('filterBody');
    if (toggleBtn && filterBody) toggleBtn.addEventListener('click', () => filterBody.classList.toggle('hidden'));
    document.querySelectorAll('.chip-group').forEach(group => {
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

// 4. 拉霸機 (含防連續重複)
function initSlotMachine() {
    const spinBtn = document.getElementById('slotSpinBtn');
    const blindBtn = document.getElementById('slotBlindBtn');
    const mapBtn = document.getElementById('slotMapBtn');
    const menuBtn = document.getElementById('slotMenuBtn');

    if (spinBtn) spinBtn.addEventListener('click', () => { if (!isRolling) startSlotRoll(false); });
    if (blindBtn) blindBtn.addEventListener('click', () => { if (!isRolling) startSlotRoll(true); });
    if (menuBtn) menuBtn.addEventListener('click', () => { if (selectedFood) openMenuModal(selectedFood); });
    if (mapBtn) {
        mapBtn.addEventListener('click', () => {
            if (!selectedFood) return;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedFood.name)}/@${pos.coords.latitude},${pos.coords.longitude},15z`, '_blank'),
                    () => window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedFood.name + ' 附近')}`, '_blank')
                );
            } else {
                window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedFood.name + ' 附近')}`, '_blank');
            }
        });
    }
}

function pickRandomAvoidRecent(pool) {
    if (pool.length <= 1) return pool[0] || null;
    const available = pool.filter(item => !recentPicks.includes(item.id));
    const source = available.length > 0 ? available : pool;
    return source[Math.floor(Math.random() * source.length)];
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
    const interval = setInterval(() => {
        slotText.textContent = pool[Math.floor(Math.random() * pool.length)].name;
    }, 60);

    setTimeout(() => {
        clearInterval(interval);
        slotText.classList.remove('rolling');

        selectedFood = pickRandomAvoidRecent(pool);
        if (!selectedFood) { isRolling = false; return; }

        // 紀錄最近 3 次
        recentPicks.push(selectedFood.id);
        if (recentPicks.length > 3) recentPicks.shift();

        slotText.textContent = selectedFood.name;
        slotReason.textContent = selectedFood.reason || '「就是這道美味！放膽去享用吧！」';
        const mealTag = selectedFood.mealType === 'lunch' ? ' [午餐限定]' : (selectedFood.mealType === 'dinner' ? ' [晚餐限定]' : '');
        categoryTag.textContent = `🎉 今日決策首選${mealTag}`;

        mapBtn.classList.remove('hidden');
        menuBtn.classList.remove('hidden');
        isRolling = false;

        // 自動記入歷史
        addToHistory(selectedFood.name);

        if (window.confetti) confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }, 1600);
}

// 5. 歷史紀錄
function initHistory() {
    renderHistoryList();
    const clearBtn = document.getElementById('clearHistoryBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (!confirm('確定要清除所有歷史紀錄嗎？')) return;
            eatingHistory = [];
            localStorage.setItem('meal_decider_history', JSON.stringify(eatingHistory));
            renderHistoryList();
            showToast('🗑️ 歷史紀錄已清除');
        });
    }
}

function addToHistory(name) {
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    eatingHistory.unshift({ name, time: timeStr });
    if (eatingHistory.length > 50) eatingHistory.pop();
    localStorage.setItem('meal_decider_history', JSON.stringify(eatingHistory));
    renderHistoryList();
}

function renderHistoryList() {
    const list = document.getElementById('historyList');
    if (!list) return;
    if (eatingHistory.length === 0) {
        list.innerHTML = '<p style="font-size: 0.82rem; color: #64748b; text-align: center; padding: 2rem 0;">尚無任何歷史紀錄，快去抽籤吧！</p>';
        return;
    }
    list.innerHTML = eatingHistory.map(h => `
        <div class="history-item">
            <span class="h-name">${h.name}</span>
            <span class="h-time">${h.time}</span>
        </div>
    `).join('');
}

// 6. 店家菜單 Modal (純文字)
function initMenuModal() {
    const modal = document.getElementById('menuModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const saveBtn = document.getElementById('saveMenuBtn');

    if (closeBtn) closeBtn.addEventListener('click', closeMenuModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeMenuModal(); });

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (!currentModalFood) return;
            currentModalFood.menuText = document.getElementById('menuTextarea').value.trim();
            const idx = foodList.findIndex(f => f.id === currentModalFood.id);
            if (idx !== -1) {
                foodList[idx] = { ...currentModalFood };
                localStorage.setItem('meal_decider_foods_v8', JSON.stringify(foodList));
            }
            showToast(`✅ 已儲存【${currentModalFood.name}】的菜單`);
            closeMenuModal();
            renderFoodList();
        });
    }
}

function openMenuModal(food) {
    currentModalFood = food;
    document.getElementById('modalStoreName').textContent = food.name;
    document.getElementById('menuTextarea').value = food.menuText || '';
    const tagsEl = document.getElementById('modalStoreTags');
    const mealLabel = food.mealType === 'lunch' ? '🌞 午餐限定' : (food.mealType === 'dinner' ? '🌙 晚餐限定' : '🌞🌙 全天候');
    tagsEl.innerHTML = `<span class="badge-meal">${mealLabel}</span>`;
    document.getElementById('menuModal').classList.remove('hidden');
}

function closeMenuModal() {
    document.getElementById('menuModal').classList.add('hidden');
    currentModalFood = null;
}

// 7. 食譜專區
function initRecipeHub() {
    renderRecipeList();
    const spinBtn = document.getElementById('recipeSpinBtn');
    const addBtn = document.getElementById('openAddRecipeBtn');
    const closeBtn = document.getElementById('closeRecipeModalBtn');
    const saveBtn = document.getElementById('saveRecipeBtn');
    const copyBtn = document.getElementById('copyGroceryBtn');
    const modal = document.getElementById('recipeModal');

    if (spinBtn) {
        spinBtn.addEventListener('click', () => {
            if (recipeList.length === 0) { showToast('食譜庫暫無食譜，先新增一道吧！', 'error'); return; }
            openRecipeModal(recipeList[Math.floor(Math.random() * recipeList.length)]);
            if (window.confetti) confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            openRecipeModal({ id: Date.now().toString(), title: '', ingredients: '', steps: '' });
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeRecipeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeRecipeModal(); });

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const title = document.getElementById('recipeTitleInput').value.trim() || '私房美食';
            const ingText = document.getElementById('recipeIngredientsText').value.trim();
            if (!ingText) { showToast('尚未填寫食材清單！', 'error'); return; }
            navigator.clipboard.writeText(`🛒 【${title} - 買菜採買清單】\n------------------\n${ingText}\n------------------\n出自：靈感美饌決策助手 App`).then(() => {
                showToast('📋 買菜清單已複製到剪貼簿！');
            });
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const title = document.getElementById('recipeTitleInput').value.trim();
            if (!title) { showToast('請輸入食譜名稱！', 'error'); return; }
            const ingredients = document.getElementById('recipeIngredientsText').value.trim();
            const steps = document.getElementById('recipeStepsText').value.trim();

            if (currentModalRecipe && currentModalRecipe.id) {
                const idx = recipeList.findIndex(r => r.id === currentModalRecipe.id);
                const updated = { id: currentModalRecipe.id, title, ingredients, steps };
                if (idx !== -1) { recipeList[idx] = updated; } else { recipeList.push(updated); }
            }

            localStorage.setItem('meal_decider_recipes_v8', JSON.stringify(recipeList));
            showToast(`✅ 已儲存食譜【${title}】`);
            closeRecipeModal();
            renderRecipeList();
        });
    }
}

function renderRecipeList() {
    const grid = document.getElementById('recipeList');
    const countEl = document.getElementById('recipeCount');
    if (!grid) return;
    countEl.textContent = recipeList.length;
    grid.innerHTML = recipeList.map(r => `
        <div class="recipe-card" onclick="openRecipeModalById('${r.id}')">
            <div style="font-size: 1.5rem; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">🍳</div>
            <div class="recipe-card-info">
                <h4>${r.title}</h4>
                <p>${r.ingredients ? r.ingredients.replace(/\n/g, ' ') : '尚無食材說明'}</p>
            </div>
            <span onclick="event.stopPropagation(); deleteRecipe('${r.id}')" style="color: #ef4444; font-weight: bold; cursor: pointer; padding: 0.5rem; font-size: 1.1rem;">✕</span>
        </div>
    `).join('');
}

window.openRecipeModalById = function(id) {
    const r = recipeList.find(rec => rec.id === id);
    if (r) openRecipeModal(r);
};

function openRecipeModal(recipe) {
    currentModalRecipe = recipe;
    document.getElementById('recipeTitleInput').value = recipe.title || '';
    document.getElementById('recipeIngredientsText').value = recipe.ingredients || '';
    document.getElementById('recipeStepsText').value = recipe.steps || '';
    document.getElementById('recipeModal').classList.remove('hidden');
}

function closeRecipeModal() {
    document.getElementById('recipeModal').classList.add('hidden');
    currentModalRecipe = null;
}

window.deleteRecipe = function(id) {
    if (!confirm('確定要刪除這道食譜嗎？')) return;
    recipeList = recipeList.filter(r => r.id !== id);
    localStorage.setItem('meal_decider_recipes_v8', JSON.stringify(recipeList));
    renderRecipeList();
    showToast('🗑️ 食譜已刪除');
};

// 8. 美食店家庫
function initFoodManager() {
    renderFoodList();
    const form = document.getElementById('addFoodForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('foodName');
            const newFood = {
                id: Date.now().toString(),
                name: nameInput.value.trim(),
                category: document.getElementById('foodCategory').value,
                mealType: document.getElementById('foodMealType').value,
                reason: '你親手新增的私房口袋美食！',
                menuText: ''
            };
            foodList.push(newFood);
            localStorage.setItem('meal_decider_foods_v8', JSON.stringify(foodList));
            nameInput.value = '';
            renderFoodList();
            updateFilteredList();
            showToast(`✅ 已新增【${newFood.name}】`);
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
        const hasMenu = f.menuText ? ' 📋' : '';
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
    if (!confirm('確定要刪除這家店嗎？')) return;
    foodList = foodList.filter(f => f.id !== id);
    localStorage.setItem('meal_decider_foods_v8', JSON.stringify(foodList));
    renderFoodList();
    updateFilteredList();
    showToast('🗑️ 店家已刪除');
};

// 9. 一週菜單 (防重複 + 鎖定 + 週末自煮)
function initWeeklyPlanner() {
    const genBtn = document.getElementById('genWeeklyBtn');
    if (genBtn) genBtn.addEventListener('click', generateWeeklyGrid);
    if (weeklyData) {
        renderWeeklyFromData();
    } else {
        generateWeeklyGrid();
    }
}

function generateWeeklyGrid() {
    const grid = document.getElementById('weeklyGrid');
    if (!grid) return;

    const days = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    const lunchPool = foodList.filter(f => f.mealType === 'all' || f.mealType === 'lunch');
    const dinnerPool = foodList.filter(f => f.mealType === 'all' || f.mealType === 'dinner');

    const newWeeklyData = {};

    days.forEach((d, i) => {
        // 若該天已鎖定，保留舊資料
        if (weeklyLocks[d] && weeklyData && weeklyData[d]) {
            newWeeklyData[d] = weeklyData[d];
            return;
        }

        // 午餐：從外食午餐池抽取
        const lunch = lunchPool.length > 0 ? lunchPool[Math.floor(Math.random() * lunchPool.length)].name : '排骨便當';

        // 晚餐：週六日從食譜庫抽取 (自煮日)，平日從外食池抽取（防與午餐重複）
        let dinner;
        const isWeekend = (i >= 5); // 週六=5, 週日=6

        if (isWeekend && recipeList.length > 0) {
            dinner = '🏠 ' + recipeList[Math.floor(Math.random() * recipeList.length)].title;
        } else {
            // 防午晚餐重複
            const dinnerAvail = dinnerPool.filter(f => f.name !== lunch);
            const dinnerSource = dinnerAvail.length > 0 ? dinnerAvail : dinnerPool;
            dinner = dinnerSource.length > 0 ? dinnerSource[Math.floor(Math.random() * dinnerSource.length)].name : '日式拉麵';
        }

        newWeeklyData[d] = { lunch, dinner };
    });

    weeklyData = newWeeklyData;
    localStorage.setItem('meal_decider_weekly_data', JSON.stringify(weeklyData));
    renderWeeklyFromData();
    showToast('✨ 一週菜單已生成（鎖定日保持不變）');
}

function renderWeeklyFromData() {
    const grid = document.getElementById('weeklyGrid');
    if (!grid || !weeklyData) return;

    const days = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    grid.innerHTML = days.map(d => {
        const data = weeklyData[d] || { lunch: '—', dinner: '—' };
        const isLocked = weeklyLocks[d] || false;
        const lockIcon = isLocked ? '🔒' : '🔓';
        const lockedClass = isLocked ? ' locked' : '';
        return `
            <div class="day-card${lockedClass}">
                <h4>
                    <span>${d} 🍱</span>
                    <button class="lock-btn" onclick="toggleLock('${d}')">${lockIcon}</button>
                </h4>
                <div class="meal-slot"><span>🌞 午餐</span><strong>${data.lunch}</strong></div>
                <div class="meal-slot"><span>🌙 晚餐</span><strong>${data.dinner}</strong></div>
            </div>
        `;
    }).join('');
}

window.toggleLock = function(day) {
    weeklyLocks[day] = !weeklyLocks[day];
    localStorage.setItem('meal_decider_weekly_locks', JSON.stringify(weeklyLocks));
    renderWeeklyFromData();
    showToast(weeklyLocks[day] ? `🔒 ${day} 已鎖定` : `🔓 ${day} 已解鎖`);
};
