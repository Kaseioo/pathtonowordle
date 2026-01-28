// src/components/HeaderMenu.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import InstructionModal from './Modal/InstructionModal';

interface HeaderMenuProps {
	appVersion: string;
	is_endless_mode_on: boolean;
	onToggleEndlessMode: () => void;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ appVersion, is_endless_mode_on, onToggleEndlessMode }) => {
	const endless_on = "/images/ptn_infinity_bloodred.svg";
	const endless_off = "/images/ptn_infinity.svg";
	const [endless_image, setEndlessImage] = useState(is_endless_mode_on ? endless_on : endless_off);

	useEffect(() => {
		setEndlessImage(is_endless_mode_on ? endless_on : endless_off);
	}, [is_endless_mode_on]);

	return (
		<div className="mb-8 top-0 left-0 w-full h-12 bg-gradient-to-r from-gray-500/10 to-black text-white flex items-center justify-between px-4">
			<div>
				<span className="text-gray-400">PtNdle {appVersion}</span>
				<span className="text-gray-400 relative -top-0.5">
					<InstructionModal
						className="mx-2 w-6 h-6 inline"
					/>
				</span>
				<span>
				<button
					onClick={onToggleEndlessMode}
					className="mx-2 relative -top-0.5"
				>
					<Image
						src={endless_image}
						alt="Endless Mode"
						width={48} 
						height={48}
						className="inline"
					/>
					
				</button>
				</span>
			</div>
			<div>

				<a
					href="https://discord.gg/rKtEyvKRrq"
					target="_blank"
					rel="noopener noreferrer"
					className="mx-2"
				>
					<Image
						src="/images/discord-white-icon.svg"
						alt="Join the Discord... if you'd like..."
						width={32} 
						height={32}
						className="inline"
					/>
					
				</a>
				<a
					href="https://github.com/Kaseioo/pathtonowordle"
					target="_blank"
					rel="noopener noreferrer"
					className="mx-2"
				>
					<Image
						src="/images/github-mark-white.svg"
						alt="GitHub"
						width={32} 
						height={32}
						className="inline"
					/>
					
				</a>
				<a
					href="https://ko-fi.com/pathtoluna"
					target="_blank"
					rel="noopener noreferrer"
					className="mx-2"
				>
					<Image
						src="/images/kofi_logo.svg"
						alt="Support Luna on Ko-fi!"
						width={64} 
						height={32}
						className="inline"
					/>
				</a>
				<a
					href="https://x.com/PathtoLuna"
					target="_blank"
					rel="noopener noreferrer"
					className="mx-2"
				>
					<Image
						src="/images/x_logo.svg"
						alt="Support Luna on Twitter!"
						width={32} 
						height={32}
						className="inline"
					/>
					
				</a>
			</div>
		</div>
	);
};

export default HeaderMenu;
