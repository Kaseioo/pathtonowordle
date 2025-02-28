// src/lib/GameUtils.ts
import { Character, Attribute, Guess } from "@/types";
import {
	getAllCharacters,
	getSeededCharacter,
	calculateThresholds,
	getCharacterFromCode,
} from "@/lib/CharacterUtils";
import { evaluateGuess } from "@/lib/GuessUtils";

// Maximum guesses allowed
export const MAX_GUESSES = 6;

// Attribute keys used in the table
export const ATTRIBUTE_KEYS = ["code", "alignment", "tendency", "height", "birthplace"];

export function getUTCDate(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

export function isGameWon(guesses: string[], target: string): boolean {
	return guesses.includes(target);
}

export function isGameOver(guesses: string[], target: string): boolean {
	if (isGameWon(guesses, target)) return true;
	return guesses.length >= MAX_GUESSES;
}

export function getCharactersFromCodes(guesses: string[]): Character[] {
	return guesses.map(guess => getCharacterFromCode(guess));
}

export function getCharacterListWithoutGuesses(guesses: string[]): Character[] {
	const characters = getAllCharacters();
  
	return characters.filter(character => !guesses.includes(character.code));
}

export function hasGameStarted(guesses: string[] | Attribute[][]): boolean {
  return guesses.length > 0;
}


export function getLegacyGuessesFromCodes(codes: string[], seed: string = getUTCDate()): Attribute[][] {
  const characters = getCharactersFromCodes(codes);
  const target = getSeededCharacter(seed);
  const thresholds = calculateThresholds(target);

  const legacy_guesses = [];
  
  for (const character of characters) {
    const guess: Guess = {
      character: character,
      target: target,
      thresholds: thresholds,
    };

    legacy_guesses.push(evaluateGuess(guess));
  }

  return legacy_guesses;

}
	
	

