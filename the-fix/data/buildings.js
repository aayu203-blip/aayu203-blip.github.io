/**
 * BUILDING DEFINITIONS
 * Era-gated assets.
 */
const Buildings = [
    // ERA I
    {
        id: "corner_junkie",
        name: "CORNER JUNKIE",
        cost: 15,
        production: 0.5,
        unlockEra: 1,
        desc: "Manual labor. Keep them fed."
    },
    {
        id: "trap_house",
        name: "TRAP HOUSE",
        cost: 100,
        production: 4.0,
        unlockEra: 1,
        desc: "Regional distribution hub."
    },
    // ERA II
    {
        id: "pimp",
        name: "PIMP",
        cost: 1100,
        production: 22.0,
        unlockEra: 2,
        desc: "Diversified revenue streams.",
        onTick: (delta, count) => {
            // Heat generation
            GameState.heat += (0.001 * count * delta);
        }
    }
];

window.Buildings = Buildings;

// Helper to calc cost
window.getBuildingCost = (id, currentCount) => {
    const b = Buildings.find(x => x.id === id);
    if (!b) return 0;
    return Math.floor(b.cost * Math.pow(1.15, currentCount));
};
