// components/CharacterPreview.jsx
import Image from 'next/image';
import { CharacterRank } from '@types';

interface CharacterPreviewProps {
	characterRank: CharacterRank;
	displayValue: string | null;
	character_name: string;
	width: number;
	height: number;
	miniature?: boolean;
	disable_highlight?: boolean;
}

function CharacterPreview({
	characterRank,
	displayValue,
	character_name,
	width,
	height,
	miniature = false,
	disable_highlight = false,
}: CharacterPreviewProps) {
	const bgClassName = disable_highlight ? "" : `bg-class-${characterRank}-gradient`;
	const miniatureClassName = miniature ? 'rounded-full mr-2' : 'rounded-md';
	// i think theres some optimization somewhere, or some lost toLowerCase fucking things because this simply wouldn't render correctly after packaging
	displayValue = displayValue ? (displayValue.includes("sinner") ? displayValue.replace("sinner", "Sinner") : displayValue) : displayValue;
	return (
		<div
			className={`${bgClassName} ${miniatureClassName} relative overflow-hidden`}
		>
			<Image
				src={displayValue || '/images/placeholder.png'}
				alt={`Image of ${character_name}`}
				width={width}
				height={height}
				className={`object-cover ${miniatureClassName}`}
			/>
		</div>
	);
}

export default CharacterPreview;