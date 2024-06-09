import React, { useEffect, useRef, useState } from "react";
import { useWasm } from ".";

export default function App() {
	const wasm = useWasm();
	const [loaded, setLoaded] = useState(false);

	let context = new window.AudioContext();

	let buttonRef = useRef();

	useEffect(() => {
		(async () => {
			if (wasm) {
				let { Sequence, Bank } = wasm;

				let airport_source = await fetch(
					"https://cdn.freesound.org/previews/31/31446_199517-lq.mp3"
				);
				if (!airport_source.ok) {
					throw new Error("Network response was not ok");
				}
				let airport_bank = await Bank.new(
					await airport_source.arrayBuffer(),
					100,
					context
				);
				let airport_sequence = Sequence.create_from_all(airport_bank);
				let airport_sound = airport_sequence.generate_sound(context);

				setLoaded(true);

				buttonRef.current.addEventListener("click", () => {
					airport_sound.play(context);
				});
			}
		})();
	}, [wasm]);

	return (
		<button id="airport" ref={buttonRef}>
			{loaded ? "airport" : "loading..."}
		</button>
	);
}
