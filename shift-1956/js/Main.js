import { Config, GameAssets } from './Config.js';
import { Truck, FallingPart } from './GameEntity.js';
import { ParticleSystem } from './ParticleSystem.js';
import { AssetLoader } from './AssetLoader.js';

let app;
let truck;
let particles;
let backgroundLayer;
let bloomLayer;
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

const inputState = { left: false, right: false, pointerActive: false, pointerX: null };

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
    resetAnnouncer();

    const bgTexture = texturesRef[GameAssets.background];
    backgroundLayer = new PIXI.TilingSprite(bgTexture, app.screen.width, app.screen.height);
    backgroundLayer.tileScale.set(app.screen.height / bgTexture.height);
    app.stage.addChild(backgroundLayer);

    bloomLayer = new PIXI.TilingSprite(PIXI.Texture.WHITE, app.screen.width, app.screen.height);
    bloomLayer.tint = 0x1b2c57;
    bloomLayer.alpha = 0.08;
    bloomLayer.blendMode = PIXI.BLEND_MODES.ADD;
    app.stage.addChild(bloomLayer);

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

    truck = new Truck(texturesRef[GameAssets.truck]);
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
    bloomLayer.width = app.screen.width;
    bloomLayer.height = app.screen.height;
}

function setupInput() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') inputState.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd') inputState.right = true;
    });
    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') inputState.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd') inputState.right = false;
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
}

function startGame() {
    gameState = 'PLAYING';
    score = 0;
    time = Config.duration;
    streak = 0;
    parts.forEach((p) => partsContainer.removeChild(p));
    parts = [];
    document.getElementById('overlay-screen').classList.remove('active');
    updateHUD();
    resetAnnouncer();
    const timerInterval = setInterval(() => {
        if (gameState !== 'PLAYING') {
            clearInterval(timerInterval);
            return;
        }
        time--;
        if (time <= 0) endGame();
        updateHUD();
    }, 1000);
}

function gameLoop(delta) {
    if (gameState !== 'PLAYING') return;
    truck.update(delta, inputState);
    if (truck.x < 100) truck.x = 100;
    if (truck.x > app.screen.width - 100) truck.x = app.screen.width - 100;
    backgroundLayer.tilePosition.x -= truck.vx * Config.parallax.tunnel;
    bloomLayer.tilePosition.x -= truck.vx * Config.parallax.bloom;
    spawnTimer += delta;
    let currentRate = Config.spawnRates.start;
    if (time < 35) currentRate = Config.spawnRates.mid;
    if (time < 15) currentRate = Config.spawnRates.end;
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

function speedMultiplier(timeLeft) {
    if (timeLeft > 35) return 1.0;
    if (timeLeft > 15) return 1.3;
    return 1.6;
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
    const bucketY = truckEntity.y - truckEntity.height * 0.6;
    const dx = Math.abs(truckEntity.x - part.x);
    const dy = Math.abs(bucketY - part.y);
    return dx < 100 && dy < 50;
}

function handleCatch(part) {
    if (part.type === 'good') {
        streak++;
        const multiplier = streak >= Config.streakThreshold ? (streak > Config.streakThreshold + 2 ? 2 : 1.5) : 1;
        const value = Math.round((part.meta?.score || 50) * multiplier);
        score += value;
        particles.createExplosion(part.x, part.y, part.meta?.particleColor || 0xffd400);
        pulseHUD('score-panel');
        announcePart(part.meta, value, multiplier);
    } else {
        score += part.meta?.damage || -100;
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

function announcePart(meta = {}, value, multiplier) {
    if (!announcerPayloadEl) return;
    const label = meta.label || 'PREMIUM PART';
    const detail = `+${value} pts • x${multiplier.toFixed(1)} streak`;
    announcerPayloadEl.innerText = label.toUpperCase();
    announcerDetailEl.innerText = detail.toUpperCase();
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
    announcerDetailEl.innerText = (meta.damage || -100).toString() + ' pts';
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
    announcerPayloadEl.innerText = 'CALIBRATING';
    announcerDetailEl.innerText = 'AWAITING COMMAND';
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
    document.getElementById('overlay-screen').classList.add('active');
    document.getElementById('start-btn').innerText = 'PLAY AGAIN';
    document.getElementById('final-score').classList.remove('hidden');
    document.getElementById('final-score-val').innerText = score;
    announceHazard({ label: 'SHIFT COMPLETE', damage: score });
}

