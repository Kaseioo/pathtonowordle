// GameStatus.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import EmojiGuesses from './EmojiGuesses';
import { Attribute } from '@/types';
import { hasGameStarted } from '@/lib/GameUtils';
import { loadGame, getLastPlayedGame } from '@/lib/SaveUtils';

interface GameStatusProps {
	gameOver: boolean;
	gameWon: boolean;
	targetCharacter?: { name: string }; //  Made optional and added a type
	guesses: Attribute[][];
	MAX_GUESSES: number;
}

const GameStatus: React.FC<GameStatusProps> = ({
	gameOver,
	gameWon,
	targetCharacter,
	guesses,
	MAX_GUESSES,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return (
			<div>Loading game controls...</div>
		)
	}

	const game = loadGame(getLastPlayedGame());
	return (
		<div className="text-center flex flex-col">
			{gameOver ? (
				<div>
					<p className="text-2xl font-bold bg-s1n-gradient border border-s1n-border">{gameWon ? "You won!" : "You lost!"}</p>
					<table className="mx-auto mb-4 text-sm content-center">
						<tbody>
							<tr>
								<th className="py-2 px-1 font-bold border-r border-[theme(colors.s1n-border)]">Wins</th>
								<th className="py-2 px-1 border-r border-[theme(colors.s1n-border)]">Streak</th>
								<th className="py-2 px-1">Highscore</th>
							</tr>
							<tr>
								<td className="py-2 px-1 font-bold border-r border-[theme(colors.s1n-border)]">{game.scoring.total_wins}</td>
								<td className="py-2 px-1 border-r border-[theme(colors.s1n-border)]">{game.scoring.streak}</td>
								<td className="py-2 px-1">{game.scoring.high_score}</td>
							</tr>
						</tbody>
					</table>
					<div>
					</div>
					<p className="text-lg">Today&apos;s sinner is {targetCharacter?.name}.</p>
				</div>
			) : (
				<div>
					<h2 className="text-2xl font-bold">Path to Nowordle</h2>
					{!hasGameStarted(guesses) ? (
						<>
							<p className="text-lg mb-2">
								Try to find the daily Sinner.
							</p>
							<p className="text-md mb-2">
								Press the ? button on the top left corner to learn how to play.
							</p>

							<Image
								src="/images/placeholder.png"
								alt="Selected Character"
								width={256}
								height={256}
								className="object-cover h-full rounded-full mx-auto mb-2"
								unoptimized={true}
							/>
						</>
					) : (
						<>
							<p className="text-lg">
								Guess {guesses.length}/{MAX_GUESSES}.
							</p>
						</>
					)}
				</div>
			)}
			<div className="my-4">
				<EmojiGuesses
					guesses={guesses}
					gameOver={gameOver}
					gameWon={gameWon}
				/>
			</div>
		</div>
	);
};

export default GameStatus;