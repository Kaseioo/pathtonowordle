// GuessTable.tsx
import React from 'react';
import { Attribute, Character, Thresholds } from '@/types';
import GuessRow from './GuessRow';

interface GuessTableProps {
	guesses: Array<Attribute[]>;
	target_guess: Character;
	thresholds: Thresholds
	reverse?: boolean
}
const GuessTable: React.FC<GuessTableProps> = ({
	guesses,
	target_guess,
	thresholds,
	reverse = false,
}) => {
	const displayedGuesses = reverse ? [...guesses].reverse() : guesses;
	return (
		<>
			<div className="flex flex-col mt-1">
				{displayedGuesses.map((guess, index) => (
					<GuessRow
						key={index}
						guess={guess}
						thresholds={thresholds}
						target_guess={target_guess}
						rowIndex={index}
					/>
				))}
			</div>
		</>
	);
};

export default GuessTable;