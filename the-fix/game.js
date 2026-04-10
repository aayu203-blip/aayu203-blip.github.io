const Engine = {
    running: false,
    autoSaveInterval: 10000,
    lastSave: 0,

    init() {
        console.log("[THE FIX] Initializing Engine...");
        this.load();
        this.lastTick = performance.now();
        this.running = true;

        // Expose helpers for Debug
        window.Engine = this; // Self check
        requestAnimationFrame((t) => this.loop(t));

        // Expose for debug
        window.GameState = GameState;
    },

    loop(timestamp) {
        if (!this.running) return;

        const delta = (timestamp - this.lastTick) / 1000; // Seconds
        this.lastTick = timestamp;

        if (delta > 0) {
            this.update(delta);
        }

        if (window.UI) window.UI.render();

        if (timestamp - this.lastSave > this.autoSaveInterval) {
            this.save();
            this.lastSave = timestamp;
        }

        requestAnimationFrame((t) => this.loop(t));
    },

    update(delta) {
        // 1. Playtime
        GameState.playTime += (delta / 3600);

        // 2. Production
        let revenuePerSec = 0;

        // Pre-calc global multipliers
        const mults = this.getMultipliers();

        if (window.Buildings) {
            for (const [id, count] of Object.entries(GameState.buildings)) {
                if (count <= 0) continue;

                const data = Buildings.find(b => b.id === id);
                if (data) {
                    let prod = data.production;

                    // Apply Building Specific Mults
                    if (mults.buildings[id]) prod *= mults.buildings[id];

                    // Apply Global Mults
                    prod *= mults.global;

                    revenuePerSec += (prod * count);

                    if (data.onTick) data.onTick(delta, count);
                }
            }
        }

        GameState.cash += revenuePerSec * delta;

        // 3. Era Check
        if (window.Eras) {
            for (const era of Eras) {
                if (GameState.playTime >= era.minHours && era.id > GameState.era) {
                    GameState.era = era.id;
                }
            }
        }
    },

    getMultipliers() {
        const m = { click: 1, global: 1, buildings: {} };

        if (window.Upgrades) {
            // Ensure upgrades array exists
            if (!GameState.upgrades) GameState.upgrades = [];

            for (const uId of GameState.upgrades) {
                const u = Upgrades.find(x => x.id === uId);
                if (!u) continue;

                if (u.effect.type === 'click') m.click *= u.effect.value;
                if (u.effect.type === 'global') m.global *= u.effect.value;
                if (u.effect.type === 'building') {
                    m.buildings[u.effect.target] = (m.buildings[u.effect.target] || 1) * u.effect.value;
                }
            }
        }
        return m;
    },

    manualClick() {
        let val = 1; // Base
        const m = this.getMultipliers();
        val *= m.click;

        GameState.cash += val;
        return val;
    },

    save() {
        localStorage.setItem("the_fix_save_v2", JSON.stringify(GameState));
    },

    load() {
        const data = localStorage.getItem("the_fix_save_v2");
        if (data) {
            try {
                const parsed = JSON.parse(data);
                Object.assign(GameState, parsed);

                // Ensure upgrades array exists (migration)
                if (!GameState.upgrades) GameState.upgrades = [];

                console.log("Save loaded.");
            } catch (e) {
                console.error("Save load failed", e);
            }
        }
    },

    reset() {
        localStorage.removeItem("the_fix_save_v2");
        location.reload();
    }
};

window.Engine = Engine;
