/**
 * Football Manager Sim - Match Engine
 */

class MatchEngine {
    constructor() {
        // Events that can occur during a match tick
        this.eventTypes = [
            { type: 'goal', weight: 5, text: "GOAL! {player} scores with a {shotType}!" },
            { type: 'miss', weight: 15, text: "{player} shoots... missed!" },
            { type: 'save', weight: 10, text: "Great save by the keeper!" },
            { type: 'foul', weight: 10, text: "Foul by {player}." },
            { type: 'nothing', weight: 60, text: "..." } // Midfield battle
        ];

        this.shotTypes = ["screamer", "tap-in", "header", "curler", "volley"];
    }

    simulateMatch(userStats, opponentStrength) {
        // userStats = { attack: 65, defense: 60 }
        // opponentStrength = 60 (Avg)

        const matchLength = 90; // mins
        const tickRate = 5; // e.g. every 5 mins calc an event

        let matchLog = [];
        let score = { home: 0, away: 0 };

        // Define Opponent Stats based on strength
        // Slight RNG variation
        const oppAtt = opponentStrength + (Math.random() * 10 - 5);
        const oppDef = opponentStrength + (Math.random() * 10 - 5);

        // Momentum starts neutral
        let momentum = 0.5; // > 0.5 favor user, < 0.5 favor opponent

        for (let min = 0; min <= matchLength; min += tickRate) {
            // 1. Calculate Momentum Swing
            // Based on stats difference
            const userAdv = (userStats.attack - oppDef) / 100; // e.g., (70-60)/100 = 0.1
            const oppAdv = (oppAtt - userStats.defense) / 100;

            // Random factor
            const rnd = Math.random();

            // Determine who has the ball/attack
            let attacker = 'neutral';
            if (rnd < 0.5 + userAdv) attacker = 'user';
            if (rnd > 0.5 + userAdv) attacker = 'opponent'; // Simplified

            // 2. Generate Event
            if (attacker === 'user') {
                this.processAttack('user', userStats.attack, oppDef, min, matchLog, score);
            } else if (attacker === 'opponent') {
                this.processAttack('opponent', oppAtt, userStats.defense, min, matchLog, score);
            } else {
                if (Math.random() > 0.8) matchLog.push({ min: min, text: "Midfield battle ensues.", type: 'neutral' });
            }
        }

        return {
            score: score,
            log: matchLog,
            winner: score.home > score.away ? 'home' : (score.away > score.home ? 'away' : 'draw')
        };
    }

    processAttack(side, attackStat, defendStat, min, log, score) {
        // Chance to create chance
        const creativity = attackStat / 100; // 0.6
        if (Math.random() < creativity) {
            // Chance created!
            // Chance to score vs Defense
            const finishChance = (attackStat / (attackStat + defendStat)); // 60 vs 60 = 0.5

            if (Math.random() < finishChance) {
                // GOAL
                if (side === 'user') score.home++;
                else score.away++;

                log.push({
                    min: min,
                    text: `GOAL! ${side === 'user' ? 'FC Portals' : 'Opponent'} takes the lead!`,
                    type: 'goal',
                    side: side
                });
            } else {
                // Miss/Save
                log.push({
                    min: min,
                    text: `Close! ${side === 'user' ? 'FC Portals' : 'Opponent'} almost scores!`,
                    type: 'miss',
                    side: side
                });
            }
        }
    }
}

window.MatchEngineInstance = new MatchEngine();
