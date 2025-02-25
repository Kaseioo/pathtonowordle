"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Character, Attribute, GameState, Thresholds } from "@/types";
import { getAllCharacters, getSeededCharacter, getUTCDate, calculateThresholds } from "@/lib/CharacterUtils";
import { evaluateGuess } from "@/lib/GuessUtils";
import { saveGameState, loadGameState } from "@/lib/GameUtils";
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

  /** Toggles table order */
  const handleReverseChange = (newReverse: boolean) => setReverseTable(newReverse);

  /** Updates thresholds based on the target character */
  function updateThresholds() {
    thresholds = calculateThresholds(targetCharacter!);
  }

  /** Initializes or Loads the Game */
  useEffect(() => {
    const loadedGameState = loadGameState();

    if (loadedGameState) {
      loadedGameState.guesses.forEach((guess) => console.log(guess))
      assert(loadedGameState.guesses.every((guess) => guess.length === 7)) // Assertion here for now for object representation check
      const target_character = getSeededCharacter(loadedGameState.seed)
      const is_game_won = loadedGameState.guesses.at(-1)?.[1].name === target_character.name 
      // TODO: Define and implement CharacterAttributes to avoid short-circuiting
      const is_game_over = is_game_won || loadedGameState.guesses.length === MAX_GUESSES
      setGuesses(loadedGameState.guesses);
      setGameOver(is_game_over);
      setGameWon(is_game_won);
      setSeed(loadedGameState.seed)
    
      setTargetCharacter(getSeededCharacter(loadedGameState.seed));

      const guessedNames = loadedGameState.guesses.map((guess) => guess[1].value.toLowerCase());
      const filteredCharacters = getAllCharacters().filter((c) => !guessedNames.includes(c.name.toLowerCase()));
      setAllCharacters(filteredCharacters);

      // Set last guessed character's image
      if (!is_game_over) {
        const lastGuess = loadedGameState.guesses.at(-1);
        const lastGuessName = lastGuess?.[1]?.value;

        const matchedCharacter = getAllCharacters().find((c) => c.name.toLowerCase() === lastGuessName?.toLowerCase());
        setImageSrc(matchedCharacter?.image_full || "");
      } else {
        setImageSrc(target_character.image_full);
      }
    } else {
      const newTarget = getSeededCharacter();
      setSeed(getUTCDate());
      setTargetCharacter(newTarget);
      setAllCharacters(getAllCharacters());
    }
  }, []);

  /** Saves game state when game changes */
  useEffect(() => {
    if (targetCharacter) {
      saveGameState({
        guesses,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
        seed: seed
      });
    }
  }, [guesses, gameOver, seed, targetCharacter]);

  /** Scrolls to the last guess */
  useEffect(() => {
    if (lastRowRef.current && !reverseTable) {
      setTimeout(() => {
        lastRowRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    }
  }, [guesses]);

  /** Handles a player's guess selection */
  const handleSelectCharacter = useCallback(
    (character: Character) => {
      if (gameOver || guessDisabled) return;

      setImageSrc(character.image_full);
      setAllCharacters((prev) => prev.filter((c) => c.name !== character.name));
      setGuessDisabled(true);

      if (!targetCharacter) {
        console.error("Target character is null.");
        return;
      }

      const evaluatedGuesses = evaluateGuess({ character, target: targetCharacter, thresholds });
      setGuesses((prevGuesses) => [...prevGuesses, evaluatedGuesses]);

      if (evaluatedGuesses.every((attr) => attr.state === "correct")) {
        setGameWon(true);
        setGameOver(true);
        setImageSrc(targetCharacter.image_full);
      } else if (guesses.length + 1 === MAX_GUESSES) {
        setGameOver(true);
        setImageSrc(targetCharacter.image_full);
      }

      setTimeout(() => setGuessDisabled(false), 500);
    },
    [gameOver, guessDisabled, guesses, targetCharacter, allCharacters, thresholds]
  );

  /** Resets the game with a new target character */
  const handleNewTarget = () => {
    localStorage.removeItem("gameState");
    const new_seed = (Math.random() * 1000).toString();
    setSeed(new_seed)
    const new_target = getSeededCharacter(new_seed);
    calculateThresholds(new_target);
    setTargetCharacter(new_target);
    setAllCharacters(getAllCharacters());
    setGuesses([]);
    setGameOver(false);
    setGameWon(false);
    setImageSrc("");
  };

  if (!targetCharacter) return <div>Loading...</div>;

  return (
    <>
      {updateThresholds()}
      <div className="flex flex-col items-center min-h-screen relative">
        <HeaderMenu appVersion={APP_VERSION} />

        <GameController
          imageSrc={imageSrc ?? ""}
          gameOver={gameOver}
          gameWon={gameWon}
          targetCharacter={targetCharacter}
          guesses={guesses}
          MAX_GUESSES={MAX_GUESSES}
          allCharacters={allCharacters}
          handleSelectCharacter={handleSelectCharacter}
          guessDisabled={guessDisabled}
        />

        <button
          onClick={handleNewTarget}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          New Target
        </button>

        {guesses.length > 0 && (
          <TableHeader attributeKeys={ATTRIBUTE_KEYS} reversed={reverseTable} onReverseChange={handleReverseChange} />
        )}

        <div className="flex flex-col mt-1 lg:mt-4" ref={lastRowRef}>
          {guesses.length > 0 && (
            <GuessTable
              guesses={guesses}
              target_guess={targetCharacter}
              thresholds={thresholds}
              reverse={reverseTable}
            />
          )}
        </div>
      </div>
    </>
  );
}
