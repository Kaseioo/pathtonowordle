// GuessRow.tsx
import React from 'react';
import Tile from '@/app/components/Tile/Tile';
import { Attribute, Character, Thresholds } from '@/types';
import { EvaluateNumericalGuess } from '@/lib/GuessUtils';

interface GuessRowProps {
	guess: Array<Attribute>;
	thresholds: Thresholds
	target_guess: Character;
	rowIndex: number;
}

const GuessRow: React.FC<GuessRowProps> = ({ guess, thresholds, target_guess, rowIndex }) => {
	const image = guess[0]
	const name = guess[1]
	const code = guess[2]
	const alignment = guess[3]
	const tendency = guess[4]
	const height = guess[5]
	const birthplace = guess[6]


	const createCommonColumns = (columns: Array<Attribute>) => {
		let distance = undefined;
		const rendered_columns = [];


		for (const column of columns) {
			switch (column.name) {
				case "code":
					distance = getCodeDistance(column.value);
					break;
				case "height":
					distance = getHeightDistance(column.value);
					break;
				default:
					distance = undefined;
					break;
			}

			if (distance !== undefined) {
				rendered_columns.push(
					<Tile
						key={`${rowIndex}-${column.name}`}
						comparison={distance}
						attribute={column}
						isNumericTile={true}
					/>
				)
			} else {
				rendered_columns.push(
					<Tile
						key={`${rowIndex}-${column.name}`}
						attribute={column}
						isNumericTile={false}
					/>
				)
			}
		}
		return (
			<>
				{rendered_columns}
			</>
		)
	}

	function getHeightDistance(currentNumber: string) {
		const height_data = EvaluateNumericalGuess(currentNumber, target_guess.height, thresholds.height.high, thresholds.height.very_high);
		return height_data.comparison;;
	}

	function getCodeDistance(currentNumber: string) {
		const code_data = EvaluateNumericalGuess(currentNumber, target_guess.code, thresholds.code.high, thresholds.code.very_high);
		return code_data.comparison;
	}

	return (
		<>
			{/* the margin here is to offset mobile/very small screens because for some reason the layout is leaving about this space of margin to the right and I can't find out which element is doing that */}
			<div key={rowIndex} className="flex flex-row ml-2">
				<Tile
					key={`${rowIndex}-image`}
					attribute={image}
					isImageTile={true}
					isEmpty={image.value === ""}
				/>

				<Tile
					key={`${rowIndex}-name`}
					attribute={name}
					width="wide"
				/>
				{createCommonColumns([code, alignment, tendency, height, birthplace])}
			</div>
		</>

		// <div key={rowIndex} className="flex flex-row">



		// </div>
	);
};

export default GuessRow;