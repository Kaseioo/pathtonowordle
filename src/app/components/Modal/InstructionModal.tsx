// components/InstructionModal.tsx
import React, { useState } from "react";
import Modal from "@components/Modal/Modal";
import { IoHelpCircleOutline } from "react-icons/io5";

interface InstructionModalProps {
	className?: string;
}

const InstructionModal: React.FC<InstructionModalProps> = ({ className = "w-6 h-6 inline" }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const display_text = {
		explanation_first: "1. Your objective is to find the daily Sinner. Choose a Sinner from the list for the game to start.",
		explanation_second:
			"2. Information for the Sinner will appear in each row. Use them to narrow down what the daily Sinner's correct information is.",
		explanation_third: "3. Choose wisely, as you only get 6 guesses per day!",
		explanation_row_direction:
			"You may click on the Image header to change the order of the table from the default where guesses appear below each other, to a Genshindle-default where the most recent guess appears on top.",
		explanation_yellow:
			"A Yellow Guess, also indicated by an approximately equal ≅ symbol, means that a Sinner's information is within a certain range of the daily Sinner's information. This can mean that their heights are similar, or their MBCC Code is close. Do note that the ranges are bigger for Code!",
		explanation_arrows:
			"A single arrow (↑) means that your guess is considerably distant from the actual Sinner's information. Double (↑↑) arrows means that you are very, very far from the actual value. An arrow pointing up (↑) means that the daily Sinner's value is higher, while one pointing down (↓) means that it is lower. Do note that the ranges are a lot bigger for Code!",
	};

	return (
		<>
			<a onClick={() => setIsModalOpen(true)} className="hover:text-white transition-colors duration-200 cursor-pointer">
				<IoHelpCircleOutline className={className} aria-hidden="true" />
			</a>

			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Path to Nowordle Instruction Manual™">
				<div className="text-justify text-gray-200">
					<p>{display_text.explanation_first}</p>
					<p>{display_text.explanation_second}</p>
					<p>{display_text.explanation_third}</p>
					<br />
					<p>
						<small>{display_text.explanation_row_direction}</small>
					</p>

					<br />

					<details>
						<summary>🟨 Yellow Guesses (click to expand)</summary>
						<p>{display_text.explanation_yellow}</p>
					</details>
					<br />
					<details>
						<summary>Arrows (click to expand)</summary>
						<p>{display_text.explanation_arrows}</p>
					</details>
				</div>
			</Modal>
		</>
	);
};

export default InstructionModal;
