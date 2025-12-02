import { Config, GameAssets } from './Config.js';
import { Truck, FallingPart } from './GameEntity.js';
import { ParticleSystem } from './ParticleSystem.js';
import { AssetLoader } from './AssetLoader.js';

let app;
let truck;
let particles;
let backgroundLayer;
let partsContainer;
let texturesRef;
let parts = [];
let gameState = 'IDLE';
let score = 0;
let time = Config.duration;
let streak = 0;
let spawnTimer = 0;
let announcerPayloadEl;
let announcerDetailEl;
let introPlayed = false;
let speedStageIndex = 0;
let prizeAchieved = false;
let speedIndicatorEl;
let prizeDisplayEl;
let prizeStatusEl;
let prizeOverlayEl;
let prizeOverlayScoreEl;
let prizeContinueBtn;
let shiftTimer = null;
let calloutIndex = 0;

const SPEED_LABELS = ['STAGE 1 · STABLE', 'STAGE 2 · SURGE', 'STAGE 3 · CRITICAL'];
const CALL_OUTS = [
    {
        title: 'VOLVO A40 TURBO CORE',
        detail: 'PTC PRECISION · SWEDISH HAUL FLEET READY'
    },
    {
        title: 'SCANIA HYDRAULIC SEAL KIT',
        detail: 'PTC STOCK · ZERO-DOWNTIME COMMITMENT'
    },
    {
        title: 'KOMATSU CHARGE COOLER',
        detail: 'PTC GLOBAL · 24H DISPATCH ASSURED'
    },
    {
        title: 'CAT FINAL DRIVE ASSEMBLY',
        detail: 'PTC TESTED · HEAVY EARTHMOVING PAYLOAD'
    }
];

// Wheel positions calibrated via wheel-calibrator.html
// Front wheel: x: 1484, y: 1067, size: 435 (50% larger than 290)
// Rear wheel: x: 684, y: 1067, size: 435 (50% larger than 290)
const WHEEL_LAYOUT = [
    { center: { x: 1484, y: 1067 }, size: 435 },   // Front wheel
    { center: { x: 684, y: 1067 }, size: 435 }     // Rear wheel
];

// Input is split into keyboard and gamepad channels, then merged each frame
const inputState = {
    keyboardLeft: false,
    keyboardRight: false,
    gamepadLeft: false,
    gamepadRight: false,
    left: false,
    right: false,
    pointerActive: false,
    pointerX: null
};

// Track active gamepad if the browser exposes connection events
let activeGamepadIndex = null;

export async function initGame() {
    app = new PIXI.Application({
        resizeTo: window,
        backgroundColor: 0x050505,
        resolution: window.devicePixelRatio || 1,
        antialias: true,
        autoDensity: true
    });
    document.getElementById('game-container').appendChild(app.view);
    const loader = new AssetLoader(GameAssets);
    texturesRef = await loader.loadAll();
    setupScene();
}

function setupScene() {
    announcerPayloadEl = document.getElementById('announcer-payload');
    announcerDetailEl = document.getElementById('announcer-detail');
    speedIndicatorEl = document.getElementById('speed-indicator');
    prizeDisplayEl = document.getElementById('prize-display');
    prizeStatusEl = document.getElementById('prize-status');
    prizeOverlayEl = document.getElementById('prize-overlay');
    prizeOverlayScoreEl = document.getElementById('prize-overlay-score');
    prizeContinueBtn = document.getElementById('prize-continue');
    resetAnnouncer();
    setSpeedIndicator(0, true);
    updatePrizeDisplay(true);
    prizeContinueBtn?.addEventListener('click', resumeShift);

    const bgTexture = texturesRef[GameAssets.background];
    backgroundLayer = new PIXI.TilingSprite(bgTexture, app.screen.width, app.screen.height);
    backgroundLayer.tileScale.set(app.screen.height / bgTexture.height);
    app.stage.addChild(backgroundLayer);

    const vignette = new PIXI.Graphics();
    vignette.beginFill(0x000000, 0.7);
    vignette.drawRect(0, 0, app.screen.width, app.screen.height);
    vignette.endFill();
    const mask = new PIXI.Graphics();
    mask.beginFill(0xffffff);
    mask.drawCircle(app.screen.width / 2, app.screen.height / 2, app.screen.height * 0.8);
    mask.endFill();
    vignette.mask = mask;
    app.stage.addChild(vignette);

    partsContainer = new PIXI.Container();
    app.stage.addChild(partsContainer);

    const truckTexture = texturesRef[GameAssets.truck];
    const wheelTexture = texturesRef[GameAssets.truckWheel];
    const wheelsMeta = WHEEL_LAYOUT.map(({ center, size }) => ({
        texture: wheelTexture,
        center: { ...center },
        size
    }));
    truck = new Truck(truckTexture, wheelsMeta);
    truck.x = app.screen.width / 2;
    truck.y = app.screen.height - 60;
    app.stage.addChild(truck);

    particles = new ParticleSystem(app);
    setupInput();
    window.addEventListener('resize', () => resizeScene(bgTexture));
    document.getElementById('start-btn').addEventListener('click', startGame);
    app.ticker.add((delta) => gameLoop(delta));
    resizeScene(bgTexture);
    runIntro();
}

function resizeScene(bgTexture) {
    if (!backgroundLayer) return;
    backgroundLayer.width = app.screen.width;
    backgroundLayer.height = app.screen.height;
    const scale = app.screen.height / bgTexture.height;
    backgroundLayer.tileScale.set(scale);
}

function setupInput() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') inputState.keyboardLeft = true;
        if (e.key === 'ArrowRight' || e.key === 'd') inputState.keyboardRight = true;
    });
    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') inputState.keyboardLeft = false;
        if (e.key === 'ArrowRight' || e.key === 'd') inputState.keyboardRight = false;
    });
    const handlePointer = (e) => {
        const rect = app.view.getBoundingClientRect();
        const relative = (e.clientX - rect.left) / rect.width;
        inputState.pointerX = relative * app.screen.width;
        inputState.pointerActive = true;
    };
    window.addEventListener('pointerdown', handlePointer);
    window.addEventListener('pointermove', (e) => {
        if (!inputState.pointerActive) return;
        handlePointer(e);
    });
    window.addEventListener('pointerup', () => {
        inputState.pointerActive = false;
    });
    window.addEventListener('pointerleave', () => {
        inputState.pointerActive = false;
    });

    // GAMEPAD (PS4 / DualShock) INPUT EVENTS – optional, we still poll as a fallback
    window.addEventListener('gamepadconnected', (e) => {
        const gp = e.gamepad;
        if (gp.mapping === 'standard') {
            activeGamepadIndex = gp.index;
        } else if (activeGamepadIndex === null) {
            activeGamepadIndex = gp.index;
        }
    });

    window.addEventListener('gamepaddisconnected', (e) => {
        if (activeGamepadIndex === e.gamepad.index) {
            activeGamepadIndex = null;
        }
    });
}

function startGame() {
    gameState = 'PLAYING';
    score = 0;
    time = Config.duration;
    streak = 0;
    speedStageIndex = 0;
    prizeAchieved = false;
    calloutIndex = 0;
    prizeOverlayEl?.classList.remove('active');
    parts.forEach((p) => partsContainer.removeChild(p));
    parts = [];
    document.getElementById('overlay-screen').classList.remove('active');
    updateHUD();
    resetAnnouncer();
    setSpeedIndicator(speedStageIndex, true);
    updatePrizeDisplay(true);
    startTimer();
}

function gameLoop(delta) {
    if (gameState !== 'PLAYING') return;

    // Refresh gamepad state and merge with keyboard each frame
    applyGamepadInput();
    inputState.left = inputState.keyboardLeft || inputState.gamepadLeft;
    inputState.right = inputState.keyboardRight || inputState.gamepadRight;

    truck.update(delta, inputState);
    if (truck.x < 100) truck.x = 100;
    if (truck.x > app.screen.width - 100) truck.x = app.screen.width - 100;
    backgroundLayer.tilePosition.x -= truck.vx * Config.parallax.tunnel;
    spawnTimer += delta;
    const stage = getSpeedStage(time);
    let currentRate = Config.spawnRates.start;
    if (stage === 1) currentRate = Config.spawnRates.mid;
    if (stage === 2) currentRate = Config.spawnRates.end;
    if (stage !== speedStageIndex) {
        speedStageIndex = stage;
        setSpeedIndicator(stage);
    }
    if (spawnTimer > currentRate) {
        spawnPart();
        spawnTimer = 0;
    }
    for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.update(delta, speedMultiplier(time));
        if (checkCollision(truck, p)) {
            handleCatch(p);
            partsContainer.removeChild(p);
            parts.splice(i, 1);
        } else if (p.y > app.screen.height) {
            partsContainer.removeChild(p);
            parts.splice(i, 1);
        }
    }
    particles.update(delta);
}

function applyGamepadInput() {
    // Reset gamepad channel each frame
    inputState.gamepadLeft = false;
    inputState.gamepadRight = false;

    if (typeof navigator.getGamepads !== 'function') return;

    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = null;

    if (activeGamepadIndex !== null && pads[activeGamepadIndex]) {
        gp = pads[activeGamepadIndex];
    }

    if (!gp) {
        // Fallback: pick the first connected pad
        for (const p of pads) {
            if (p && p.connected) {
                gp = p;
                break;
            }
        }
    }

    if (!gp) return;

    const threshold = 0.25;
    const axisX = gp.axes && gp.axes.length > 0 ? gp.axes[0] : 0;

    const dpadLeft = gp.buttons && gp.buttons[14] ? gp.buttons[14].pressed : false;
    const dpadRight = gp.buttons && gp.buttons[15] ? gp.buttons[15].pressed : false;

    const stickLeft = axisX < -threshold;
    const stickRight = axisX > threshold;

    inputState.gamepadLeft = dpadLeft || stickLeft;
    inputState.gamepadRight = dpadRight || stickRight;
}

function speedMultiplier(timeLeft) {
    if (timeLeft > 35) return 1.0;
    if (timeLeft > 15) return 1.15;
    return 1.3;
}

function getSpeedStage(timeLeft) {
    if (timeLeft <= 15) return 2;
    if (timeLeft <= 35) return 1;
    return 0;
}

function spawnPart() {
    const isBad = Math.random() < 0.3;
    const pool = isBad ? GameAssets.badParts : GameAssets.goodParts;
    const meta = pickWeighted(pool);
    const x = Math.random() * (app.screen.width - 200) + 100;
    const part = new FallingPart(texturesRef[meta.texture], meta, x);
    partsContainer.addChild(part);
    parts.push(part);
}

function pickWeighted(list) {
    const total = list.reduce((sum, item) => sum + (item.weight || 1), 0);
    let roll = Math.random() * total;
    for (const item of list) {
        roll -= item.weight || 1;
        if (roll <= 0) return item;
    }
    return list[list.length - 1];
}

function checkCollision(truckEntity, part) {
    // Use only the truck body sprite bounds (not including wheels)
    // Calculate bounds manually: sprite has anchor (0.5, 1) = center-bottom
    const sprite = truckEntity.sprite;
    const spriteWidth = sprite.width;
    const spriteHeight = sprite.height;
    // Sprite's world position: container position + sprite local position (0, 0 due to anchor)
    const truckWorldX = truckEntity.x;
    const truckWorldY = truckEntity.y;
    // Bounds: left = center - width/2, right = center + width/2, top = bottom - height, bottom = bottom
    const truckLeft = truckWorldX - spriteWidth / 2;
    const truckRight = truckWorldX + spriteWidth / 2;
    const truckTop = truckWorldY - spriteHeight;
    const truckBottom = truckWorldY;
    
    const partBounds = part.getBounds();
    return (
        truckLeft < partBounds.x + partBounds.width &&
        truckRight > partBounds.x &&
        truckTop < partBounds.y + partBounds.height &&
        truckBottom > partBounds.y
    );
}

function handleCatch(part) {
    if (part.type === 'good') {
        streak++;
        const multiplier = streak >= Config.streakThreshold ? (streak > Config.streakThreshold + 2 ? 2 : 1.5) : 1;
        const baseScore = part.meta?.score ?? Config.baseScore;
        const value = Math.round(baseScore * multiplier);
        score += value;
        particles.createExplosion(part.x, part.y, part.meta?.particleColor || 0xffd400);
        pulseHUD('score-panel');
        announcePart(value);
        updatePrizeDisplay();
    } else {
        score = Math.max(0, score + (part.meta?.damage || -100));
        streak = 0;
        particles.createExplosion(part.x, part.y, part.meta?.particleColor || 0xff0000);
        shakeScreen();
        announceHazard(part.meta);
    }
    updateHUD();
}

function updateHUD() {
    document.getElementById('score-display').innerText = score;
    document.getElementById('time-display').innerText = `00:${time < 10 ? '0' + time : time}`;
    const badge = document.getElementById('streak-badge');
    if (streak >= Config.streakThreshold) {
        badge.classList.remove('hidden');
        badge.innerText = `x${streak > Config.streakThreshold + 2 ? '2.0' : '1.5'}`;
    } else {
        badge.classList.add('hidden');
    }
}

function pulseHUD(className) {
    const el = document.querySelector('.' + className);
    gsap.fromTo(el, { scale: 1.08 }, { scale: 1, duration: 0.25, ease: 'power2.out' });
}

function shakeScreen() {
    gsap.to(app.stage, { x: 12, duration: 0.05, yoyo: true, repeat: 5 });
    gsap.to(app.stage, { x: 0, duration: 0.05, delay: 0.3 });
}

function announcePart(value) {
    if (!announcerPayloadEl) return;
    const callout = CALL_OUTS[calloutIndex];
    calloutIndex = (calloutIndex + 1) % CALL_OUTS.length;
    announcerPayloadEl.innerText = callout.title.toUpperCase();
    announcerDetailEl.innerText = `${callout.detail} · +${value} PTS`.toUpperCase();
    gsap.fromTo(
        '#part-announcer',
        { y: 20, opacity: 0.6 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
    );
}

function announceHazard(meta = {}) {
    if (!announcerPayloadEl) return;
    const label = meta.label || 'SCRAP IMPACT';
    announcerPayloadEl.innerText = `${label.toUpperCase()}`;
    announcerDetailEl.innerText = 'ROCKFALL · HOLD COURSE';
    gsap.fromTo(
        '#part-announcer',
        { x: 10, opacity: 0.7 },
        {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => gsap.to('#part-announcer', { opacity: 1, duration: 0.3 })
        }
    );
}

function resetAnnouncer() {
    if (!announcerPayloadEl) return;
    const callout = CALL_OUTS[0];
    announcerPayloadEl.innerText = callout.title.toUpperCase();
    announcerDetailEl.innerText = callout.detail.toUpperCase();
}

function setSpeedIndicator(stageIndex, instant = false) {
    if (!speedIndicatorEl) return;
    speedIndicatorEl.innerText = SPEED_LABELS[stageIndex];
    speedIndicatorEl.classList.remove('flash');
    if (!instant) {
        speedIndicatorEl.classList.add('flash');
    }
}

function updatePrizeDisplay(initial = false) {
    if (!prizeDisplayEl || !prizeStatusEl) return;
    const target = Config.prizeScore;
    prizeDisplayEl.innerText = `${Math.min(score, target)} / ${target}`;
    if (score >= target) {
        prizeStatusEl.innerText = 'REWARD READY';
        prizeStatusEl.classList.add('prize-achieved');
        if (!prizeAchieved && !initial) {
            prizeAchieved = true;
            gsap.fromTo('.prize-panel', { scale: 1.05 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
            pauseShiftForPrize();
        }
    } else {
        prizeStatusEl.innerText = `REWARD READY AT ${target}`;
        prizeStatusEl.classList.remove('prize-achieved');
        if (initial) prizeAchieved = false;
    }
}

function startTimer() {
    if (shiftTimer) clearInterval(shiftTimer);
    shiftTimer = setInterval(() => {
        if (gameState !== 'PLAYING') return;
        time--;
        if (time <= 0) {
            endGame();
        } else {
            updateHUD();
        }
    }, 1000);
}

function pauseShiftForPrize() {
    gameState = 'PAUSED';
    if (shiftTimer) {
        clearInterval(shiftTimer);
        shiftTimer = null;
    }
    prizeOverlayScoreEl.innerText = score;
    prizeOverlayEl.classList.add('active');
    announcerPayloadEl.innerText = 'PRIZE UNLOCKED';
    announcerDetailEl.innerText = 'CLAIM AT PTC DESK';
}

function resumeShift() {
    if (gameState !== 'PAUSED') return;
    prizeOverlayEl.classList.remove('active');
    gameState = 'PLAYING';
    startTimer();
}

function runIntro() {
    if (introPlayed) return;
    introPlayed = true;
    gsap.set(['.brand-corner', '.hud-panel', '#part-announcer'], { opacity: 0, y: 30 });
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to('.brand-corner', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .to(
            '.hud-panel',
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1 },
            '-=0.3'
        )
        .to(
            '#part-announcer',
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
            '-=0.2'
        );
}

function endGame() {
    gameState = 'END';
    if (shiftTimer) {
        clearInterval(shiftTimer);
        shiftTimer = null;
    }
    prizeOverlayEl?.classList.remove('active');
    document.getElementById('overlay-screen').classList.add('active');
    document.getElementById('start-btn').innerText = 'PLAY AGAIN';
    document.getElementById('final-score').classList.remove('hidden');
    document.getElementById('final-score-val').innerText = score;
    announcerPayloadEl.innerText = 'SHIFT COMPLETE';
    announcerDetailEl.innerText = 'PTC · THANK YOU';
}

