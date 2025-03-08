// src/components/GameImageDisplay.tsx (or .jsx)
import React from "react";
import Image from "next/image";
import { Character } from "@types";

interface GameImageDisplayProps {
	imageSrc: string;
	sinner: Character;
	gameWon: boolean;
	gameOver: boolean;
}

const GameImageDisplay: React.FC<GameImageDisplayProps> = ({ imageSrc, sinner, gameWon, gameOver }) => {
	if (!imageSrc) {
		return null;
	}

	const win_gradient = "bg-gradient-to-t from-green-500 from-0% to-transparent to-50%";
	const loss_gradient = `bg-class-${sinner.rank}-gradient`;
	const default_gradient = "bg-gradient-to-t from-red-500 from-0% to-transparent to-50%";
	// const loss_gradient = `bg-gradient-to-t from var(--class-${sinner.rank}-sinner) from 3% to transparent to 75%`

	const gradient_to_render = gameWon ? win_gradient : gameOver ? loss_gradient : default_gradient;

	return (
		<Image
			src={imageSrc}
			alt="Selected Character"
			width={512}
			height={512}
			className={`${gradient_to_render} max-h-[70vh] min-h-[500px] max-w-[300px] w-auto object-cover`}
			unoptimized={true}
		/>
	);
};

export default GameImageDisplay;
