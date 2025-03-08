// src/components/Tile/useFlipAnimation.js
import { useState, useEffect } from "react";

const useFlipAnimation = (status, delay) => {
	const [animationState, setAnimationState] = useState("idle");

	useEffect(() => {
		if (status !== "empty") {
			const timer = setTimeout(() => {
				setAnimationState("flipping");
			}, delay);

			return () => clearTimeout(timer);
		}
	}, [status, delay]);

	useEffect(() => {
		if (animationState === "flipping") {
			const timer = setTimeout(() => {
				setAnimationState("flipped");
				setTimeout(() => {
					setAnimationState("finished");
				}, 250);
			}, 250);
			return () => clearTimeout(timer);
		}
	}, [animationState]);

	let animationClass = "";
	switch (animationState) {
		case "flipping":
			animationClass = "flipping";
			break;
		case "flipped":
			animationClass = "flipped";
			break;
		case "finished":
			animationClass = "finished";
			break;
		default:
			animationClass = "";
	}

	return animationClass;
};

export default useFlipAnimation;
