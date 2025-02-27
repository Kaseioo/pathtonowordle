"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Character, Attribute, GameState, Thresholds, Game, AvailableGames } from "@/types";
import { getAllCharacters, getSeededCharacter, calculateThresholds, getCharacterFromCode } from "@/lib/CharacterUtils";
import { evaluateGuess } from "@/lib/GuessUtils";
import { saveGameState, loadGameState, getUTCDate, isGameWon, isGameOver, getLegacyGuessesFromCodes, getCharacterListWithoutGuesses } from "@/lib/GameUtils";
import { saveGame, loadGame, createEmptySave, getLastPlayedGame, updateLastPlayed } from "@/lib/SaveUtils";
import GameController from "@/components/Game/GameController";
import GuessTable from "@/components/Table/GuessTable";
import HeaderMenu from "@/app/components/HeaderMenu";
import TableHeader from "@/components/Table/TableHeader";
import assert from "assert";

const MAX_GUESSES = 6;
const ATTRIBUTE_KEYS = ["code", "alignment", "tendency", "height", "birthplace"];
const APP_VERSION = "beta v1.1.617";

export default function Home() {
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null);
  const [seed, setSeed] = useState<string>("") // targetCharacter is kinda redundent with seed as well
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [guesses, setGuesses] = useState<Attribute[][]>([]);
  const [guessDisabled, setGuessDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [reverseTable, setReverseTable] = useState(false);
  const lastRowRef = useRef<HTMLDivElement>(null);
  let thresholds: Thresholds = { code: { high: 0, very_high: 0 }, height: { high: 0, very_high: 0 } };

  const [currentGame, setCurrentGame] = useState<AvailableGames>("ptndle");
  const [saveGuesses, setSaveGuesses] = useState<Attribute[][]>([]);
  const [saveTarget, setSaveTarget] = useState<Character>(getSeededCharacter());
  const [saveSeed, setSaveSeed] = useState<string>(getUTCDate());
  const [saveWon, setSaveWon] = useState<boolean>(false);
  const [saveOver, setSaveOver] = useState<boolean>(false);
  const [saveAllCharacters, setSaveAllCharacters] = useState<Character[]>([]);

  /** Toggles table order */
  const handleReverseChange = (newReverse: boolean) => setReverseTable(newReverse);

  /** Updates thresholds based on the target character */
  function updateThresholds() {
    thresholds = calculateThresholds(getSeededCharacter(saveSeed)!);
  }

  function updateBasedOnSave(){
    const game_to_load = getLastPlayedGame();
    const loaded_game = loadGame(game_to_load);

    console.log("our current game data is", loaded_game);

    const loaded_seed = loaded_game.data.seed;
    const loaded_target = getSeededCharacter(loaded_seed);
    const is_game_won = isGameWon(loaded_game.data.guesses, loaded_target.code);
    const is_game_over = isGameOver(loaded_game.data.guesses, loaded_target.code);
    const legacy_guesses = getLegacyGuessesFromCodes(loaded_game.data.guesses);

    const filtered_characters = getCharacterListWithoutGuesses(loaded_game.data.guesses);
    console.log("save sede", loaded_seed);


    setCurrentGame(loaded_game.name);
    setSaveGuesses(legacy_guesses);
    setSaveSeed(loaded_game.data.seed);
    setSaveTarget(loaded_target);
    setSaveWon(is_game_won);
    setSaveOver(is_game_over);
    setSaveAllCharacters(filtered_characters);
    setSaveTarget(loaded_target);


    if(!is_game_over){
      if(loaded_game.data.guesses.length > 0) {
        const last_character_guessed = getCharacterFromCode(loaded_game.data.guesses[loaded_game.data.guesses.length - 1]);
        setImageSrc(last_character_guessed.image_full)
      }
    } else {
      setImageSrc(loaded_target.image_full);
    }

    console.log("legacy guesses", legacy_guesses);
    console.log("is game won?", is_game_won);
    console.log("is game over?", is_game_over);

  }

  /** Initializes or Loads the Game */
  useEffect(() => {
    updateBasedOnSave();
  }, []);

  const handleSelectCharacter = useCallback(
    (character: Character) => {
      if (saveOver || guessDisabled) return;

      const loaded_game = loadGame(currentGame);
      loaded_game.data.guesses.push(character.code)

      saveGame(loaded_game);
      updateBasedOnSave();

      setTimeout(() => setGuessDisabled(false), 500);
    },
    [gameOver, guessDisabled, guesses, targetCharacter, allCharacters, thresholds]
  );

  if (!saveTarget) return <div>Loading...</div>;

  return (
    <>
      {updateThresholds()}
      <div className="flex flex-col items-center min-h-screen relative">
        <HeaderMenu appVersion={APP_VERSION} />

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

        {saveGuesses.length > 0 && (
          <TableHeader attributeKeys={ATTRIBUTE_KEYS} reversed={reverseTable} onReverseChange={handleReverseChange} />
        )}

        <div className="flex flex-col mt-1 lg:mt-4" ref={lastRowRef}>
          {saveGuesses.length > 0 && (
            <GuessTable
              guesses={saveGuesses}
              target_guess={saveTarget}
              thresholds={thresholds}
              reverse={reverseTable}
            />
          )}
        </div>
      </div>
    </>
  );
}
