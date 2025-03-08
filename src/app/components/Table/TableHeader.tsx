// src/components/TableHeader.tsx
import React, { useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Import sort icons
import "./TableHeader.css";

interface TableHeaderProps {
	attributeKeys: string[];
	reversed: boolean;
	onReverseChange: (newReverse: boolean) => void; // Callback function
}

const TableHeader: React.FC<TableHeaderProps> = ({ attributeKeys, onReverseChange, reversed }) => {
	const [reverse, setReverse] = useState(reversed);

	const handleImageSortClick = () => {
		const newReverse = !reverse;
		setReverse(newReverse);
		onReverseChange(newReverse);
	};

	return (
		<div className="inline-flex flex-row lg:mt-4 rounded-md p-2 text-white border border-[theme(colors.s1n-border)] bg-s1n-gradient">
			<div className="header-tile relative">
				<span className="cursor-pointer" onClick={handleImageSortClick}>
					Image
				</span>
				<span
					className="absolute right-1 top-0 sm:top-1/2 -translate-y-1/2 cursor-pointer"
					onClick={handleImageSortClick}
				>
					{reverse === null ? <FaSort /> : reverse ? <FaSortUp /> : <FaSortDown />}
				</span>
			</div>
			<div className="header-tile wide">Name</div>
			{attributeKeys.map((key) => (
				<div key={key} className="header-tile">
					{key}
				</div>
			))}
		</div>
	);
};

export default TableHeader;
