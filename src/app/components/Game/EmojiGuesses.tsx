// EmojiGuesses.tsx
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Attribute } from '@/types';
import { getDailyGameNumber } from '@/lib/SaveUtils';

interface EmojiGuessesProps {
  guesses: Array<Array<Attribute>>;  // Array of arrays, each inner array is a guess
  gameOver: boolean;
}

const EmojiGuesses: React.FC<EmojiGuessesProps> = ({
  guesses,
  gameOver,
}) => {
  const results_header = `Path to Nowhere Wordle #${getDailyGameNumber()}`
  const tries_grammar = `${guesses.length} ${guesses.length === 1 ? 'attempt' : 'attempts'}`;
  const results_subheader = `Sinner guessed in ${tries_grammar}.`

  const [copySuccess, setCopySuccess] = useState(false);
  const [copySuccessDiscord, setCopySuccessDiscord] = useState(false);
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

    copyToClipboard(textToCopy);
  }, [emojis, setCopySuccess]);

  const handleCopyDiscordClick = useCallback(() => {
    const textToCopy = [">>> " + results_header, results_subheader, ...emojis.map(row => '' + row.join(''))].join('\n');
    const website_link = 'https://ptndle.com';
    const formatted_text = textToCopy + `\n${website_link}`
    // add website link after everything as a last row

    copyToClipboard(formatted_text, "discord");

  }, [emojis, setCopySuccessDiscord]);

  function copyToClipboard(textToCopy: string, copyType: string = "clipboard") {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          if (copyType === 'discord') {
            setCopySuccessDiscord(true);
            setTimeout(() => setCopySuccessDiscord(false), 2000);
          } else {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
          }
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    } else {
      console.warn('Clipboard API not supported in this context.');
      alert('Copying is not supported in this browser or environment. Please use HTTPS.');
    }
  }

  const renderEmojis = () => (
    <div ref={copyRef}>
      {emojis.map((guess, index) => (
        <div key={index} className="flex flex-row justify-center">
          {guess.map((emoji, innerIndex) => (
            <div key={innerIndex} className="text-4xl">{emoji}</div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-4">
      {gameOver && (
        <div className="text-center">
          <h2 className="text-xl font-bold">{results_header}</h2>
          <p className="text-lg">{results_subheader}</p>
        </div>
      )}
      {renderEmojis()}
      {gameOver && (
        <>
          <button
            onClick={handleCopyClick}
            className={`mt-4 mx-2 px-4 py-2 rounded border border-foreground-highlight ${copySuccess ? 'bg-green-500 text-white' : 'bg-foreground hover:bg-foreground-highlight text-white'}`}
            disabled={copySuccess}
          >
            {copySuccess ? 'Copied!' : 'Copy emojis'}
          </button>
          <button
            onClick={handleCopyDiscordClick}
            className={`mt-4 mx-2 px-4 py-2 rounded border border-foreground-highlight ${copySuccessDiscord ? 'bg-green-500 text-white' : 'bg-foreground hover:bg-foreground-highlight text-white'}`}
            disabled={copySuccessDiscord}
          >
            {copySuccessDiscord ? 'Copied!' : 'Copy to discord'}
          </button>
        </>
      )}
    </div>
  );
};

export default EmojiGuesses;