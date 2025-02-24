// src/components/HeaderMenu.tsx (or .jsx)
import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import InstructionModal from './Modal/InstructionModal';

interface HeaderMenuProps {
	appVersion: string;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ appVersion }) => {
	return (
		<div className="mb-8 top-0 left-0 w-full h-12 bg-gradient-to-r from-gray-500/10 to-black text-white flex items-center justify-between px-4">
			<div>
				<span className="text-gray-400">PtNdle {appVersion}</span>
				<span className="text-gray-400 relative -top-0.5">
					<InstructionModal
						className="mx-2 w-6 h-6 inline"
					/>
				</span>
			</div>
			<div>
				{/* <a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					className="mx-2"
				>
					<Image
						src="/images/github-mark-white.svg"
						alt="GitHub"
						width={16} 
						height={16}
						className="h-4 w-4 inline"
					/>
					
				</a> */}
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