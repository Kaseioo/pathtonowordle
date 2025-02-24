// src/app/page.tsx
'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Character, Attribute, AttributeState, Thresholds } from '@/types';
import { getAllCharacters, getSeededCharacter, calculateThresholds } from '@/lib/CharacterUtils';
import { evaluateGuess, EvaluateNumericalGuess, GuessDistanceEvaluationResult } from '@/lib/GuessUtils';
import GameController from '@/components/Game/GameController';
import GuessTable from '@/components/Table/GuessTable';
import HeaderMenu from '@/app/components/HeaderMenu';
import TableHeader from '@/components/Table/TableHeader';

const MAX_GUESSES = 6;
const ATTRIBUTE_KEYS = ['code', 'alignment', 'tendency', 'height', 'birthplace'];
const APP_VERSION = "beta v1.1.617";

type GameState = {
  guesses: (Attribute[])[];
  gameOver: boolean;
  gameWon: boolean;
  targetCharacter: Character;
  date: string; // Date string (YYYY-MM-DD)
};

export default function Home() {
  const [targetCharacter, setTargetCharacter] = useState<Character | null>(null);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [guesses, setGuesses] = useState<(Attribute[])[]>([]);
  const [guessDisabled, setGuessDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>();
  const [reverseTable, setReverseTable] = useState(false);
  const lastRowRef = useRef<HTMLDivElement>(null);
  let thresholds: Thresholds = { code: { high: 0, very_high: 0 }, height: { high: 0, very_high: 0 } };




  const handleReverseChange = (newReverse: boolean) => {
    setReverseTable(newReverse);
  };

  const saveGameState = (gameState: GameState) => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  };

  const loadGameState = (): GameState | null => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      const gameState: GameState = JSON.parse(savedState);
      const savedDate = new Date(gameState.date).toISOString().split('T')[0]
      const currentDate = new Date().toISOString().split('T')[0];

      if (savedDate == currentDate) {
        return gameState;

      } else {
        localStorage.removeItem('gameState');
        return null;
      }
    }
    return null;
  };

  // Load game state on initial render
  useEffect(() => {
    const loadedGameState = loadGameState();

    if (loadedGameState) {
      setGuesses(loadedGameState.guesses);
      setGameOver(loadedGameState.gameOver);
      setGameWon(loadedGameState.gameWon);
      setTargetCharacter(loadedGameState.targetCharacter);
      const default_characters = getAllCharacters();
      const filtered_characters: Character[] = [];

      const guessed_characters = loadedGameState.guesses.map(guess => guess[1].value.toLowerCase());
      for (const character of default_characters) {
        if (!guessed_characters.includes(character.name.toLowerCase())) {
          filtered_characters.push(character);
        }
      }
      setAllCharacters(filtered_characters);

      if (!loadedGameState.gameWon && !loadedGameState.gameOver) {
        const last_guess = loadedGameState.guesses[loadedGameState.guesses.length - 1];
        if (!last_guess) return;

        const last_guess_name = last_guess[1].value;

        let matchedCharacter = undefined;
        for (const character of default_characters) {
          if (character.name.toLowerCase() === last_guess_name.toLowerCase()) {
            matchedCharacter = character;
            break;
          }
        }
        if (matchedCharacter) {
          setImageSrc(matchedCharacter.image_full);
        }
      } else {
        // just set to targetCharacter
        setImageSrc(loadedGameState.targetCharacter.image_full);
      }
    } else {
      const newTarget = getSeededCharacter();
      setTargetCharacter(newTarget);
      setAllCharacters(getAllCharacters());
    }
  }, []);

  useEffect(() => {
    if (targetCharacter) {
      const gameState: GameState = {
        guesses,
        gameOver,
        gameWon,
        targetCharacter,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      };
      saveGameState(gameState);
    }
  }, [guesses, gameOver, gameWon, targetCharacter, allCharacters]);

  function updateThresholds() {
    thresholds = calculateThresholds(targetCharacter!);
  }

  useEffect(() => {
    if (lastRowRef.current && !reverseTable) {
      setTimeout(() => {
        lastRowRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
  }, [guesses]);

  const handleSelectCharacter = useCallback((character: Character) => {
    if (gameOver || guessDisabled) return;
    setImageSrc(character.image_full);
    setAllCharacters(allCharacters.filter(c => c.name !== character.name));

    setGuessDisabled(true);

    if (!targetCharacter) {
      console.error("Target character is null.");
      return;
    }

    const guess = {
      character,
      target: targetCharacter,
      thresholds: thresholds
    }

    const evaluated_guesses = evaluateGuess(guess);
    console.log(evaluated_guesses)
    setGuesses(prevGuesses => [...prevGuesses, evaluated_guesses]); // Use functional update

    if (evaluated_guesses.every(attr => attr.state === 'correct')) {
      setGameWon(true);
      setGameOver(true);
      setImageSrc(targetCharacter!.image_full);
    } else if (guesses.length + 1 === MAX_GUESSES) {
      setGameOver(true);
      setImageSrc(targetCharacter!.image_full);
    }

    setTimeout(() => {
      setGuessDisabled(false);
    }, 500);
  }, [gameOver, guessDisabled, guesses, targetCharacter, allCharacters, thresholds]); // Correct dependencies


  if (!targetCharacter) {
    return <div>Loading...</div>;
  }

  const handleNewTarget = () => {
    localStorage.removeItem('gameState'); // Clear old game state
    const newTarget = getSeededCharacter();
    calculateThresholds(newTarget);
    setTargetCharacter(newTarget);
    setAllCharacters(getAllCharacters());
    setGuesses([]);
    setGameOver(false);
    setGameWon(false);
    setImageSrc('');
  }

  return (
    updateThresholds(),
    <div className="flex flex-col items-center  min-h-screen relative">
      <HeaderMenu appVersion={APP_VERSION} />

      <GameController
        imageSrc={imageSrc ?? ''}
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
        <>
          <TableHeader attributeKeys={ATTRIBUTE_KEYS} reversed={reverseTable} onReverseChange={handleReverseChange} />
        </>
      )}

      <div className="flex flex-col mt-1 lg:mt-4" ref={lastRowRef}>
        {guesses.length > 0 &&
          <GuessTable
            guesses={guesses}
            target_guess={targetCharacter}
            thresholds={thresholds}
            reverse={reverseTable}
          />}
      </div>

    </div>
  );
}