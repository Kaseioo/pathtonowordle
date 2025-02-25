// src/lib/GameUtils.ts
import { Character, Attribute, Thresholds, GameState } from "@/types";
import { getAllCharacters, getSeededCharacter, calculateThresholds } from "@/lib/CharacterUtils";
import { evaluateGuess } from "@/lib/GuessUtils";

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
  const currentDate = getUTCDate();
  const savedDate = getUTCDate(new Date(gameState.date));

  if (savedDate === currentDate) {
    return gameState;
  } else {
    localStorage.removeItem("gameState");
    return null;
  }
}

export function getUTCDate(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

