'use client';
import '@/styles/Container.css'
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Character, Attribute, AvailableGames, APP_VERSION } from "@/types";
import { getSeededCharacter, calculateThresholds, getCharacterFromCode } from "@/lib/CharacterUtils";
import { getUTCDate, isGameWon, isGameOver, getLegacyGuessesFromCodes, getCharacterListWithoutGuesses, hasGameStarted, createEndlessResetValue, updateEndlessMode } from "@/lib/GameUtils";
import { saveGame, loadGame, getLastPlayedGame, updateScores, createNewDailyGame, switchMostRecentGame, setDebugValue, getDebugValue } from "@/lib/SaveUtils";
import GameController from "@/components/Game/GameController";
import GuessTable from "@/components/Table/GuessTable";
import HeaderMenu from "@/app/components/HeaderMenu";
import TableHeader from "@/components/Table/TableHeader";

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

  function updateBasedOnSave() {
    const game_to_load = getLastPlayedGame();
    const loaded_game = game_to_load === "ptndle" ? createNewDailyGame(game_to_load) : loadGame(game_to_load);
    const is_loaded_endless_mode_on = game_to_load === "ptndle_endless";

    if (is_loaded_endless_mode_on) {
      createEndlessResetValue();
    }

    const should_reset_endless = getDebugValue(loaded_game, "endless_reset");
    const previous_daily_endless_count = parseInt(getDebugValue(loaded_game, "daily_endless_count") ?? 0);

    const formatted_hour = `00:00:00.${String(previous_daily_endless_count).padStart(3, "0")}Z`;
    const today = getUTCDate();
    const loaded_seed = loaded_game.data.seed
    const endless_seed = should_reset_endless ? today + "T" + formatted_hour : loaded_seed;
    const current_seed = is_loaded_endless_mode_on ? endless_seed : loaded_seed;

    const loaded_target = getSeededCharacter(current_seed);

    const is_game_won = isGameWon(loaded_game.data.guesses, loaded_target.code);
    const is_game_over = isGameOver(loaded_game.data.guesses, loaded_target.code);
    const legacy_guesses = getLegacyGuessesFromCodes(loaded_game.data.guesses, current_seed);

    const filtered_characters = getCharacterListWithoutGuesses(loaded_game.data.guesses);


    current_game.current = game_to_load;

    if(should_reset_endless) {
      setDebugValue(loaded_game, "endless_reset", "false");
      if(new Date(loaded_game.dates.last_played) < new Date(today)) {
        setDebugValue(loaded_game, "daily_last_date", "0");
      }
    }


    setSaveGuesses(legacy_guesses);
    setSaveSeed(current_seed);
    setSaveTarget(loaded_target);
    setSaveWon(is_game_won);
    setSaveOver(is_game_over);
    setSaveAllCharacters(filtered_characters);
    setSaveTarget(loaded_target);
    setHasGameLoaded(true);
    setIsEndlessModeOn(is_loaded_endless_mode_on);

    if (is_endless_mode_on) loaded_game.data.seed = endless_seed;

    if (is_game_over) {
      updateScores(loaded_game);
      setImageSrc(loaded_target.image_full);
    } else if (hasGameStarted(loaded_game.data.guesses)) {
      const last_character_code = loaded_game.data.guesses[loaded_game.data.guesses.length - 1];
      const last_character_guessed = getCharacterFromCode(last_character_code);
      setImageSrc(last_character_guessed.image_full)
    } else { // game has not started yet, so we aren't going to show anything
      setImageSrc("");
    }
  }

  useEffect(() => {
    updateBasedOnSave();
  }, []);

  useEffect(() => {
    if (!hasGameLoaded) return;
    if (is_endless_mode_on) {
      switchMostRecentGame("ptndle_endless");
      updateBasedOnSave();
    } else {
      switchMostRecentGame("ptndle");
      updateBasedOnSave();
    }
  }, [is_endless_mode_on, hasGameLoaded]);

  const handleSelectCharacter = useCallback(
    (character: Character) => {
      if (saveOver || guessDisabled) return;

      const loaded_game = loadGame(current_game.current);

      loaded_game.data.guesses.push(character.code)

      const history_date = current_game.current === "ptndle_endless" ? saveSeed : getUTCDate()
      loaded_game.history[history_date] = loaded_game.data.guesses

      saveGame(loaded_game);
      updateBasedOnSave();

      setTimeout(() => setGuessDisabled(false), 500);
    },
    [guessDisabled]
  );

  const onToggleEndlessMode = useCallback(() => {
    setIsEndlessModeOn(!is_endless_mode_on);
  }, [is_endless_mode_on]);

  const handleEndlessReset = useCallback(() => {
    if(current_game.current !== "ptndle_endless") return;

    updateEndlessMode();
    setHasGameLoaded(false);
    updateBasedOnSave();
  }, [is_endless_mode_on]);


  if (!saveTarget) return <div>Loading...</div>;

  return (
    <>
      <HeaderMenu appVersion={APP_VERSION} onToggleEndlessMode={onToggleEndlessMode} is_endless_mode_on={is_endless_mode_on} />
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
            <TableHeader attributeKeys={ATTRIBUTE_KEYS} reversed={reverseTable} onReverseChange={handleReverseChange} />
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