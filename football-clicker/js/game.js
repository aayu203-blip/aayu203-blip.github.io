/**
 * Football Manager Sim - Game State & Logic
 */

class Game {
    constructor() {
        this.state = {
            date: new Date(2025, 7, 1), // Start Aug 1st, 2025
            cash: 500000,
            fans: 1000,
            energy: 100, // Manager energy
            season: 1,
            division: 3,
            teamName: "FC Portals",
            tactic: 'balanced', // balanced, attack, defend
            squad: [],
            league: [],
            matchSchedule: [],
            nextMatchIndex: 0
        };

        this.positions = ['GK', 'DEF', 'MID', 'FWD'];

        // Settings
        this.maxEnergy = 100;
        this.energyRechargeRate = 10; // per day rest

        this.init();
    }

    init() {
        this.generateSquad();
        this.generateLeague();
        this.generateSchedule();
    }

    /* --- Generators --- */

    generateSquad() {
        // Create initial 15 players
        const names = ["Smith", "Jones", "Garcia", "Kim", "Müller", "Nkosi", "O'Connor", "Rossi", "Silva", "Dubois", "Tanaka", "Ivanov", "Popov", "Kovacs", "Novak"];
        const firstNames = ["Alex", "Sam", "Jordan", "Casey", "Taylor", "Jamie", "Morgan", "Riley", "Robin", "Drew", "Chris", "Pat", "Lee", "Jo", "Max"];

        // 2 GK, 5 DEF, 5 MID, 3 FWD
        const composition = ['GK', 'GK', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'FWD'];

        this.state.squad = composition.map((pos, i) => {
            return {
                id: i,
                name: `${this.randomChoice(firstNames)} ${this.randomChoice(names)}`,
                position: pos,
                overall: 50 + Math.floor(Math.random() * 20), // 50-70 rating
                age: 18 + Math.floor(Math.random() * 15),
                morale: 80, // 0-100
                stamina: 100, // 0-100
                value: 0 // calc later
            };
        });

        // Calculate Values
        this.state.squad.forEach(p => {
            p.value = p.overall * 1000 + (100 - p.age) * 500;
        });
    }

    generateLeague() {
        this.state.league = [
            { name: "FC Portals", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isUser: true },
            { name: "Red United", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isUser: false },
            { name: "Blue City", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isUser: false },
            { name: "Green Rovers", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isUser: false },
            { name: "Yellow Submarine", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isUser: false },
            { name: "Black Stars", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isUser: false },
            { name: "White Knights", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isUser: false },
            { name: "Orange County", played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isUser: false },
        ];
    }

    generateSchedule() {
        // Round Robin (Simpler: just play everyone twice)
        // For simulation MVP: Just list opponents in random order, loop twice
        const opponents = this.state.league.filter(t => !t.isUser);
        let schedule = [...opponents, ...opponents]; // 14 matches

        // Shuffle
        schedule = schedule.sort(() => Math.random() - 0.5);

        this.state.matchSchedule = schedule.map((opp, i) => {
            return {
                matchday: i + 1,
                opponent: opp.name,
                isHome: Math.random() > 0.5,
                played: false,
                result: null // 'W', 'D', 'L'
            };
        });
    }

    /* --- Core Loop Actions --- */

    advanceDay() {
        // Move date forward
        this.state.date.setDate(this.state.date.getDate() + 1);

        // Recover Energy
        this.state.energy = Math.min(this.state.energy + 5, this.maxEnergy);

        // Recover Players
        this.state.squad.forEach(p => {
            p.stamina = Math.min(p.stamina + 5, 100);
        });

        // Weekly Costs
        if (this.state.date.getDay() === 1) { // Monday
            const wages = this.state.squad.reduce((sum, p) => sum + p.overall * 10, 0);
            this.state.cash -= wages;
            // TODO: Notify UI
        }

        return this.state.date;
    }

    trainPlayers(type) {
        if (this.state.energy < 20) return false;

        this.state.energy -= 20;

        this.state.squad.forEach(p => {
            // Chance to improve
            if (Math.random() > 0.7) {
                p.overall += 1;
                // Cap at 99
                if (p.overall > 99) p.overall = 99;
            }
            // Fatigue
            p.stamina = Math.max(p.stamina - 15, 0);
        });

        return true;
    }

    /* --- Helpers --- */
    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    getFormationStats() {
        // Calculate Attack/Defense based on top 11 players & Form
        // Simple logic: sort by overall, take top 11
        const startingXI = [...this.state.squad].sort((a, b) => b.overall - a.overall).slice(0, 11);

        const attSum = startingXI.reduce((sum, p) => sum + (p.position === 'FWD' || p.position === 'MID' ? p.overall : p.overall * 0.5), 0);
        const defSum = startingXI.reduce((sum, p) => sum + (p.position === 'DEF' || p.position === 'GK' ? p.overall : p.overall * 0.5), 0);

        // Tactic Modifiers
        let attMod = 1, defMod = 1;
        if (this.state.tactic === 'attack') { attMod = 1.2; defMod = 0.8; }
        if (this.state.tactic === 'defend') { attMod = 0.8; defMod = 1.2; }

        return {
            attack: Math.floor(attSum * attMod / 11), // Avg ~ 50-70
            defense: Math.floor(defSum * defMod / 11)
        };
    }
}

// Export singleton
const game = new Game();
// If using ES modules
// export default game; 
// For browser globals MVP:
window.GameInstance = game;
