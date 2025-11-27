import { Config, PARTS, HAZARDS, TICKER_MESSAGES } from './config.js';
import { Hauler, Payload, FaultCluster } from './gameEntities.js';

const ui = {
    splash: document.getElementById('splash-screen'),
    start: document.getElementById('start-shift'),
    prizeOverlay: document.getElementById('prize-overlay'),
    prizeScore: document.getElementById('prize-score'),
    prizeContinue: document.getElementById('prize-continue'),
    shiftValue: document.getElementById('shift-value'),
    flowStability: document.getElementById('flow-stability'),
    payloadThumb: document.getElementById('payload-thumb'),
    payloadName: document.getElementById('payload-name'),
    payloadDesc: document.getElementById('payload-desc'),
    rewardTarget: document.getElementById('reward-target'),
    rewardFill: document.getElementById('reward-fill'),
    rewardStatus: document.getElementById('reward-status'),
    tickerTrack: document.getElementById('ticker-track'),
    tickerAlert: document.getElementById('ticker-alert'),
    timerValue: document.getElementById('timer-value'),
    timerProgress: document.getElementById('timer-progress'),
    bgPulse: document.getElementById('bg-pulse')
};

let app;
let textures = {};
let hauler;
let payloadLayer;
let hazardLayer;
let activePayloads = [];
let activeHazards = [];
let tickerQueue = [...TICKER_MESSAGES];

const state = {
    running: false,
    time: Config.duration,
    score: 0,
    streak: 0,
    prizeUnlocked: false,
    spawnCounter: 0,
    tickerInterval: null,
    pulseInterval: null,
    timerInterval: null
};

const input = {
    left: false,
    right: false,
    pointerActive: false,
    pointerX: 0
};

ui.start.addEventListener('click', () => {
    ui.splash.style.display = 'none';
    boot();
});

ui.prizeContinue.addEventListener('click', () => {
    ui.prizeOverlay.classList.remove('active');
    resumeShift();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') input.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') input.right = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') input.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') input.right = false;
});

const container = document.getElementById('game-container');

async function boot() {
    await loadAssets();
    createTicker();
    createScene();
    prepareShift();
}

async function loadAssets() {
    const manifest = new Set([
        Config.assets.truckBody,
        Config.assets.truckWheel,
        ...PARTS.map((p) => p.texture),
        ...HAZARDS.map((h) => h.texture)
    ]);
    const loader = PIXI.Assets;
    for (const asset of manifest) {
        loader.add(asset, asset);
    }
    textures = await loader.load([...manifest]);
}

function createScene() {
    app = new PIXI.Application({
        width: Config.width,
        height: Config.height,
        transparent: true,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1
    });
    container.appendChild(app.view);
    payloadLayer = new PIXI.Container();
    hazardLayer = new PIXI.Container();
    app.stage.addChild(payloadLayer);
    app.stage.addChild(hazardLayer);

    hauler = new Hauler({
        body: textures[Config.assets.truckBody],
        wheel: textures[Config.assets.truckWheel]
    });
    hauler.x = Config.width / 2;
    hauler.y = Config.height - 120;
    app.stage.addChild(hauler);

    app.ticker.add(gameLoop);

    container.addEventListener('pointerdown', pointerMove);
    container.addEventListener('pointermove', pointerMove);
    container.addEventListener('pointerup', () => (input.pointerActive = false));
    container.addEventListener('pointerleave', () => (input.pointerActive = false));
}

function pointerMove(event) {
    const rect = container.getBoundingClientRect();
    input.pointerActive = true;
    input.pointerX = ((event.clientX - rect.left) / rect.width) * Config.width;
}

function prepareShift() {
    ui.prizeOverlay.classList.remove('active');
    state.score = 0;
    state.streak = 0;
    state.time = Config.duration;
    state.prizeUnlocked = false;
    state.spawnCounter = 0;
    activePayloads.forEach((p) => payloadLayer.removeChild(p));
    activeHazards.forEach((h) => hazardLayer.removeChild(h));
    activePayloads = [];
    activeHazards = [];
    updateScore();
    updateTimer();
    updateRewardMeter();
    updatePayloadInfo();
    if (state.tickerInterval) clearInterval(state.tickerInterval);
    runTicker();
    triggerPulse();
    if (state.pulseInterval) clearInterval(state.pulseInterval);
    state.pulseInterval = setInterval(triggerPulse, 10000);
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.running = true;
    startTimerLoop();
}

function triggerPulse() {
    ui.bgPulse.classList.remove('active');
    void ui.bgPulse.offsetWidth;
    ui.bgPulse.classList.add('active');
}

function runTicker() {
    if (state.tickerInterval) clearInterval(state.tickerInterval);
    state.tickerInterval = setInterval(() => {
        tickerQueue.push(tickerQueue.shift());
        ui.tickerTrack.textContent = tickerQueue.concat(tickerQueue).join(' • ');
    }, 15000);
    ui.tickerTrack.textContent = tickerQueue.concat(tickerQueue).join(' • ');
}

function startTimerLoop() {
    state.timerInterval = setInterval(() => {
        if (!state.running) return;
        state.time -= 1;
        updateTimer();
        if (state.time <= 0) {
            endShift();
        }
    }, 1000);
}

function resumeShift() {
    state.running = true;
}

function gameLoop(delta) {
    if (!state.running) return;
    hauler.update(delta, input);
    const leftBound = 180;
    const rightBound = Config.width - 180;
    hauler.x = Math.min(Math.max(hauler.x, leftBound), rightBound);

    state.spawnCounter += delta;
    const spawnRate = getSpawnRate();
    if (state.spawnCounter >= spawnRate) {
        spawnEntity();
        state.spawnCounter = 0;
    }

    activePayloads.forEach((payload, index) => {
        payload.update(delta);
        if (payload.y > Config.height + 120) {
            payloadLayer.removeChild(payload);
            activePayloads.splice(index, 1);
        } else if (checkCollision(payload)) {
            payloadLayer.removeChild(payload);
            activePayloads.splice(index, 1);
            authorizePayload(payload.meta);
        }
    });

    activeHazards.forEach((hazard, index) => {
        hazard.update(delta);
        if (hazard.y > Config.height + 120) {
            hazardLayer.removeChild(hazard);
            activeHazards.splice(index, 1);
        } else if (checkCollision(hazard)) {
            hazardLayer.removeChild(hazard);
            activeHazards.splice(index, 1);
            faultImpact();
        }
    });
}

function getSpawnRate() {
    if (state.time > 30) return Config.spawn.start;
    if (state.time > 15) return Config.spawn.mid;
    return Config.spawn.end;
}

function spawnEntity() {
    const isHazard = Math.random() < 0.25;
    const x = Math.random() * (Config.width - 360) + 180;
    if (isHazard) {
        const meta = HAZARDS[Math.floor(Math.random() * HAZARDS.length)];
        const hazard = new FaultCluster(textures[meta.texture]);
        hazard.x = x;
        hazardLayer.addChild(hazard);
        activeHazards.push(hazard);
    } else {
        const meta = PARTS[Math.floor(Math.random() * PARTS.length)];
        const payload = new Payload(textures[meta.texture], meta);
        payload.x = x;
        payloadLayer.addChild(payload);
        activePayloads.push(payload);
    }
}

function checkCollision(entity) {
    const bounds = entity.getBounds();
    const truckBounds = hauler.body.getBounds();
    const bucket = {
        x: truckBounds.x + 60,
        y: truckBounds.y + truckBounds.height * 0.35,
        width: truckBounds.width - 120,
        height: truckBounds.height * 0.3
    };
    return (
        bounds.x < bucket.x + bucket.width &&
        bounds.x + bounds.width > bucket.x &&
        bounds.y < bucket.y + bucket.height &&
        bounds.y + bounds.height > bucket.y
    );
}

function authorizePayload(meta) {
    state.streak += 1;
    const multiplier = state.streak >= Config.streakThreshold ? 1.5 : 1;
    state.score += Math.round(Config.baseScore * multiplier);
    if (state.streak >= Config.streakThreshold) {
        ui.flowStability.textContent = 'FLOW STABILITY ×1.5';
    } else {
        ui.flowStability.textContent = 'FLOW STABILITY ×1.0';
    }
    updateScore();
    updateRewardMeter();
    updatePayloadInfo(meta);
    tickerAlert(`PROCURED: ${meta.name.toUpperCase()} +${Config.baseScore} SHIFT VALUE`);
    checkPrize();
}

function faultImpact() {
    state.streak = 0;
    state.score = Math.max(0, state.score - Config.hazardPenalty);
    ui.flowStability.textContent = 'FLOW STABILITY ×1.0';
    updateScore();
    updateRewardMeter();
    tickerAlert('FAULT CLUSTER DETECTED −60');
}

function updateScore() {
    ui.shiftValue.textContent = state.score.toString().padStart(4, '0');
}

function updatePayloadInfo(meta) {
    if (!meta) {
        ui.payloadThumb.innerHTML = '';
        ui.payloadName.textContent = 'Standby';
        ui.payloadDesc.textContent = 'Gravity line awaiting payload';
        return;
    }
    ui.payloadThumb.innerHTML = `<img src="${meta.texture}" alt="${meta.name}">`;
    ui.payloadName.textContent = meta.name;
    ui.payloadDesc.textContent = meta.description;
}

function updateRewardMeter() {
    const ratio = Math.min(state.score / Config.prizeTarget, 1);
    ui.rewardTarget.textContent = `${Math.min(state.score, Config.prizeTarget)} / ${Config.prizeTarget}`;
    ui.rewardFill.style.height = `${ratio * 100}%`;
    ui.rewardStatus.textContent = ratio >= 1 ? 'AUTHORIZED' : 'STANDING BY';
}

function checkPrize() {
    if (state.prizeUnlocked) return;
    if (state.score >= Config.prizeTarget) {
        state.prizeUnlocked = true;
        state.running = false;
        ui.prizeScore.textContent = state.score;
        ui.prizeOverlay.classList.add('active');
    }
}

function updateTimer() {
    ui.timerValue.textContent = state.time.toString().padStart(2, '0');
    const circumference = 327;
    const progress = (state.time / Config.duration) * circumference;
    ui.timerProgress.style.strokeDashoffset = `${circumference - progress}`;
}

function tickerAlert(message) {
    ui.tickerAlert.textContent = message;
    ui.tickerAlert.classList.add('active');
    setTimeout(() => ui.tickerAlert.classList.remove('active'), 1800);
}

function endShift() {
    state.running = false;
    clearInterval(state.timerInterval);
    ui.prizeOverlay.classList.add('active');
    ui.prizeScore.textContent = state.score;
    ui.rewardStatus.textContent = 'SHIFT COMPLETE';
}

window.addEventListener('resize', () => {
    if (!app) return;
    const ratio = Math.min(container.clientWidth / Config.width, container.clientHeight / Config.height);
    app.stage.scale.set(ratio);
    const offsetX = (container.clientWidth - Config.width * ratio) / 2;
    const offsetY = (container.clientHeight - Config.height * ratio) / 2;
    app.view.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

