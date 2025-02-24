// components/InstructionModal.tsx
import React, { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { IoHelpCircleOutline } from 'react-icons/io5';

interface InstructionModalProps {
  className?: string;
}

const InstructionModal: React.FC<InstructionModalProps> = ({ className = 'w-6 h-6 inline' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <a
        onClick={() => setIsModalOpen(true)}
      >
        <IoHelpCircleOutline className={className} aria-hidden="true" />
      </a>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Path to Nowordle Instruction Manual™"
      >
        <div className="text-justify text-gray-200">
          <p>1. Your objective is to find the daily Sinner. Choose a Sinner from the list for the game to start.</p>
          <p>2. Information for the Sinner will appear in each row. Use them to narrow down what the daily Sinner's correct information is.</p>
          <p>3. Choose wisely, as you only get 6 guesses per day!</p>
          <br />
          <p>
            <small>You may click on the Image header to change the order of the table from the default where guesses appear below each other, to a Genshindle-default where the most recent guess appears on top.</small>
          </p>

          <br />

            <details>
            <summary>🟨 Yellow Guesses (click to expand)</summary>
            <p>
              A Yellow Guess, also indicated by an approximately equal ≅ symbol, means that a Sinner's information is within a certain range of the daily Sinner's information. This can mean that their heights are similar, or their MBCC Code is close. Do note that the ranges are bigger for Code!
            </p>
            {/* <br />
            <p>
              For example, Bianca's height is 166 centimeters. If our Daily Sinner was Eleven, you would get a yellow square as their height is close.
            </p> */}
            </details>

            <br />

            <details>
            <summary>Arrows (click to expand)</summary>
            <p>
              A single arrow (↑) means that your guess is considerably distant from the actual Sinner's information. Double (↑↑) arrows means that you are very, very far from the actual value. An arrow pointing up (↑) means that the daily Sinner's value is higher, while one pointing down (↓) means that it is lower. Do note that the ranges are a lot bigger for Code!
            </p>
            </details>
        </div>
      </Modal>
    </>
  );
};

export default InstructionModal;