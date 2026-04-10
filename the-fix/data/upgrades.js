/**
 * UPGRADE DEFINITIONS
 * Improvements for clicking and assets.
 */
const Upgrades = [
    // ERA I
    {
        id: "switchblade",
        name: "SWITCHBLADE",
        cost: 100,
        unlockEra: 1,
        desc: "Manual cuts are 2x effective.",
        effect: { type: "click", value: 2 }
    },
    {
        id: "digital_scales",
        name: "DIGITAL SCALES",
        cost: 500,
        unlockEra: 1,
        desc: "Corner Junkies are 2x efficient.",
        effect: { type: "building", target: "corner_junkie", value: 2 }
    },
    {
        id: "burner_phones",
        name: "BURNER PHONES",
        cost: 2000,
        unlockEra: 1,
        desc: "Trap Houses produce +50%.",
        effect: { type: "building", target: "trap_house", value: 1.5 }
    },

    // ERA II
    {
        id: "laundromat",
        name: "LAUNDROMAT",
        cost: 5000,
        unlockEra: 2,
        desc: "Global production +20%.",
        effect: { type: "global", value: 1.2 }
    }
];

window.Upgrades = Upgrades;
