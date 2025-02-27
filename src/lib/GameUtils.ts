// src/lib/GameUtils.ts
import { GameState } from "@/types";

// Maximum guesses allowed
export const MAX_GUESSES = 6;

// Attribute keys used in the table
export const ATTRIBUTE_KEYS = ["code", "alignment", "tendency", "height", "birthplace"];

/**
 * Saves the game state to local storage.
 */
export const saveGameState = (gameState: GameState) => {
  localStorage.setItem("gameState", JSON.stringify(gameState));
};

/**
 * Loads the game state from local storage if it's from today. 
 * Creates a new one otherwise.
 */
export const loadGameState = (): GameState | null => {
  const savedState = localStorage.getItem("gameState");
  if (!savedState) return null;

  const gameState: GameState = JSON.parse(savedState);
  const savedDate = new Date(gameState.date).toISOString().split("T")[0];
  const currentDate = new Date().toISOString().split("T")[0];

  if (savedDate === currentDate) {
    return gameState;
  } else {
    localStorage.removeItem("gameState");
    return null;
  }
};

