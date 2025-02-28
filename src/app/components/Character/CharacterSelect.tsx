// src/app/components/CharacterSelect.tsx
import React, { useEffect } from 'react';
import Select from 'react-select';
import { Character, CharacterRank } from '@/types';
import { useState } from 'react';
import CharacterPreview from '@/components/Character/CharacterPreview';

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
  const options: OptionType[] = characters.map((character) => ({
    value: character.name,
    label: character.name,
    character: character,
  }));

  const maxWidthForLg: string = '296.6px'; // Otherwise the tile images are too big 

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

  if (!isMounted) {
    return (
      <div>Loading sinners...</div>
    )
  }


  return (
    <Select
      id='sinner-select'
      options={options}
      onChange={(selectedOption) => {
        if (selectedOption) {
          onSelect(selectedOption.character);
        }
      }}
      formatOptionLabel={formatOptionLabel}
      isSearchable={true}
      placeholder="Select a Sinner"
      isDisabled={disabled}
      className="mb-4 flex justify-center"
      classNamePrefix="sinner-select"
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: 'black',
          color: 'white',
          border: '1px solid var(--s1n-border)',
          display: 'flex',
          width: maxWidthForLg
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: 'var(--foreground)',
          color: 'white',
          width: maxWidthForLg
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          color: 'white',
          width: maxWidthForLg
        }),

        valueContainer: (baseStyles) => ({
          ...baseStyles,
          display: 'flex',
          width: maxWidthForLg
        }),
        input: (baseStyles) => ({
          ...baseStyles,
          color: 'white',
          width: maxWidthForLg
        }),

        option: (baseStyles, state) => {
          const { data } = state;
          const gradient_highlight = `linear-gradient(to top, var(--class-${data.character.rank}-sinner) 3%, transparent 75%)`;
          return {
            ...baseStyles,
            display: 'flex',
            alignItems: 'center',
            background: state.isFocused
              ? `linear-gradient(to top, var(--bloodred) 3%, transparent 75%)`
              : gradient_highlight,

            ':active': {
              ...baseStyles[':active'],
              backgroundColor: 'var(--foregroundHighlight)',
              width: maxWidthForLg
            },
          };
        },
      }}
      components={{
        SingleValue: ({ data }) =>
          <div className="">
            <CharacterPreview
              characterRank={data.character.rank as CharacterRank}
              displayValue={data.character.image}
              character_name={data.character.name}
              width={32}
              height={32}
              miniature={true}
              disable_highlight={true}
            />
            <span className="text-gray-400 hover:text-white transition-colors duration-200 max-w-[296.6]">
              You have selected {data.label}. Press to select another Sinner.
            </span>
          </div>
      }}
    />
  );
};

export default CharacterSelect;