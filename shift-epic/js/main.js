// CONFIGURATION
const CONFIG = {
    gravity: 10,
    truckSpeed: 0.8,
    truckFriction: 0.94,
    spawnRate: 60, // frames
    partScale: 0.6,
    truckScale: 0.8,
    duration: 45 // seconds
};

// ASSET MANIFEST
const ASSETS = {
    background: 'assets/background.jpg',
    truck: 'assets/truck.png',
    wheel: 'assets/truck_wheel.png',
    parts: [
        'assets/part_bolt_nut.png',
        'assets/part_bucket_tooth.png',
        'assets/part_clutch_disc.png',
        'assets/part_coil_spring.png',
        'assets/part_fuel_filter.png',
        'assets/part_hydraulic_cylinder.png',
        'assets/part_planetary_ring.png'
    ],
    hazards: [
        'assets/hazard_rock_a.png',
        'assets/hazard_rock_b.png',
        'assets/hazard_rock_c.png',
        'assets/hazard_rock_d.png'
    ]
};

// STATE
let app, truck;
let gameState = 'BOOT'; // BOOT, READY, PLAYING, END
let score = 0;
let timeLeft = CONFIG.duration;
let lives = 3;
let parts = [];
let spawnTimer = 0;
let keys = { left: false, right: false };

// --- BOOT SEQUENCE ---
window.onload = async () => {
    log("System Power On...");
    
    // 1. Initialize PIXI
    try {
        app = new PIXI.Application({
            resizeTo: window,
            backgroundAlpha: 0, // Transparent, we use CSS bg or image
            resolution: window.devicePixelRatio || 1,
            antialias: true
        });
        document.getElementById('viewport').appendChild(app.view);
        log("Video Core Active.");
    } catch (e) {
        log("CRITICAL ERROR: PIXI init failed. " + e.message);
        return;
    }

    // 2. Load Assets
    log("Loading Assets...");
    try {
        // Add Bundle
        PIXI.Assets.add('background', ASSETS.background);
        PIXI.Assets.add('truck', ASSETS.truck);
        PIXI.Assets.add('wheel', ASSETS.wheel);
        ASSETS.parts.forEach(p => PIXI.Assets.add(p, p));
        ASSETS.hazards.forEach(h => PIXI.Assets.add(h, h));

        // Load
        const texturePromise = PIXI.Assets.load([
            'background', 'truck', 'wheel',
            ...ASSETS.parts,
            ...ASSETS.hazards
        ], (progress) => {
            document.getElementById('loader-bar').style.width = (progress * 100) + "%";
        });

        await texturePromise;
        log("Assets Verified.");
    } catch (e) {
        log("ASSET ERROR: " + e.message);
        // We continue anyway, placeholders might be used or it might crash later, but at least we tried
    }

    // 3. Setup Scene
    setupScene();
    
    // 4. Hide Boot Screen
    setTimeout(() => {
        document.getElementById('boot-sequence').style.opacity = 0;
        setTimeout(() => document.getElementById('boot-sequence').style.display = 'none', 500);
        gameState = 'READY';
        log("System Ready.");
    }, 500);
};

function log(msg) {
    console.log(msg);
    const el = document.getElementById('boot-log');
    if(el) el.innerText = msg;
}

// --- SCENE SETUP ---
let bgSprite;
let gameContainer;
let uiContainer; // For in-game PIXI UI if needed

function setupScene() {
    // Background
    try {
        const bgTexture = PIXI.Assets.get('background');
        bgSprite = new PIXI.TilingSprite(bgTexture, app.screen.width, app.screen.height);
        
        // Scale background to cover height
        const scale = app.screen.height / bgTexture.height;
        bgSprite.tileScale.set(scale);
        
        // Darken it slightly for UI pop
        bgSprite.tint = 0x888888; 
        
        app.stage.addChild(bgSprite);
    } catch (e) {
        console.warn("Background load issue", e);
    }

    gameContainer = new PIXI.Container();
    app.stage.addChild(gameContainer);

    // Truck
    createTruck();

    // Input
    window.addEventListener('keydown', e => {
        if(e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
        if(e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    });
    window.addEventListener('keyup', e => {
        if(e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
        if(e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    });

    // Start Button
    document.getElementById('action-btn').addEventListener('click', startGame);

    // Ticker
    app.ticker.add(delta => gameLoop(delta));
    
    // Resize Handler
    window.addEventListener('resize', () => {
        if(bgSprite && PIXI.Assets.get('background')) {
            bgSprite.width = app.screen.width;
            bgSprite.height = app.screen.height;
            const s = app.screen.height / PIXI.Assets.get('background').height;
            bgSprite.tileScale.set(s);
        }
        if(truck) truck.y = app.screen.height - 100;
    });
}

function createTruck() {
    truck = new PIXI.Container();
    
    // Body
    const bodyTex = PIXI.Assets.get('truck');
    const body = new PIXI.Sprite(bodyTex);
    body.anchor.set(0.5, 1);
    body.scale.set(CONFIG.truckScale);
    truck.addChild(body);

    // Wheels (Visual only for now, can animate later)
    const wheelTex = PIXI.Assets.get('wheel');
    
    // Positions relative to truck center/bottom (Need tuning based on image)
    // Approximate based on typical dump truck side view
    const w1 = new PIXI.Sprite(wheelTex);
    w1.anchor.set(0.5);
    w1.scale.set(CONFIG.truckScale);
    w1.x = -130 * CONFIG.truckScale; 
    w1.y = -40 * CONFIG.truckScale; // Slightly up from bottom
    truck.addChild(w1);
    truck.wheels = [w1]; // Store for animation

    const w2 = new PIXI.Sprite(wheelTex);
    w2.anchor.set(0.5);
    w2.scale.set(CONFIG.truckScale);
    w2.x = 110 * CONFIG.truckScale;
    w2.y = -40 * CONFIG.truckScale;
    truck.addChild(w2);
    truck.wheels.push(w2);

    truck.x = app.screen.width / 2;
    truck.y = app.screen.height - 80;
    
    // Physics Props
    truck.vx = 0;

    gameContainer.addChild(truck);
}

// --- GAME LOOP ---
function startGame() {
    gameState = 'PLAYING';
    score = 0;
    lives = 3;
    timeLeft = CONFIG.duration;
    
    // UI Reset
    document.getElementById('modal-overlay').classList.remove('active');
    updateHUD();

    // Timer
    const timerInt = setInterval(() => {
        if(gameState !== 'PLAYING') {
            clearInterval(timerInt);
            return;
        }
        timeLeft--;
        if(timeLeft <= 0) endGame(true);
        updateHUD();
    }, 1000);
}

function gameLoop(delta) {
    if(gameState !== 'PLAYING') return;

    // 1. Truck Movement
    if (keys.left) truck.vx -= CONFIG.truckSpeed * delta;
    if (keys.right) truck.vx += CONFIG.truckSpeed * delta;
    
    truck.vx *= CONFIG.truckFriction;
    truck.x += truck.vx * delta;

    // Bounds
    const margin = 100;
    if(truck.x < margin) { truck.x = margin; truck.vx = 0; }
    if(truck.x > app.screen.width - margin) { truck.x = app.screen.width - margin; truck.vx = 0; }

    // Wheel Spin
    truck.wheels.forEach(w => w.rotation += truck.vx * 0.05 * delta);

    // Tilt
    truck.rotation = (truck.vx * 0.002);

    // Parallax
    if(bgSprite) bgSprite.tilePosition.x -= truck.vx * 0.5;

    // 2. Spawning
    spawnTimer += delta;
    if(spawnTimer > CONFIG.spawnRate) {
        spawnObject();
        spawnTimer = 0;
    }

    // 3. Objects Update
    for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.y += p.vy * delta;
        p.rotation += p.vr * delta;

        // Collision
        if (checkCollision(truck, p)) {
            handleHit(p);
            gameContainer.removeChild(p);
            parts.splice(i, 1);
        }
        // Miss
        else if (p.y > app.screen.height + 100) {
            gameContainer.removeChild(p);
            parts.splice(i, 1);
        }
    }
}

function spawnObject() {
    const isBad = Math.random() < 0.3;
    let tex;
    let type;
    
    if(isBad) {
        const key = ASSETS.hazards[Math.floor(Math.random() * ASSETS.hazards.length)];
        tex = PIXI.Assets.get(key);
        type = 'bad';
    } else {
        const key = ASSETS.parts[Math.floor(Math.random() * ASSETS.parts.length)];
        tex = PIXI.Assets.get(key);
        type = 'good';
    }

    if(!tex) return;

    const sprite = new PIXI.Sprite(tex);
    sprite.anchor.set(0.5);
    sprite.x = Math.random() * (app.screen.width - 200) + 100;
    sprite.y = -50;
    sprite.scale.set(CONFIG.partScale);
    
    sprite.vy = (Math.random() * 2 + 5); // Speed
    sprite.vr = (Math.random() - 0.5) * 0.1; // Rotation
    sprite.type = type;

    gameContainer.addChild(sprite);
    parts.push(sprite);
}

function checkCollision(truck, part) {
    // Simple distance check for now
    const dx = truck.x - part.x;
    const dy = (truck.y - 50) - part.y; // Center of truck body approx
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    return dist < 120; // Hit radius
}

function handleHit(part) {
    if(part.type === 'good') {
        score += 80;
        pulseTicker("PROCURED: COMPONENT VERIFIED");
    } else {
        score -= 50;
        lives--;
        pulseTicker("WARNING: CONTAMINANT DETECTED");
        shakeScreen();
        if(lives <= 0) endGame(false);
    }
    updateHUD();
}

function updateHUD() {
    document.getElementById('score-display').innerText = score.toString().padStart(4, '0');
    document.getElementById('timer-display').innerText = timeLeft.toFixed(2);
    
    const pips = document.querySelectorAll('.life-pip');
    pips.forEach((p, i) => {
        if(i < lives) p.classList.add('active');
        else p.classList.remove('active');
    });

    document.getElementById('status-readout').innerText = lives > 1 ? "SYSTEM NOMINAL" : "CRITICAL FAILURE IMMINENT";
    if(lives <= 1) document.getElementById('status-readout').style.color = 'red';
    else document.getElementById('status-readout').style.color = 'white';
}

function pulseTicker(msg) {
    const el = document.getElementById('news-ticker');
    const original = el.innerText;
    el.innerText = msg;
    el.style.color = '#fff';
    setTimeout(() => {
        el.innerText = "AWAITING INPUT · SYSTEM READY";
        el.style.color = 'var(--ptc-yellow)';
    }, 2000);
}

function shakeScreen() {
    gsap.to(app.stage, {x: 10, duration: 0.05, yoyo: true, repeat: 5});
    gsap.to(app.stage, {x: 0, duration: 0.05, delay: 0.3});
}

function endGame(win) {
    gameState = 'END';
    const modal = document.getElementById('modal-overlay');
    modal.classList.add('active');
    
    const title = modal.querySelector('.modal-title');
    const desc = modal.querySelector('.modal-desc');
    const btn = document.getElementById('action-btn');

    if(win) {
        title.innerText = "SHIFT COMPLETE";
        desc.innerText = `FINAL VALUE: ${score}`;
        btn.innerText = "NEXT SHIFT";
    } else {
        title.innerText = "SYSTEM FAILURE";
        desc.innerText = "FLEET INTEGRITY COMPROMISED";
        btn.innerText = "REBOOT SYSTEM";
    }
}
