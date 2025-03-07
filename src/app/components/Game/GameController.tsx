// GameController.tsx
import React from 'react';
import GameStatus from '@/components/Game/GameStatus'; // Import GameStatus
import CharacterSelect from '@/components/Character/CharacterSelect'; // Import CharacterSelect
import { Attribute, Character } from '@/types';
import GameImageDisplay from '@/components/Game/GameImageDisplay';
import '@/components/Game/GameController.css'
import CountdownClock from '@/components/CountdownClock';
import Image from 'next/image';

interface GameControllerProps {
	imageSrc: string;
	gameOver: boolean;
	gameWon: boolean;
	targetCharacter: Character;
	guesses: Attribute[][];
	MAX_GUESSES: number;
	allCharacters: Character[];
	isEndlessOn: boolean;
	handleSelectCharacter: (character: Character) => void;
	handleEndlessReset: () => void;
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
	isEndlessOn,
	handleSelectCharacter,
	handleEndlessReset,
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
					{gameFinished && isEndlessOn && (
						<div className="flex flex-col mt-4 items-center justify-center bg-s1n-gradient w-full border border-foreground-highlight">
							<Image
								src={"/images/ptn_infinity_bloodred.svg"}
								alt="Endless Mode"
								width={48}
								height={48}
								className="flex"
							/>
							<button
								className={`flex w-full h-16 mx-4 items-center justify-center bg-foreground hover:bg-foreground-highlight`}
								onClick={handleEndlessReset}
							>
								Play Again
							</button>
						</div>
					)}

				</div>
			</div>
		</div>
	);
};

export default GameController;