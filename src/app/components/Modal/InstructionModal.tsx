// components/InstructionModal.tsx
import React, { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { IoHelpCircleOutline } from 'react-icons/io5';

interface InstructionModalProps {
  className?: string;
}

const InstructionModal: React.FC<InstructionModalProps> = ({ className = 'w-6 h-6 inline'}) => {
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
        <div>
          <p>1. Use the arrow keys to move.</p>
          <p>2. Collect items to score points.</p>
          <p>3. Avoid obstacles.</p>
        </div>
      </Modal>
    </>
  );
};

export default InstructionModal;