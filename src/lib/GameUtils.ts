// src/lib/GameUtils.ts
import { Character, Attribute, Guess, AvailableGames, Game } from "@/types";
import { getAllCharacters, getSeededCharacter, calculateThresholds, getCharacterFromCode } from "@/lib/CharacterUtils";
import { evaluateGuess } from "@/lib/GuessUtils";
import { loadGame, getDebugValue, setDebugValue, saveGame, createNewDailyGame } from "./SaveUtils";

// Maximum guesses allowed
export const MAX_GUESSES = 6;

// Attribute keys used in the table
export const ATTRIBUTE_KEYS = ["code", "alignment", "tendency", "height", "birthplace"];

export function getUTCDate(date: Date = new Date(), full_date: boolean = false): string {
  if (full_date) return date.toISOString();

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

export function createEndlessResetValue(): void {
  const loaded_game = loadGame("ptndle_endless");

  const does_endless_reset_exist = getDebugValue(loaded_game, "endless_reset");

  if (!does_endless_reset_exist) {
    setDebugValue(loaded_game, "endless_reset", "false");
  }
}

export function updateEndlessMode(): void {
  const game = loadGame("ptndle_endless");
  const previous_daily_endless_count = getDebugValue(game, "daily_endless_count") ?? 0;
  const previous_daily_endless_count_number = parseInt(previous_daily_endless_count);

  
  setDebugValue(game, "daily_endless_count", String(previous_daily_endless_count_number + 1));
  setDebugValue(game, "endless_reset", "true");
  
  game.data.guesses = [];
  saveGame(game);
}

export function initiateGameByMode(mode: AvailableGames): Game {
	switch (mode) {
		case "ptndle_endless":
			return loadGame(mode);
		case "ptndle":
		default:
			return createNewDailyGame(mode);
	}
}

export function initiateGamePropsByMode(mode: AvailableGames) {
  switch (mode) {
    case "ptndle_endless":
      return initiateEndlessMode(initiateGameByMode(mode));
    case "ptndle":
    default:
      return initiateDefaultMode(initiateGameByMode(mode));
  }
}

export function getGameProps(game: Game, seed: string) {
  const loaded_target = getSeededCharacter(seed);

	const is_game_won = isGameWon(game.data.guesses, loaded_target.code);
	const is_game_over = isGameOver(game.data.guesses, loaded_target.code);
	const legacy_guesses = getLegacyGuessesFromCodes(game.data.guesses, seed);
	const filtered_characters = getCharacterListWithoutGuesses(game.data.guesses);

  return {
    seed: seed,
    target: loaded_target,
    is_game_won: is_game_won,
    is_game_over: is_game_over,
    guesses: legacy_guesses,
    characters: filtered_characters,
  };
}

export function initiateDefaultMode(game: Game) {
  const current_seed = game.data.seed

  return getGameProps(game, current_seed);
  
}
export function initiateEndlessMode(game: Game) {
	const mode = game.name;
	if (mode !== "ptndle_endless") return initiateDefaultMode(game);

	createEndlessResetValue();

	const should_reset_endless = getDebugValue(game, "endless_reset");
	const previous_daily_endless_count = parseInt(getDebugValue(game, "daily_endless_count") ?? 0);

	const formatted_hour = `T00:00:00.${String(previous_daily_endless_count).padStart(3, "0")}Z`;
	const today = getUTCDate();

  const endless_seed = game.data.seed
  const current_seed = should_reset_endless ? today + formatted_hour : endless_seed;

  if (should_reset_endless) {
		resetEndlessDebugValues(game);
  }

  return getGameProps(game, current_seed);

}

export function resetEndlessDebugValues(game: Game): void {
  const today = getUTCDate();

  setDebugValue(game, "endless_reset", "false");
  if (new Date(game.dates.last_played) < new Date(today)) {
    setDebugValue(game, "daily_endless_count", "0");
  }
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
	
	

