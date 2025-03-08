"use client";
import "@styles/Container.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Character, Attribute, AvailableGames, APP_VERSION, Game } from "@types";
import { getSeededCharacter, calculateThresholds, getCharacterFromCode } from "@lib/CharacterUtils";
import { getUTCDate, hasGameStarted, updateEndlessMode, initiateGameByMode, initiateGamePropsByMode } from "@lib/GameUtils";
import { saveGame, loadGame, getLastPlayedGame, updateScores, switchMostRecentGame } from "@lib/SaveUtils";
import GameController from "@components/Game/GameController";
import GuessTable from "@components/Table/GuessTable";
import HeaderMenu from "@app/components/HeaderMenu";
import TableHeader from "@components/Table/TableHeader";

const MAX_GUESSES = 6;
const ATTRIBUTE_KEYS = ["code", "alignment", "tendency", "height", "birthplace"];

export default function Home() {
	const [guessDisabled, setGuessDisabled] = useState(false);
	const [imageSrc, setImageSrc] = useState<string>("");
	const [reverseTable, setReverseTable] = useState(false);
	const lastRowRef = useRef<HTMLDivElement>(null);

	const [saveGuesses, setSaveGuesses] = useState<Attribute[][]>([]);
	const [saveTarget, setSaveTarget] = useState<Character>(getSeededCharacter());
	const [saveSeed, setSaveSeed] = useState<string>(getUTCDate());
	const [saveWon, setSaveWon] = useState<boolean>(false);
	const [saveOver, setSaveOver] = useState<boolean>(false);
	const [saveAllCharacters, setSaveAllCharacters] = useState<Character[]>([]);
	const [is_endless_mode_on, setIsEndlessModeOn] = useState(false);
	const [hasGameLoaded, setHasGameLoaded] = useState(false);
	const current_game = useRef<AvailableGames>("ptndle");

	/** Toggles table order */
	const handleReverseChange = (newReverse: boolean) => setReverseTable(newReverse);

	function updateGameStates(
		seed: string,
		guesses: Attribute[][],
		target: Character,
		is_game_won: boolean,
		is_game_over: boolean,
		characters: Character[]
	) {
		setSaveSeed(seed);
		setSaveGuesses(guesses);
		setSaveTarget(target);
		setSaveWon(is_game_won);
		setSaveOver(is_game_over);
		setSaveAllCharacters(characters);
	}

	function updateCharacterImage(game: Game, target: Character, is_game_over: boolean) {
		if (is_game_over) {
			setImageSrc(target.image_full);
		} else if (hasGameStarted(game.data.guesses)) {
			const last_character_code = game.data.guesses[game.data.guesses.length - 1];
			const last_character_guessed = getCharacterFromCode(last_character_code);
			setImageSrc(last_character_guessed.image_full);
		} else {
			// game has not started yet, so we aren't going to show anything
			setImageSrc("");
		}
	}

	function updateGameProgress() {
		const game_mode = getLastPlayedGame();
		const game = initiateGameByMode(game_mode);
		const is_loaded_endless_mode_on = game_mode === "ptndle_endless";

		const { seed, guesses, target, is_game_won, is_game_over, characters } = initiateGamePropsByMode(game_mode);

		current_game.current = game_mode;

		updateGameStates(seed, guesses, target, is_game_won, is_game_over, characters);

		setHasGameLoaded(true);

		setIsEndlessModeOn(is_loaded_endless_mode_on);

		if (is_endless_mode_on) game.data.seed = seed;
		if (is_game_over) updateScores(game);

		updateCharacterImage(game, target, is_game_over);
	}

	useEffect(() => {
		updateGameProgress();
	}, []);

	useEffect(() => {
		if (!hasGameLoaded) return;
		if (is_endless_mode_on) {
			switchMostRecentGame("ptndle_endless");
			updateGameProgress();
		} else {
			switchMostRecentGame("ptndle");
			updateGameProgress();
		}
	}, [is_endless_mode_on, hasGameLoaded]);

	const handleSelectCharacter = useCallback(
		(character: Character) => {
			if (saveOver || guessDisabled) return;

			const loaded_game = loadGame(current_game.current);

			loaded_game.data.guesses.push(character.code);

			const history_date = current_game.current === "ptndle_endless" ? saveSeed : getUTCDate();
			loaded_game.history[history_date] = loaded_game.data.guesses;

			saveGame(loaded_game);
			updateGameProgress();

			setTimeout(() => setGuessDisabled(false), 500);
		},
		[guessDisabled]
	);

	const onToggleEndlessMode = useCallback(() => {
		setIsEndlessModeOn(!is_endless_mode_on);
	}, [is_endless_mode_on]);

	const handleEndlessReset = useCallback(() => {
		if (current_game.current !== "ptndle_endless") return;

		updateEndlessMode();
		setHasGameLoaded(false);
		updateGameProgress();
	}, [is_endless_mode_on]);

	if (!saveTarget) return <div>Loading...</div>;

	return (
		<>
			<HeaderMenu
				appVersion={APP_VERSION}
				onToggleEndlessMode={onToggleEndlessMode}
				is_endless_mode_on={is_endless_mode_on}
			/>
			<div className="greedy-packing-row">
				<div>
					<GameController
						imageSrc={imageSrc ?? ""}
						gameOver={saveOver}
						gameWon={saveWon}
						targetCharacter={saveTarget}
						guesses={saveGuesses}
						MAX_GUESSES={MAX_GUESSES}
						allCharacters={saveAllCharacters}
						isEndlessOn={is_endless_mode_on}
						handleSelectCharacter={handleSelectCharacter}
						handleEndlessReset={handleEndlessReset}
						guessDisabled={guessDisabled}
					/>
				</div>

				<div>
					{hasGameStarted(saveGuesses) && (
						<TableHeader
							attributeKeys={ATTRIBUTE_KEYS}
							reversed={reverseTable}
							onReverseChange={handleReverseChange}
						/>
					)}

					<div className="flex flex-col mt-1 lg:mt-4" ref={lastRowRef}>
						{hasGameStarted(saveGuesses) && (
							<GuessTable
								guesses={saveGuesses}
								target_guess={saveTarget}
								thresholds={calculateThresholds(getSeededCharacter(saveSeed)!)}
								reverse={reverseTable}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
