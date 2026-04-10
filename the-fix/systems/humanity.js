/**
 * HUMANITY SYSTEM
 * The hidden moral counter.
 */
const Humanity = {
    modify(amount) {
        if (!GameState.humanityUnlocked) return; // Locked at 100

        GameState.humanity += amount;
        if (GameState.humanity < 0) GameState.humanity = 0;
        if (GameState.humanity > 100) GameState.humanity = 100;

        // Trigger Zero State?
    }
};

window.Humanity = Humanity;
