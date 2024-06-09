import("../pkg/index.js")
	.then(async (rust_module) => {
		let context = new window.AudioContext();

		let airport_source = await fetch(
			"https://cdn.freesound.org/previews/31/31446_199517-lq.mp3"
		);
		let airport_bank = await rust_module.Bank.new(
			await airport_source.arrayBuffer(),
			100,
			context
		);

		let airport_sequence = rust_module.Sequence.create_from_all(airport_bank);

		let airport_sound = airport_sequence.generate_sound(context);

		let airportButton = document.getElementById("airport");
		airportButton.addEventListener("click", () => {
			airport_sound.play(context);
		});
	})
	.catch(console.error);
