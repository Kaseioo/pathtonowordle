// src/lib/SaveUtils.ts
import { AvailableGames, Game, UserGames } from "@/types";
import { getUTCDate } from "@/lib/GameUtils";

const LOCALSTORAGE_KEY = "user_games";
const DEFAULT_GAME = "ptndle";

/**
 * Loads a game from local storage.
 * @param game_name - The name of the game to load.
 * @returns The loaded game data, or a new empty game if it doesn't exist.
 */
function loadGame(game_name: AvailableGames): Game {
	try{
		const game_data: Game = findGame(game_name);
		
		return structuredClone(game_data)

	} catch (error) { 
		// TODO: create proper error instances
		console.error(error);
		console.warn(`An error has occured. Forcefully creating a new empty ${game_name} save instance to avoid further errors.`);
		return createEmptySave(game_name)
	}
}

/**
 * Updates the last played date of a game and saves it.
 * @param game - The game to update.
 */
function updateLastPlayed(game: Game): void {
	game.dates.last_played = getUTCDate(); 
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
		},
		data: {
			guesses: [],
			target: "",
			seed: today,
		},
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
	if(!doesUserHaveGames(games)) return createEmptySave(game_name);

	const game_data: Game = games[game_name];
	
	// we have something saved, but not the game we are trying to find
	if(!game_data) return createEmptySave(game_name);

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

	if(!saved_data) return {} as UserGames;

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
		console.log("since games is empty, returning default value")
		return game_name;
	}

	// ALL dates are strings
	let last_played_date = "0000-00-00";
	
	for (const key in games) {
		const game = games[key as AvailableGames];
		
		if(game.dates.last_played > last_played_date) {
			last_played_date = game.dates.last_played;
			game_name = game.name;
		}
	}	

	console.log("found games. the most recent game is", game_name);

	return game_name;

}

export {
	saveGame,
	loadGame,
	createEmptySave,
	updateLastPlayed,
	getLastPlayedGame,
	getAllGames
}
