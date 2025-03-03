'use client';
import '@/styles/Container.css'
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Character, Attribute, AvailableGames } from "@/types";
import { getSeededCharacter, calculateThresholds, getCharacterFromCode } from "@/lib/CharacterUtils";
import { getUTCDate, isGameWon, isGameOver, getLegacyGuessesFromCodes, getCharacterListWithoutGuesses, hasGameStarted } from "@/lib/GameUtils";
import { saveGame, loadGame, getLastPlayedGame, updateLastPlayed, updateScores, createNewDailyGame, switchMostRecentGame } from "@/lib/SaveUtils";
import GameController from "@/components/Game/GameController";
import GuessTable from "@/components/Table/GuessTable";
import HeaderMenu from "@/app/components/HeaderMenu";
import TableHeader from "@/components/Table/TableHeader";

const MAX_GUESSES = 6;
const ATTRIBUTE_KEYS = ["code", "alignment", "tendency", "height", "birthplace"];
const APP_VERSION = "beta v1.2.617";

export default function Home() {
  const [guessDisabled, setGuessDisabled] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [reverseTable, setReverseTable] = useState(false);
  const lastRowRef = useRef<HTMLDivElement>(null);

  const [currentGame, setCurrentGame] = useState<AvailableGames>("ptndle");
  const [saveGuesses, setSaveGuesses] = useState<Attribute[][]>([]);
  const [saveTarget, setSaveTarget] = useState<Character>(getSeededCharacter());
  const [saveSeed, setSaveSeed] = useState<string>(getUTCDate());
  const [saveWon, setSaveWon] = useState<boolean>(false);
  const [saveOver, setSaveOver] = useState<boolean>(false);
  const [saveAllCharacters, setSaveAllCharacters] = useState<Character[]>([]);
  const [is_endless_mode_on, setIsEndlessModeOn] = useState(false);
  const [hasGameLoaded, setHasGameLoaded] = useState(false);


  /** Toggles table order */
  const handleReverseChange = (newReverse: boolean) => setReverseTable(newReverse);

  function updateBasedOnSave() {
    const game_to_load = getLastPlayedGame();
    const loaded_game = game_to_load === "ptndle" ? createNewDailyGame(game_to_load) : loadGame(game_to_load); 
    const is_loaded_endless_mode_on = game_to_load === "ptndle_endless";

    const endless_seed_modifier = loaded_game.history.length ?? 0;
    const endless_seed = loaded_game.data.seed + "_" + endless_seed_modifier;
    const loaded_seed = loaded_game.data.seed
    
    const loaded_target = is_loaded_endless_mode_on ? getSeededCharacter(endless_seed) : getSeededCharacter(loaded_seed);
    const is_game_won = isGameWon(loaded_game.data.guesses, loaded_target.code);
    const is_game_over = isGameOver(loaded_game.data.guesses, loaded_target.code);
    const legacy_guesses = getLegacyGuessesFromCodes(loaded_game.data.guesses, loaded_seed);

    const filtered_characters = getCharacterListWithoutGuesses(loaded_game.data.guesses);

    
    setCurrentGame(loaded_game.name);
    setSaveGuesses(legacy_guesses);
    setSaveSeed(loaded_seed);
    setSaveTarget(loaded_target);
    setSaveWon(is_game_won);
    setSaveOver(is_game_over);
    setSaveAllCharacters(filtered_characters);
    setSaveTarget(loaded_target);
    setHasGameLoaded(true);
    setIsEndlessModeOn(is_loaded_endless_mode_on);
    
    if(is_endless_mode_on) loaded_game.data.seed = endless_seed;
    
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
    if(!hasGameLoaded) return;
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

      const loaded_game = loadGame(currentGame);
      loaded_game.data.guesses.push(character.code)
      loaded_game.history[getUTCDate()] = loaded_game.data.guesses

      saveGame(loaded_game);
      updateBasedOnSave();

      setTimeout(() => setGuessDisabled(false), 500);
    },
    [guessDisabled]
  );

  const onToggleEndlessMode = useCallback(() => {
    setIsEndlessModeOn(!is_endless_mode_on);
  }, [is_endless_mode_on]);

  if (!saveTarget) return <div>Loading...</div>;

  return (
    <>
      <HeaderMenu appVersion={APP_VERSION} onToggleEndlessMode={onToggleEndlessMode} is_endless_mode_on={is_endless_mode_on}/>
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
            handleSelectCharacter={handleSelectCharacter}
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