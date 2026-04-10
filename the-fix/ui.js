const UI = {
    els: {},

    init() {
        this.els = {
            cash: document.getElementById('cash'),
            revenue: document.getElementById('revenue'),
            heat: document.getElementById('heat'),
            playtime: document.getElementById('playtime'),
            era: document.getElementById('era-name'),
            assetList: document.getElementById('asset-list'),
            btnCut: document.getElementById('btn-cut')
        };

        this.els.btnCut.addEventListener('mousedown', () => {
            Engine.manualClick();
        });

        this.renderAssets();
    },

    render() {
        this.els.cash.innerText = '$' + GameState.cash.toFixed(2);
        this.els.heat.innerText = GameState.heat.toFixed(1) + '%';

        // Calculate Display Revenue
        let rev = 0;
        const m = Engine.getMultipliers();

        for (const [id, count] of Object.entries(GameState.buildings)) {
            const b = Buildings.find(x => x.id === id);
            if (b && count > 0) {
                let prod = b.production;
                if (m.buildings[id]) prod *= m.buildings[id];
                prod *= m.global;
                rev += (prod * count);
            }
        }
        this.els.revenue.innerText = `+$${rev.toFixed(2)}/sec`;

        const h = Math.floor(GameState.playTime);
        const mTime = Math.floor((GameState.playTime - h) * 60);
        this.els.playtime.innerText = `${h.toString().padStart(2, '0')}H:${mTime.toString().padStart(2, '0')}M`;

        const era = Eras.find(e => e.id === GameState.era);
        if (era) this.els.era.innerText = era.name;

        this.updateAssets();
    },

    renderAssets() {
        this.els.assetList.innerHTML = '';

        // SECTION: ASSETS
        const assetsHeader = document.createElement('div');
        assetsHeader.className = 'list-header';
        assetsHeader.innerText = '-- ASSETS --';
        assetsHeader.style.color = 'var(--dim)';
        assetsHeader.style.marginBottom = '10px';
        this.els.assetList.appendChild(assetsHeader);

        for (const b of Buildings) {
            // Logic handled in updateAssets for visibility based on Era, 
            // but for initial render, we render partially
            const el = document.createElement('div');
            el.className = 'asset-row';
            el.id = `asset-row-${b.id}`;
            el.style.display = 'none'; // Hidden by default until updateAssets check

            el.innerHTML = `
                <div class="asset-info">
                    <span class="asset-name">${b.name} <span class="subval">x<span id="count-${b.id}">0</span></span></span>
                    <span class="asset-cost">COST: $<span id="cost-${b.id}">0</span></span>
                    <span class="asset-cost subval">${b.desc}</span>
                </div>
                <div class="buy-btn" id="btn-buy-${b.id}">[ ACQUIRE ]</div>
            `;

            this.els.assetList.appendChild(el);

            document.getElementById(`btn-buy-${b.id}`).onclick = () => {
                const count = GameState.buildings[b.id] || 0;
                const cost = getBuildingCost(b.id, count);
                if (GameState.cash >= cost) {
                    GameState.cash -= cost;
                    GameState.buildings[b.id] = count + 1;
                    this.render(); // Instant update
                }
            };
        }

        // SECTION: UPGRADES
        const upgradesHeader = document.createElement('div');
        upgradesHeader.className = 'list-header';
        upgradesHeader.innerText = '-- UPGRADES --';
        upgradesHeader.style.marginTop = '20px';
        upgradesHeader.style.marginBottom = '10px';
        upgradesHeader.style.color = 'var(--dim)';
        this.els.assetList.appendChild(upgradesHeader);

        if (window.Upgrades) {
            for (const u of Upgrades) {
                const el = document.createElement('div');
                el.className = 'asset-row';
                el.id = `upgrade-row-${u.id}`;
                el.style.display = 'none';

                el.innerHTML = `
                    <div class="asset-info">
                        <span class="asset-name">${u.name}</span>
                        <span class="asset-cost">COST: $<span id="cost-u-${u.id}">${u.cost}</span></span>
                        <span class="asset-cost subval">${u.desc}</span>
                    </div>
                    <div class="buy-btn" id="btn-buy-u-${u.id}">[ INSTALL ]</div>
                `;

                this.els.assetList.appendChild(el);

                document.getElementById(`btn-buy-u-${u.id}`).onclick = () => {
                    if (GameState.cash >= u.cost) {
                        GameState.cash -= u.cost;
                        if (!GameState.upgrades) GameState.upgrades = [];
                        GameState.upgrades.push(u.id);
                        this.render(); // Re-render to hide
                    }
                };
            }
        }

        // DEBUG TOOL
        const divider = document.createElement('hr');
        divider.className = 'dashed';
        this.els.assetList.appendChild(divider);

        const debugBtn = document.createElement('div');
        debugBtn.className = 'action-link';
        debugBtn.innerText = '[ DEBUG: +10 HOURS ]';
        debugBtn.onclick = () => {
            GameState.playTime += 10;
            GameState.cash += 10000;
            this.render(); // Unlock new Erak stuff
        };
        this.els.assetList.appendChild(debugBtn);
    },

    updateAssets() {
        // Buildings
        for (const b of Buildings) {
            const row = document.getElementById(`asset-row-${b.id}`);
            if (!row) continue;

            // Era Lock Check
            if (GameState.era < b.unlockEra) {
                row.style.display = 'none';
                continue;
            } else {
                row.style.display = 'flex';
            }

            const count = GameState.buildings[b.id] || 0;
            const cost = getBuildingCost(b.id, count);
            const btn = document.getElementById(`btn-buy-${b.id}`);

            document.getElementById(`count-${b.id}`).innerText = count;
            document.getElementById(`cost-${b.id}`).innerText = cost.toFixed(2);

            if (GameState.cash >= cost) {
                row.classList.remove('dimmed');
                btn.style.display = 'block';
            } else {
                row.classList.add('dimmed');
                btn.style.display = 'none';
            }
        }

        // Upgrades
        if (window.Upgrades) {
            for (const u of Upgrades) {
                const row = document.getElementById(`upgrade-row-${u.id}`);
                if (!row) continue;

                // Hide if Owned OR Era Locked
                if (GameState.upgrades && GameState.upgrades.includes(u.id)) {
                    row.style.display = 'none';
                    continue;
                }

                if (GameState.era < u.unlockEra) {
                    row.style.display = 'none';
                    continue;
                } else {
                    row.style.display = 'flex';
                }

                const btn = document.getElementById(`btn-buy-u-${u.id}`);
                if (GameState.cash >= u.cost) {
                    row.classList.remove('dimmed');
                    btn.style.display = 'block';
                } else {
                    row.classList.add('dimmed');
                    btn.style.display = 'none';
                }
            }
        }
    }
};

window.UI = UI;
