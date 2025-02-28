// src/lib/CharacterUtils.ts

import {
  Character,
  Thresholds,
} from "@/types";
import characterData from "@/character_data/characters.json";
import { getUTCDate } from "@/lib/GameUtils";

const DEFAULT_CHARACTERS: Character[] = characterData as Character[];

export function getSeededCharacter(date: string = getUTCDate()): Character {
  const seed = cyrb53(date);
  const index = seed % DEFAULT_CHARACTERS.length;
  const seeded_character = DEFAULT_CHARACTERS[index];
  console.log(seeded_character);
  return seeded_character;
}

export function getCharacterFromCode(code: string): Character {
  const foundCharacter = DEFAULT_CHARACTERS.find(
    (character) => character.code === code
  );

  if (!foundCharacter) {
    throw new Error(`Character with code ${code} not found.`);
  }
  
  return foundCharacter;

}

// 2025-02-23
// https://stackoverflow.com/a/52171480
// https://github.com/bryc/code/blob/fdd2d21471febe58c7879707c0f43a65e1dd8248/jshash/experimental/cyrb53.js
const cyrb53 = (str: string, seed = 727) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export function getAllCharacters(): Character[] {
  return DEFAULT_CHARACTERS;
}

export function calculateThresholds(character: Character): Thresholds {
  const MOST_COMMON_HEIGHT = 168; // as of 2025-04-18


  const target_height = parseInt(character["height"]);
  const target_code = parseInt(character["code"]);
  
  // since higher codes are rarer, we make the range bigger here
  const code_threshold = 5 + target_code * 0.1;
  const code_threshold_far = 50 + target_code * 0.35

  // same as above, but starting from MOST_COMMON_HEIGHT instead.
  const height_threshold = 3 + Math.abs(target_height - MOST_COMMON_HEIGHT) * 0.1;
  const height_threshold_far = 15 + Math.abs(target_height - MOST_COMMON_HEIGHT) * 0.35;

  return {
    code: {
      high: code_threshold,
      very_high: code_threshold_far,
    },
    height: {
      high: height_threshold,
      very_high: height_threshold_far,
    },
  };
}
