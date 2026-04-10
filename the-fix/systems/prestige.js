/**
 * PRESTIGE SYSTEM
 * "Rationalization"
 */
const Prestige = {
    canPrestige() {
        return GameState.playTime >= 40;
    },

    getDenialGain() {
        return Math.floor(GameState.totalHumanLoss / 100);
    },

    rationalize() {
        if (!this.canPrestige()) return;

        // Gain Denial
        GameState.denial += this.getDenialGain();
        GameState.prestigeCount++;

        // Hard Reset
        GameState.cash = 0;
        GameState.buildings = {};
        GameState.heat = 0;
        // GameState.playTime = 0; // Does playtime reset? GDD doesn't explicitly say but usually yes for Era pacing. 
        // Actually GDD says "Speeds you toward atrocity", implying faster progression. 
        // Let's reset playtime so Eras trigger again but faster? 
        // "What DOES NOT reset: Humanity floor... Memory flags"
        // Let's reset resources but keep generic counters.

        // Permanent Consequence
        // Lower max humanity
        // "GameState.humanity = Math.min(GameState.humanity, 90...)" in UI logic

        Engine.save();
        location.reload();
    }
};

window.Prestige = Prestige;
