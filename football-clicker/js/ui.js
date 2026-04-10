/**
 * Football Manager Sim - UI Controller
 */

class UI {
    constructor(game, engine) {
        this.game = game;
        this.engine = engine;

        // Cache DOM elements
        this.els = {
            app: document.getElementById('app-content'),
            date: document.getElementById('date-display'),
            cash: document.getElementById('cash-display'),
            fans: document.getElementById('fans-display'),
            energy: document.getElementById('energy-display'),
            navItems: document.querySelectorAll('.nav-item'),
            // Views
            homeView: document.getElementById('view-home'),
            squadView: document.getElementById('view-squad'),
            matchView: document.getElementById('view-match'),
            // Dynamic content
            squadTable: document.getElementById('squad-table-body'),
            leagueTable: document.getElementById('league-table-body'),
            matchLog: document.getElementById('match-feed'),
            matchScore: document.getElementById('match-score'),
            nextMatchCard: document.getElementById('next-match-card'),
            // Actions
            simBtn: document.getElementById('sim-match-btn'),
            trainBtn: document.getElementById('train-btn')
        };

        this.currentView = 'home';
        this.initListeners();
        this.render();
    }

    initListeners() {
        // Navigation
        this.els.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Actions
        this.els.trainBtn.addEventListener('click', () => {
            if (this.game.trainPlayers()) {
                this.showToast("Training Complete! +Attrs, -Stamina");
                this.game.advanceDay();
                this.render();
            } else {
                this.showToast("Not enough energy!", "error");
            }
        });

        this.els.simBtn.addEventListener('click', () => {
            this.playMatch();
        });
    }

    switchView(viewName) {
        // Hide all
        document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
        this.els.navItems.forEach(el => el.classList.remove('active'));

        // Show target
        const target = document.getElementById(`view-${viewName}`);
        if (target) {
            target.style.display = 'block';
            this.currentView = viewName;

            // Update Active Nav
            const nav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
            if (nav) nav.classList.add('active');

            this.render();
        }
    }

    playMatch() {
        const schedule = this.game.state.matchSchedule;
        const nextMatch = schedule[this.game.state.nextMatchIndex];

        if (!nextMatch) {
            this.showToast("Season Over!");
            return;
        }

        this.switchView('match');
        this.els.matchLog.innerHTML = '<div class="feed-item">Match Started...</div>';
        this.els.matchScore.innerText = "0 - 0";

        // Get Stats
        const userStats = this.game.getFormationStats();
        // Opponent strength (random 50-70)
        const oppStrength = 50 + Math.floor(Math.random() * 20);

        // Run Sim
        const result = this.engine.simulateMatch(userStats, oppStrength);

        // Render Feed with delay for effect
        let delay = 0;
        result.log.forEach(event => {
            delay += 300; // 300ms per event
            setTimeout(() => {
                const item = document.createElement('div');
                item.className = `feed-item ${event.type}`;
                item.innerHTML = `<span class="min">${event.min}'</span> ${event.text}`;
                this.els.matchLog.prepend(item); // Newest top

                if (event.type === 'goal') {
                    // Update live score display (approx)
                    const scoreText = this.els.matchScore.innerText;
                    // Simply overwrite with final score at end or track simpler
                }
            }, delay);
        });

        // Finalize
        setTimeout(() => {
            this.els.matchScore.innerText = `${result.score.home} - ${result.score.away}`;

            // Update League
            this.updateLeague(nextMatch.isHome ? result.score.home : result.score.away,
                nextMatch.isHome ? result.score.away : result.score.home,
                result.winner);

            this.game.state.nextMatchIndex++;
            this.game.advanceDay(); // Post-match day

            // Show "Continue" button or auto-redirect
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.innerText = 'Return to Office';
            btn.onclick = () => this.switchView('home');
            this.els.matchLog.prepend(btn);

        }, delay + 500);
    }

    updateLeague(userGoals, oppGoals, winner) {
        // Check local game state helpers vs league array
        const userTeam = this.game.state.league.find(t => t.isUser);
        userTeam.played++;
        if (winner === 'home') { // Assuming user is home for logic simplicity or check map
            // FIX Logic: Check if user was home/away actually
            // Simplified: User Score vs Opp Score
        }

        // Naive update for prototype:
        if (userGoals > oppGoals) { userTeam.won++; userTeam.points += 3; }
        else if (userGoals === oppGoals) { userTeam.drawn++; userTeam.points += 1; }
        else { userTeam.lost++; }
        userTeam.gd += (userGoals - oppGoals);

        // Sort League
        this.game.state.league.sort((a, b) => b.points - a.points || b.gd - a.gd);
    }

    render() {
        this.renderHeader();

        if (this.currentView === 'home') this.renderHome();
        if (this.currentView === 'squad') this.renderSquad();
    }

    renderHeader() {
        const d = this.game.state.date;
        this.els.date.innerText = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        this.els.cash.innerText = `€ ${this.formatMoney(this.game.state.cash)}`;
        this.els.fans.innerText = this.game.state.fans;
        this.els.energy.innerText = `${this.game.state.energy}%`;
    }

    renderHome() {
        // Next Match
        const match = this.game.state.matchSchedule[this.game.state.nextMatchIndex];
        if (match) {
            this.els.nextMatchCard.innerHTML = `
                <h3>Next Match</h3>
                <div class="match-vs">
                    <span class="team-name">FC Portals</span>
                    <span class="vs-badge">VS</span>
                    <span class="team-name">${match.opponent}</span>
                </div>
                <div class="match-meta">Matchday ${match.matchday} • ${match.isHome ? 'Home' : 'Away'}</div>
            `;
        }

        // Mini League Table (Top 5)
        this.els.leagueTable.innerHTML = '';
        this.game.state.league.slice(0, 5).forEach((t, i) => {
            const tr = document.createElement('tr');
            if (t.isUser) tr.className = 'highlight';
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${t.name}</td>
                <td>${t.played}</td>
                <td>${t.points}</td>
            `;
            this.els.leagueTable.appendChild(tr);
        });
    }

    renderSquad() {
        this.els.squadTable.innerHTML = '';
        this.game.state.squad.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="pos-badge ${p.position}">${p.position}</span></td>
                <td>${p.name}</td>
                <td>${p.age}</td>
                <td>${p.overall}</td>
                <td>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${p.stamina}%"></div>
                    </div>
                </td>
            `;
            this.els.squadTable.appendChild(tr);
        });
    }

    formatMoney(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    }

    showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
}

// Init when DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    // wait for scripts
    if (window.GameInstance && window.MatchEngineInstance) {
        window.UIInstance = new UI(window.GameInstance, window.MatchEngineInstance);
    }
});
