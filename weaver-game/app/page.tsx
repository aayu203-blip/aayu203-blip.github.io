"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getModeStyles, ModeType } from "@/lib/visuals";
import { clsx } from "clsx";

interface Stats {
  attention: number;
  restraint: number;
  resonance: number;
}

interface GameState {
  narrative: string;
  choices: string[];
  stats: Stats;
  mode: ModeType;
  turnCount: number;
  history: string[];
  isLoading: boolean;
  hasStarted: boolean;
  isEnding: boolean;
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    narrative: "",
    choices: [],
    stats: { attention: 0, restraint: 0, resonance: 0 },
    mode: "LIMINAL",
    turnCount: 0,
    history: [],
    isLoading: false,
    hasStarted: false,
    isEnding: false,
  });

  const [displayedText, setDisplayedText] = useState("");
  const [showChoices, setShowChoices] = useState(false);

  const modeStyles = getModeStyles(gameState.mode);

  // Animate text letter by letter
  useEffect(() => {
    if (!gameState.narrative) {
      setDisplayedText("");
      setShowChoices(false);
      return;
    }

    setDisplayedText("");
    setShowChoices(false);

    let index = 0;
    const timer = setInterval(() => {
      if (index < gameState.narrative.length) {
        setDisplayedText(gameState.narrative.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        // Show choices after text finishes
        setTimeout(() => {
          setShowChoices(true);
        }, 500);
      }
    }, 20); // Adjust speed as needed

    return () => clearInterval(timer);
  }, [gameState.narrative]);

  const callAdventureAPI = async (userChoice?: string) => {
    setGameState((prev) => ({ ...prev, isLoading: true, choices: [] }));

    try {
      const response = await fetch("/api/adventure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: userChoice
            ? [...gameState.history, userChoice]
            : gameState.history,
          currentStats: gameState.stats,
          turnCount: gameState.turnCount + 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch adventure");
      }

      const data = await response.json();

      setGameState((prev) => ({
        ...prev,
        narrative: data.narrative || "",
        choices: data.choices || [],
        stats: data.updated_stats || prev.stats,
        mode: data.current_mode || prev.mode,
        turnCount: prev.turnCount + 1,
        history: userChoice
          ? [...prev.history, userChoice]
          : prev.history,
        isLoading: false,
        hasStarted: true,
      }));
    } catch (error) {
      console.error("Error calling adventure API:", error);
      setGameState((prev) => ({
        ...prev,
        isLoading: false,
        narrative: "The threads are tangled. Try again.",
      }));
    }
  };

  const handleStart = () => {
    callAdventureAPI();
  };

  const handleChoice = (choice: string) => {
    if (gameState.turnCount > 16 && gameState.choices.length === 0) {
      return;
    }
    callAdventureAPI(choice);
  };

  const handleRest = () => {
    setGameState((prev) => ({ ...prev, isEnding: true }));
  };

  // Check if we should show the Rest button
  const shouldShowRest = gameState.turnCount > 16 && gameState.choices.length === 0;

  return (
    <main className="h-screen w-screen overflow-hidden relative">
      {/* Background that changes based on mode */}
      <motion.div
        key={gameState.mode}
        className={clsx(
          "absolute inset-0 transition-colors duration-1000",
          modeStyles.background
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <div
        className={clsx(
          "relative z-10 h-full w-full flex flex-col items-center justify-center p-8",
          modeStyles.text,
          modeStyles.font
        )}
      >
        {/* Start Screen */}
        {!gameState.hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl"
          >
            <motion.button
              onClick={handleStart}
              className={clsx(
                "px-8 py-4 rounded-lg text-xl transition-all",
                "hover:scale-105 active:scale-95",
                modeStyles.background === "bg-[#0F172A]"
                  ? "bg-slate-700 text-slate-200"
                  : "bg-black text-white"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open Eyes
            </motion.button>
          </motion.div>
        )}

        {/* Story Text */}
        {gameState.hasStarted && (
          <>
            <motion.div
              key={gameState.turnCount}
              className="text-center max-w-2xl mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {gameState.isLoading && (
                  <span className="inline-block w-2 h-5 bg-current animate-pulse ml-1" />
                )}
              </p>
            </motion.div>

            {/* Loading State */}
            {gameState.isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm opacity-70"
              >
                weaving...
              </motion.div>
            )}

            {/* Choices - Scattered Thoughts */}
            <AnimatePresence>
              {showChoices && !gameState.isLoading && gameState.choices.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed bottom-0 left-0 right-0 p-8"
                >
                  <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                    {gameState.choices.map((choice, index) => {
                      // Deterministic but scattered positioning for each choice
                      const angle = (index * 137.508) % 360; // Golden angle for even distribution
                      const distance = 15 + (index % 3) * 5;
                      const randomX = Math.cos(angle * Math.PI / 180) * distance;
                      const randomY = Math.sin(angle * Math.PI / 180) * distance;
                      const randomDelay = index * 0.1;

                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleChoice(choice)}
                          className={clsx(
                            "px-4 py-2 rounded-md text-sm transition-all",
                            "hover:underline cursor-pointer",
                            modeStyles.background === "bg-[#0F172A]"
                              ? "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                              : "bg-white/10 text-current hover:bg-white/20"
                          )}
                          initial={{
                            opacity: 0,
                            x: randomX,
                            y: randomY,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                          }}
                          transition={{
                            delay: randomDelay,
                            duration: 0.5,
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {choice}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Rest Button */}
              {shouldShowRest && !gameState.isEnding && (
                <motion.button
                  onClick={handleRest}
                  className={clsx(
                    "px-8 py-4 rounded-lg text-xl transition-all",
                    "hover:scale-105 active:scale-95",
                    modeStyles.background === "bg-[#0F172A]"
                      ? "bg-slate-700 text-slate-200"
                      : "bg-black text-white"
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Rest
                </motion.button>
              )}
            </AnimatePresence>

            {/* Ending Screen */}
            <AnimatePresence>
              {gameState.isEnding && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black z-50 flex items-center justify-center"
                >
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white text-xl text-center max-w-2xl px-8"
                  >
                    The threads settle. You are here.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </main>
  );
}

