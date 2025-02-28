// src/types.ts

export type AttributeState = "absent" | "present" | "correct" | "empty";
export type CharacterRank = "S" | "A" | "B";

export type Character = {
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

export type Attribute = {
  name: string;
  value: string | "";
  state: AttributeState;
  rank: string;
}

export type Thresholds = {
  code: {
    high: number,
    very_high: number
  },
  height: {
    high: number,
    very_high: number
  }
}

export type Guess = {
  character: Character;
  target: Character;
  thresholds: Thresholds;
}

export type GameState = {
  guesses: Attribute[][]; // Why is this storing attributes instead of characters??
  date: string; // Date string (YYYY-MM-DD)
  seed: string; // Seed for cheating prevention
};

export type CharacterAttributes = [
  { name: "image"; value: string, state: string, rank: string},
  { name: "name"; value: string, state: string, rank: string},
  { name: "code"; value: string, state: string, rank: string},
  { name: "alignment"; value: string, state: string, rank: string },
  { name: "tendency"; value: string, state: string, rank: string },
  { name: "height"; value: string, state: string, rank: string },
  { name: "birthplace"; value: string, state: string, rank: string },
]; // TODO: use this in code, also wtf value can mean anything, it might be better to split
   //       this type into even more subtypes for stronger typing and pre and post conditions 