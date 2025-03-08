// lib/GuessUtils.ts

import { Guess, Attribute, AttributeState } from "@types";

export type GuessDistanceEvaluationResult =
	| { comparison: "≅"; description: "close" }
	| { comparison: "↑"; description: "higher" }
	| { comparison: "↓"; description: "lower" }
	| { comparison: "↑↑"; description: "much higher" }
	| { comparison: "↓↓"; description: "much lower" }
	| { comparison: undefined; description: "correct" }
	| { comparison: undefined; description: "undefined" };

export function EvaluateNumericalGuess(
	guess: string,
	target: string,
	threshold: number = 5,
	far_threshold: number = 100
): GuessDistanceEvaluationResult {
	const guessed_value = parseInt(guess);
	const target_value = parseInt(target);

	if (isNaN(guessed_value) && isNaN(target_value)) return { comparison: undefined, description: "undefined" };
	const is_positive = guessed_value - target_value < 0;
	const distance_from_target = Math.abs(guessed_value - target_value);

	if (distance_from_target == 0) return { comparison: undefined, description: "correct" };
	if (distance_from_target <= threshold) return { comparison: "≅", description: "close" };
	if (is_positive && distance_from_target > far_threshold) return { comparison: "↑↑", description: "much higher" };
	if (is_positive && distance_from_target <= far_threshold) return { comparison: "↑", description: "higher" };
	if (!is_positive && distance_from_target > far_threshold) return { comparison: "↓↓", description: "much lower" };
	if (!is_positive && distance_from_target <= far_threshold) return { comparison: "↓", description: "lower" };

	return { comparison: undefined, description: "undefined" };
}

export function evaluateGuess(guess: Guess): Attribute[] {
	const display_attributes = ["image", "name"];
	const character_attributes = ["code", "alignment", "tendency", "height", "birthplace"];

	const default_columns: Attribute[] = display_attributes.map((key) => ({
		name: key,
		value: guess.character[key],
		state: guess.character[key] === guess.target[key] ? "correct" : "absent",
		rank: guess.character.rank,
	}));

	const character_columns: Attribute[] = character_attributes.map((key) => {
		const value = guess.character[key];
		const distance_data = getDistanceMeasurements(guess, key);
		const state: AttributeState =
			value === guess.target[key] ? "correct" : distance_data.description === "close" ? "present" : "absent";

		return {
			name: key,
			value: value,
			state: state,
			rank: guess.character.rank,
		};
	});

	return [...default_columns, ...character_columns];
}

export function getDistanceMeasurements(guess: Guess, key: string): GuessDistanceEvaluationResult {
	switch (key) {
		case "height":
			return EvaluateNumericalGuess(
				guess.character.height,
				guess.target.height,
				guess.thresholds.height.high,
				guess.thresholds.height.very_high
			);
		case "code":
			return EvaluateNumericalGuess(
				guess.character.code,
				guess.target.code,
				guess.thresholds.code.high,
				guess.thresholds.code.very_high
			);
	}
	return { comparison: undefined, description: "undefined" };
}
