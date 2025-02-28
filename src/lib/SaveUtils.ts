// src/lib/SaveUtils.ts
import { AvailableGames, Game, UserGames } from "@/types";
import { getUTCDate, isGameWon } from "@/lib/GameUtils";
import { getSeededCharacter } from "./CharacterUtils";

const LOCALSTORAGE_KEY = "user_games";
const DEFAULT_GAME = "ptndle";
const FIRST_GAME_DATE = getUTCDate(new Date("2025-02-26"));

/**
 * SAVING OVERVIEW
 *
 * CONSIDERATIONS
 *
 * 0.	Any outgoing return should be a structuredClone* to avoid references from changing during our save proccess. Yes, this WILL happen! Almost everything is running
 * 		asynchronously. At the very least, a JSON parse and stringify should be done.
 * 		*most browsers updated >= 2022 should support this
 *
 * 1. 	Our strategy here is to ALWAYS save to localStorage whenever possible. So, saveGame should be one of the most common functions here.
 * 		We are doing this so we can scrap all of our other systems and just loadGame() whenever we want some information.
 *
 * 		E.g., I am creating a new game type. I update AvailableGames to include it, and then change our front-end to display it.
 * 		      We can now simply just loadGame(new_game), and our entire codebase should adapt to it.
 * 		As of version 1.1, we have to create new variables for every single game.
 *
 * 2.	 Our save directly overwrites the localStorage. There is absolutely no checking whatsoever. Always loadGame() and modify it directly before trying to save!
 *
 * 3.   We trust any external usage of this file to call saveGame() by themselves, while all internal functions try to saveGame() if anything changes.
 *
 * 4.   UserGames is an OBJECT, not an ARRAY. This means that we can have game_name as the key for any games. However, trying to use array functions might get you an
 * 		empty value []. Be careful.
 *
 * ERROR HANDLING
 *
 * - If a game cannot be loaded, a new empty save is created to avoid further errors.
 * - If there is no saved data, an empty object is returned.
 * - If a game is not found, a new empty save is created.
 * - If X, create new save. We want to ALWAYS have a save in hand.
 *
 *
 *
 */

/**
 * Loads a game from local storage.
 * @param game_name - The name of the game to load.
 * @returns The loaded game data, or a new empty game if it doesn't exist.
 */
function loadGame(game_name: AvailableGames): Game {
	try {
		const game_data: Game = findGame(game_name);

		return structuredClone(game_data);
	} catch (error) {
		// TODO: create proper error instances
		console.error(error);
		console.warn(
			`An error has occured. Forcefully creating a new empty ${game_name} save instance to avoid further errors.`
		);
		return createEmptySave(game_name);
	}
}

/**
 * Updates the last played date of a game and saves it.
 * @param game - The game to update.
 */
function updateLastPlayed(game: Game): void {
	const last_played = Object.keys(game.history).at(-1);
	if (!last_played) return;

	game.dates.last_played = last_played;
	saveGame(game);
}

/**
 * Updates all scores of a game and saves it.
 * This includes the total wins, current streak, and high score.
 *
 * Note that this recalculates everything from saved history, rather than just the most recent game.
 *
 * @param game - The game to update.
 */
function updateScores(game: Game): void {
	calculateScore(game);
	calculateStreak(game);
	calculateHighScore(game);
}

/**
 * Updates the score of a game and saves it.
 * @param game - The game to update.
 */
function calculateScore(game: Game): void {
	const total_wins = Object.keys(game.history).filter((date) =>
		isGameWon(game.history[date], getSeededCharacter(date).code)
	).length;

	game.scoring.total_wins = total_wins;
	console.log("updating score", total_wins);

	saveGame(game);
}

/**
 * Updates the current streak of a game and saves it.
 * If the most recent game was a loss, the streak is reset to 0.
 * Otherwise, the streak is calculated by counting the number of consecutive wins from the most recent date going backwards.
 * @param game - The game to update.
 */
function calculateStreak(game: Game): void {
	//if our most recent game was a loss, just reset the streak
	const last_date = Object.keys(game.history).at(-1);
	let current_streak = 0;

	if (
		last_date &&
		isGameWon(game.history[last_date], getSeededCharacter(last_date).code)
	) {
		// for streak, we can start on our most recent date and work backwards since we only want to count wins
		for (let i = Object.keys(game.history).length - 1; i >= 0; i--) {
			const date = Object.keys(game.history)[i];
			const has_won = isGameWon(
				game.history[date],
				getSeededCharacter(date).code
			);
			if (has_won) {
				current_streak += 1;
			} else {
				break;
			}
		}
	}

	game.scoring.streak = current_streak;
	saveGame(game);
}

/**
 * Calculates and updates the high score of a game based on the current streak.
 * If the current streak is greater than the existing high score, it updates the high score.
 * @param game - The game to update.
 */
function calculateHighScore(game: Game): void {
	const current_streak = game.scoring.streak;

	if (current_streak > game.scoring.high_score) {
		game.scoring.high_score = current_streak;
	}

	saveGame(game);
}

/**
 * Creates an empty game_name game, and directly saves it to localStorage.
 * @param game_name - The name of the game to create. Defaults to DEFAULT_GAME.
 * @returns A new empty game object.
 */
function createEmptySave(game_name: AvailableGames = DEFAULT_GAME): Game {
	const today = getUTCDate();

	const empty_game: Game = {
		name: game_name,
		dates: {
			first_played: today,
			last_played: today,
		},
		scoring: {
			streak: 0,
			high_score: 0,
			total_wins: 0,
		},
		data: {
			guesses: [],
			target: "",
			seed: today,
		},
		history: {},
		user_configs: JSON.stringify({}),
		debug_info: JSON.stringify({}),
	};

	saveGame(empty_game);

	return structuredClone(empty_game);
}

/**
 * Saves a game to local storage.
 * @param game - The game to save.
 */
function saveGame(game: Game): void {
	const user_games_string = localStorage.getItem(LOCALSTORAGE_KEY);
	const user_games = user_games_string ? JSON.parse(user_games_string) : {};

	user_games[game.name] = game;

	localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(user_games));
}

/**
 * Finds a game in local storage based on their name.
 * @param game_name - The name of the game to find.
 * @returns The game data, or a new empty game if it doesn't exist.
 */

function findGame(game_name: AvailableGames): Game {
	const games = getAllGames();

	// we have nothing saved at all
	if (!doesUserHaveGames(games)) return createEmptySave(game_name);

	const game_data: Game = games[game_name];

	// we have something saved, but not the game we are trying to find
	if (!game_data) return createEmptySave(game_name);

	return structuredClone(game_data);
}

/**
 * Gets all saved games from local storage. Note that since we are returning an empty object in some cases, you may have to
 * do manual checking for your use case.
 *
 * This function exists solely so we can more easily handle updates in the future,
 *
 * @returns An object containing all saved games, or an empty object if none exist.
 */

function getAllGames(): UserGames {
	const saved_data = localStorage.getItem(LOCALSTORAGE_KEY);

	if (!saved_data) return {} as UserGames;

	return JSON.parse(saved_data);
}

/**
 * Checks if the user has any saved games.
 * @param games - The object containing all saved games.
 * @returns True if the user has saved games, false otherwise.
 */
function doesUserHaveGames(games: UserGames): boolean {
	return Object.keys(games).length > 0;
}

/**
 * Gets the name of the last played game, based on their date.
 *
 * @returns The name of the last played game. If there are none, defaults to 'ptndle'.
 */
function getLastPlayedGame(): AvailableGames {
	let game_name: AvailableGames = "ptndle";

	const games = getAllGames();

	if (!doesUserHaveGames(games)) {
		console.log("since games is empty, returning default value");
		return game_name;
	}

	// ALL dates are strings
	let last_played_date = "0000-00-00";
	for (const key in games) {
		const game = games[key as AvailableGames];
		if (game.dates.last_played > last_played_date) {
			last_played_date = game.dates.last_played;
			game_name = game.name;
		}
	}

	console.log("found games. the most recent game is", game_name);

	return game_name;
}

/**
 * Gets the number of days since FIRST_GAME_DATE.
 * @returns The number of days since the first game.
 */
export function getDailyGameNumber(): string {
	// hour, minute, second, millisecond
	const division = 24 * 60 * 60 * 1000;
	const days_elapsed = Math.floor(
		(Date.now() - new Date(FIRST_GAME_DATE).getTime()) / division
	);
	const daily_game_number = days_elapsed + 1;

	return daily_game_number.toString();
}

export {
	saveGame,
	loadGame,
	createEmptySave,
	updateLastPlayed,
	getLastPlayedGame,
	getAllGames,
	updateScores,
};
