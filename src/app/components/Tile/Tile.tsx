// src/app/components/Tile.tsx
import React from 'react';
import { Attribute, CharacterRank } from '@/types';
import Image from 'next/image';
import './Tile.css';
import '@/components/Character/CharacterPreview'
import CharacterPreview from '@/components/Character/CharacterPreview';
import useFlipAnimation from '@/components/Tile/useFlipAnimation';

interface TileProps {
  attribute: Attribute;
  comparison?: string;
  width?: string;
  height?: string;
  isImageTile?: boolean;
  isNumericTile?: boolean;
  isEmpty?: boolean;
  status?: string;
  position?: number;
}

const Tile: React.FC<TileProps> = ({
  attribute,
  width = '',
  height = '',
  isImageTile = false,
  isNumericTile = false,
  isEmpty = false,
  comparison,
  position = 0,
  status = 'idle',
}) => {
  const delay = position * 200;
  const animationClass = useFlipAnimation(status, delay);

  let statusClass = '';
  if (animationClass === 'flipped' || status === 'finished') {
    statusClass = status;
  }

  attribute.name = attribute.name.toLowerCase();
  attribute.value = attribute.value.toLowerCase();
  const displayValue = attribute.value && attribute.value.trim() !== '' ? attribute.value : null;
  const tile_formatting = `${attribute.name} bg-class-${attribute.rank}-gradient tile-content ${attribute.state} ${animationClass} ${height} tile-dynamic ${width}`;
  const character_rank: CharacterRank = attribute.rank as CharacterRank;

  return (
    <>
      <div className={`tile ${animationClass} ${statusClass}`}>
        <div className="tile-face tile-face-front">
          <div
            className={tile_formatting}
          >
            <Image
              src={'/images/Minos/mbcc_black.png'}
              alt={`Image of ${attribute.name}`}
              width={96}
              height={96}
              className="object-cover rounded-md"
            />

          </div>
        </div>
        <div className="tile-face tile-face-back">
          <div
            className={tile_formatting}
          >
            {isImageTile && !isEmpty ? (
              <CharacterPreview
                characterRank={character_rank}
                displayValue={displayValue}
                character_name={attribute.name}
                width={128}
                height={128}
              />
            ) : (
              <div className="inline-flex flex-col items-center relative">
                {isNumericTile && comparison && (
                  <span className="absolute bottom-5 text-xs lg:text-2xl">
                    {comparison}
                  </span>
                )}
                {displayValue !== null && <span>{displayValue}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Tile;