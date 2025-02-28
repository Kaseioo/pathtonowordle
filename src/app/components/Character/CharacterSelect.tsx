// src/app/components/CharacterSelect.tsx
import React, { useEffect } from 'react';
import Select from 'react-select';
import { Character, CharacterRank } from '@/types';
import CharacterPreview from './CharacterPreview';
import { useState } from 'react';

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

  const formatOptionLabel = (option: OptionType) => (
    <div className="flex items-center">
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
    </div>
  );


  // makes rendering client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
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
      placeholder="You may type the name of a Sinner, or choose them from the list."
      isDisabled={disabled}
      className="mb-4 w-full"
      classNamePrefix="sinner-select"
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: 'black',
          color: 'white',
          border: '1px solid var(--s1n-border)',
          display: 'flex'
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: 'var(--foreground)',
          color: 'white',
        }),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          color: 'white',
        }),

        valueContainer: (baseStyles) => ({
          ...baseStyles,
          display: 'flex'
        }),
        input: (baseStyles) => ({
          ...baseStyles,
          color: 'white',
        }),

        option: (baseStyles, state) => {
          const { data } = state;
          const gradient_highlight = `linear-gradient(to top, var(--class-${data.character.rank}-sinner) 3%, transparent 75%)`;
          return {
            ...baseStyles,
            background: state.isFocused
              ? `linear-gradient(to top, var(--bloodred) 3%, transparent 75%)`
              : gradient_highlight,

            ':active': {
              ...baseStyles[':active'],
              backgroundColor: 'var(--foregroundHighlight)',
            },
          };
        },
      }}
      components={{
        SingleValue: ({ data }) =>
          <div className="flex items-center">
            <CharacterPreview
              characterRank={data.character.rank as CharacterRank}
              displayValue={data.character.image}
              character_name={data.character.name}
              width={32}
              height={32}
              miniature={true}
              disable_highlight={true}
            />
            <span className="text-gray-400 hover:text-white transition-colors duration-200">
              You have selected {data.label}. Press to select another Sinner.
            </span>
          </div>
      }}
    />
  );
};

export default CharacterSelect;