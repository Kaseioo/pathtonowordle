// EmojiGuesses.tsx
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Attribute } from '@/types';

interface EmojiGuessesProps {
  guesses: Array<Array<Attribute>>;  // Array of arrays, each inner array is a guess
  gameOver: boolean;
}

const EmojiGuesses: React.FC<EmojiGuessesProps> = ({
  guesses,
  gameOver,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const copyRef = useRef<HTMLDivElement>(null); // Ref for the container to copy

  // Use useMemo to calculate the emojis array.  This is efficient and avoids
  // recalculating on every render unless `guesses` changes.
  const emojis = useMemo(() => {
    const filteredGuesses = guesses.map((guess) =>
      guess.filter((attribute) => attribute.name !== 'image')
    );

    const emojiArray: string[][] = [];

    for (let sinner = 0; sinner < filteredGuesses.length; sinner++) {
      emojiArray.push([]);

      for (const guess of filteredGuesses[sinner]) {
        switch (guess.state) {
          case 'correct':
            emojiArray[sinner].push('🟩');
            break;
          case 'empty':
          case 'absent':
            emojiArray[sinner].push('🟥');
            break;
          case 'present':
            emojiArray[sinner].push('🟨');
            break;
        }
      }
    }
    return emojiArray;
  }, [guesses]);


  const handleCopyClick = useCallback(() => {
    const textToCopy = emojis.map(row => row.join('')).join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    } else {
      console.warn('Clipboard API not supported in this context.');
      alert('Copying is not supported in this browser or environment. Please use HTTPS.');
    }
  }, [emojis, setCopySuccess]); 

  const renderEmojis = () => (
    <div ref={copyRef} className="flex flex-col items-center">
      {emojis.map((guess, index) => (
        <div key={index} className="flex flex-row">
          {guess.map((emoji, innerIndex) => (
            <div key={innerIndex} className="text-4xl">{emoji}</div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {renderEmojis()}
      {gameOver && (
        <button
          onClick={handleCopyClick}
          className={`mt-4 px-4 py-2 rounded ${copySuccess ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
          disabled={copySuccess}
        >
          {copySuccess ? 'Copied!' : 'Copy Results'}
        </button>
      )}
    </div>
  );
};

export default EmojiGuesses;