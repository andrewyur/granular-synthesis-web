import("../pkg/index.js")
	.then(async (rust_module) => {
		let context = new window.AudioContext();
		let white_noise = rust_module.Sequence.create_white_noise(3, context);
		let wave = rust_module.Sequence.create_wave(3, context);
		let airport_source = await fetch(
			"https://cdn.freesound.org/previews/31/31446_199517-lq.mp3"
		);
		let airport = await rust_module.Sequence.create_from_sample(
			await airport_source.arrayBuffer(),
			context
		);

		const whiteNoiseButton = document.getElementById("white-noise");
		whiteNoiseButton.addEventListener("click", (event) => {
			white_noise.play(context);
		});
		const waveButton = document.getElementById("wave");
		waveButton.addEventListener("click", (event) => {
			wave.play(context);
		});
		const airportButton = document.getElementById("airport");
		airportButton.addEventListener("click", (event) => {
			airport.play(context);
		});
	})
	.catch(console.error);
