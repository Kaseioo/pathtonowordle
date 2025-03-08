// components/Modal.tsx
import React, { useEffect, ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';

import '@components/Modal/Modal.css';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen) {
		return null;
	}


	return (
		<div className="modalOverlay" onClick={handleOverlayClick}>
			<div className="modalContent">
				<div className="modalHeader">
					<h2 className="modalTitle">{title}</h2>
					<button
						type="button"
						onClick={onClose}
						className="closeButton"
						aria-label="Close"
					>
						<IoClose className=" w-8 h-8" />
					</button>
				</div>
				<div className="modalBody">
					{children}
				</div>
			</div>
		</div>
	);
};

export default Modal;