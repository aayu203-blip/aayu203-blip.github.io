// Game State
const gameState = {
    funds: 0,
    clickCount: 0,
    incomePerSecond: 0,
    clickValue: 1, // Base click value
    startTime: Date.now(),
    upgrades: {
        'training_cones': {
            id: 'training_cones',
            name: 'Training Cones',
            icon: '⚠️',
            baseCost: 15,
            costMultiplier: 1.5,
            level: 0,
            effectType: 'click', // boosts click value
            effectValue: 1,
            description: '+1 per click'
        },
        'youth_scout': {
            id: 'youth_scout',
            name: 'Youth Scout',
            icon: '🔭',
            baseCost: 50,
            costMultiplier: 1.4,
            level: 0,
            effectType: 'income', // boosts passive income
            effectValue: 2,
            description: '+2 €/sec'
        },
        'stadium_seats': {
            id: 'stadium_seats',
            name: 'Cheap Seats',
            icon: '💺',
            baseCost: 200,
            costMultiplier: 1.6,
            level: 0,
            effectType: 'click',
            effectValue: 5,
            description: '+5 per click'
        },
        'hotdog_stand': {
            id: 'hotdog_stand',
            name: 'Hotdog Stand',
            icon: '🌭',
            baseCost: 500,
            costMultiplier: 1.4,
            level: 0,
            effectType: 'income',
            effectValue: 15,
            description: '+15 €/sec'
        },
        'star_player': {
            id: 'star_player',
            name: 'Super Striker',
            icon: '⚽',
            baseCost: 2000,
            costMultiplier: 1.5,
            level: 0,
            effectType: 'income',
            effectValue: 100,
            description: '+100 €/sec'
        }
    }
};

// DOM Elements
const els = {
    funds: document.getElementById('funds'),
    income: document.getElementById('income-display'),
    clickValue: document.getElementById('click-value-display'),
    stadiumBtn: document.getElementById('stadium-btn'),
    upgradeList: document.getElementById('upgrade-list'),
    closeBtn: document.getElementById('close-btn')
};

// Helper: Format Numbers
function formatMoney(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return Math.floor(num);
}

// Helper: Calculate Cost
function getUpgradeCost(upgrade) {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
}

// Core: Update UI
function updateUI() {
    els.funds.innerText = formatMoney(gameState.funds);
    els.income.innerText = '+' + formatMoney(gameState.incomePerSecond);
    els.clickValue.innerText = '+' + formatMoney(gameState.clickValue);

    renderUpgrades();
}

// Core: Click Handler
function handleClick(e) {
    // Add funds
    gameState.funds += gameState.clickValue;
    gameState.clickCount++;

    // Floating Text Effect
    showFloatText(e.clientX, e.clientY, `+${formatMoney(gameState.clickValue)}`);

    // Haptic/Visual Feedback on specific milestones?
    // TODO: Sound or particle effect

    updateUI();
}

// Effect: Floating Text
function showFloatText(x, y, text) {
    const floatEl = document.createElement('div');
    floatEl.className = 'float-text';
    floatEl.innerText = text;

    // Add randomness to position
    const offsetX = (Math.random() - 0.5) * 40;

    floatEl.style.left = `${x + offsetX}px`;
    floatEl.style.top = `${y - 20}px`;

    document.body.appendChild(floatEl);

    setTimeout(() => {
        floatEl.remove();
    }, 800);
}

// Core: Buy Upgrade
function buyUpgrade(upgradeId) {
    const upgrade = gameState.upgrades[upgradeId];
    const cost = getUpgradeCost(upgrade);

    if (gameState.funds >= cost) {
        // Purchase
        gameState.funds -= cost;
        upgrade.level++;

        // Apply Effect
        if (upgrade.effectType === 'click') {
            gameState.clickValue += upgrade.effectValue;
        } else if (upgrade.effectType === 'income') {
            gameState.incomePerSecond += upgrade.effectValue;
        }

        updateUI();
    }
}

// Core: Render Upgrades List
function renderUpgrades() {
    // Clear list (inefficient but simple for now)
    // Optimization: Diffing could be added later
    els.upgradeList.innerHTML = '';

    Object.values(gameState.upgrades).forEach(upgrade => {
        const cost = getUpgradeCost(upgrade);
        const canAfford = gameState.funds >= cost;

        const item = document.createElement('div');
        item.className = `upgrade-item ${canAfford ? '' : 'disabled'}`;

        item.innerHTML = `
            <div class="upgrade-icon">${upgrade.icon}</div>
            <div class="upgrade-info">
                <span class="upgrade-name">${upgrade.name}</span>
                <span class="upgrade-effect">${upgrade.description}</span>
            </div>
            <div class="upgrade-cost">
                €${formatMoney(cost)}
                <span class="upgrade-level">Lvl ${upgrade.level}</span>
            </div>
        `;

        if (canAfford) {
            item.onclick = () => buyUpgrade(upgrade.id);
        }

        els.upgradeList.appendChild(item);
    });
}

// Core: Game Loop (Passive Income)
setInterval(() => {
    if (gameState.incomePerSecond > 0) {
        // Add 1/10th of income per 100ms for smoothness
        gameState.funds += gameState.incomePerSecond / 10;
        updateUI();
    }
}, 100);

// Init
function init() {
    // Check if we are running locally to add background
    if (window.self === window.top) {
        document.body.classList.add('dev-mode');
    }

    // Bind Click
    els.stadiumBtn.addEventListener('mousedown', handleClick); // mousedown feels faster than click

    // Bind Close Button (Portals SDK)
    els.closeBtn.addEventListener('click', () => {
        if (window.PortalsSdk) {
            PortalsSdk.closeIframe();
        } else {
            console.warn('PortalsSdk not found (running locally?)');
        }
    });

    updateUI();
}

init();
