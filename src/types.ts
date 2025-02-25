// src/types.ts

export type AttributeState = "absent" | "present" | "correct" | "empty";
export type CharacterRank = "S" | "A" | "B";

export interface Character {
  name: string;
  code: string;
  alignment: string;
  tendency: string;
  height: string;
  birthplace: string;
  birthday: string;
  "release date": string;
  image: string;
  image_full: string;
  rank: CharacterRank;
  [key: string]: string | CharacterRank;
}

export interface Attribute {
  name: string;
  value: string | "";
  state: AttributeState;
  rank: string;
}

export interface Thresholds {
  code: {
    high: number,
    very_high: number
  },
  height: {
    high: number,
    very_high: number
  }
}

export interface Guess {
  character: Character;
  target: Character;
  thresholds: Thresholds;
}