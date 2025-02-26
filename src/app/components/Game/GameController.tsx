// GameController.tsx
import React from 'react';
import GameStatus from '@/components/Game/GameStatus'; // Import GameStatus
import CharacterSelect from '@/components/Character/CharacterSelect'; // Import CharacterSelect
import { Attribute, Character } from '@/types';
import GameImageDisplay from '@/components/Game/GameImageDisplay';
import '@/components/Game/GameController.css'
import CountdownClock from '@/components/CountdownClock';

interface GameControllerProps {
	imageSrc: string;
	gameOver: boolean;
	gameWon: boolean;
	targetCharacter: Character;
	guesses: Attribute[][];
	MAX_GUESSES: number;
	allCharacters: Character[];
	handleSelectCharacter: (character: Character) => void;
	guessDisabled: boolean;
}

const GameController: React.FC<GameControllerProps> = ({
	imageSrc,
	gameOver,
	gameWon,
	targetCharacter,
	guesses,
	MAX_GUESSES,
	allCharacters,
	handleSelectCharacter,
	guessDisabled,
}) => {
	const current_date = new Date(new Date().toUTCString());
	const next_date = new Date(Date.UTC(current_date.getUTCFullYear(), current_date.getUTCMonth(), current_date.getUTCDate() + 1));
	const gameFinished = gameOver || gameWon;
	return (
		<div className="controller-body">
			<div className="greedy-packing-row gap-4">
				<GameImageDisplay imageSrc={imageSrc} gameWon={gameWon} sinner={targetCharacter} gameOver={gameOver} />
				<div>
					<GameStatus
						gameOver={gameOver}
						gameWon={gameWon}
						targetCharacter={targetCharacter}
						guesses={guesses}
						MAX_GUESSES={MAX_GUESSES}
					/>
					{gameFinished && (
						<CountdownClock nextDate={next_date} />
					)}
					{!gameFinished && (
						<CharacterSelect
							characters={allCharacters}
							onSelect={handleSelectCharacter}
							disabled={guessDisabled}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default GameController;