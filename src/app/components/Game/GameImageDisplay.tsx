// src/components/GameImageDisplay.tsx (or .jsx)
import React from 'react';
import Image from 'next/image';
import { Character } from '@/types';

interface GameImageDisplayProps {
	imageSrc: string;
	sinner: Character;
	gameWon: boolean;
	gameOver: boolean;
}

const GameImageDisplay: React.FC<GameImageDisplayProps> = ({
	imageSrc,
	sinner,
	gameWon,
	gameOver
}) => {
	if (!imageSrc) {
		return null;
	}

	const win_gradient = 'bg-gradient-to-t from-green-500 from-0% to-transparent to-50%'
	const loss_gradient = `bg-class-${sinner.rank}-gradient`
	const default_gradient = 'bg-gradient-to-t from-red-500 from-0% to-transparent to-50%'
	// const loss_gradient = `bg-gradient-to-t from var(--class-${sinner.rank}-sinner) from 3% to transparent to 75%`

	const gradient_to_render = gameWon ? win_gradient : gameOver ? loss_gradient : default_gradient;

	return (
		<div className="flex flex-col items-center">
			<div className={`relative overflow-hidden ${gradient_to_render}`}>
				<Image
					src={imageSrc}
					alt="Selected Character"
					width={512}
					height={512}
					className="h-full w-full"
					unoptimized={true}
				/>
			</div>
		</div>
	);
};

export default GameImageDisplay;