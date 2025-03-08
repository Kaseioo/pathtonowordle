// src/app/components/CharacterSelect.tsx
import React, { useEffect, useRef } from "react";
import Select from "react-select";
import { Character, CharacterRank } from "@types";
import { useState } from "react";
import CharacterPreview from "@components/Character/CharacterPreview";

interface Props {
	characters: Character[];
	onSelect: (character: Character) => void;
	disabled: boolean;
}

interface OptionType {
	value: string;
	label: string;
	character: Character;
}

const CharacterSelect: React.FC<Props> = ({ characters, onSelect, disabled }) => {
	const [isMounted, setIsMounted] = useState(false);
	const [selectLabel, setSelectLabel] = useState("Select a Sinner");
	const block_character_update = useRef(false);

	const options: OptionType[] = characters.map((character) => ({
		value: character.name,
		label: character.name,
		character: character,
	}));

	const maxWidthForLg: string = "296.6px"; // Otherwise the tile images are too big

	const formatOptionLabel = (option: OptionType) => (
		<>
			{option.character.image && option.character.image.trim() !== "" && (
				<CharacterPreview
					characterRank={option.character.rank as CharacterRank}
					displayValue={option.character.image}
					character_name={option.character.name}
					width={64}
					height={64}
					miniature={true}
					disable_highlight={true}
				/>
			)}
			<span>{option.label}</span>
		</>
	);

	// makes rendering client-side only
	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (block_character_update.current) {
			block_character_update.current = false;
			return;
		}
		console.log("characters changed. updating...");
		setSelectLabel(`Please select a Sinner.`);
	}, [characters]);

	if (!isMounted) {
		return <div>Loading sinners...</div>;
	}

	return (
		<Select
			id="sinner-select"
			options={options}
			onChange={(selectedOption) => {
				if (selectedOption) {
					block_character_update.current = true;
					onSelect(selectedOption.character);
					setSelectLabel(`You have selected ${selectedOption.label}. Press to select another Sinner.`);
					console.log("change detected");
				}
			}}
			formatOptionLabel={formatOptionLabel}
			isSearchable={true}
			placeholder={selectLabel}
			isDisabled={disabled}
			className="mb-4 flex justify-center"
			classNamePrefix="sinner-select"
			styles={{
				control: (baseStyles) => ({
					...baseStyles,
					backgroundColor: "black",
					color: "white",
					border: "1px solid var(--s1n-border)",
					display: "flex",
					width: maxWidthForLg,
				}),
				menu: (baseStyles) => ({
					...baseStyles,
					backgroundColor: "var(--foreground)",
					color: "white",
					width: maxWidthForLg,
				}),
				singleValue: (baseStyles) => ({
					...baseStyles,
					color: "white",
					width: maxWidthForLg,
				}),

				valueContainer: (baseStyles) => ({
					...baseStyles,
					display: "flex",
					width: maxWidthForLg,
				}),
				input: (baseStyles) => ({
					...baseStyles,
					color: "white",
					width: maxWidthForLg,
				}),

				option: (baseStyles, state) => {
					const { data } = state;
					const gradient_highlight = `linear-gradient(to top, var(--class-${data.character.rank}-sinner) 3%, transparent 75%)`;
					return {
						...baseStyles,
						display: "flex",
						alignItems: "center",
						background: state.isFocused
							? `linear-gradient(to top, var(--bloodred) 3%, transparent 75%)`
							: gradient_highlight,

						":active": {
							...baseStyles[":active"],
							backgroundColor: "var(--foregroundHighlight)",
							width: maxWidthForLg,
						},
					};
				},
			}}
			components={{
				SingleValue: () => (
					<div className="">
						<span className="flex text-justify text-gray-300 hover:text-white transition-colors duration-200 max-w-[296.6]">
							{selectLabel}
						</span>
					</div>
				),
			}}
		/>
	);
};

export default CharacterSelect;
