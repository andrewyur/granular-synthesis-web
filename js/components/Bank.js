import React, { useRef, useState } from "react";
import "./Bank.css";
import { useWasm, useAudio } from "..";
import { useError } from "./Error";

function Target() {
	let dragoverHandler = (event) => {
		if (event.dataTransfer.types.includes("source/name")) {
			event.dataTransfer.effectAllowed = "link";
			event.preventDefault();
		}
	};
	let dropHandler = (event) => {
		// add drop type, and let the event bubble up to bank container
		if (event.dataTransfer.types.includes("source/name")) {
			event.dropType = "new";
		}
	};

	return (
		<div id="create-bank" onDragOver={dragoverHandler} onDrop={dropHandler}>
			drag & drop a source here to make a new bank
		</div>
	);
}

function BankItem(props) {
	return (
		<div className="bank" key={props.bank.bankId}>
			<h3>{`Bank ${props.bank.bankId}`}</h3>
			<p>{`Contains: ${
				props.bank.loading
					? "Loading..."
					: props.bank.sourceNames.map((s, i) => (i == 0 ? s : `, ${s}`))
			}`}</p>
		</div>
	);
}

export default function BankContainer(props) {
	let modalRef = useRef();
	let [Error, showError] = useError();
	let [banks, setBanks] = useState([]);
	let [current, setCurrent] = useState();

	const wasm = useWasm();
	const context = useAudio();

	let loadBank = (bank) => {
		setBanks(
			banks.map((b) => {
				return b.bankId == current
					? { bank, bankId: current, sourceNames: b.sourceNames }
					: b;
			})
		);
		setCurrent(null);
	};

	let removeBank = () => {
		setBanks(banks.filter((b) => b != b.bankId));
		setCurrent(null);
	};

	let addBank = (dropType, name) => {
		setCurrent(banks.length);
		setBanks([
			...banks,
			{ bankId: banks.length, dropType, sourceNames: [name], loading: true },
		]);
	};

	let handleDrop = (event) => {
		event.preventDefault();
		if (!event.dataTransfer.types.includes("source/name")) {
			return;
		}
		addBank(event.dropType, event.dataTransfer.getData("source/name"));
		modalRef.current.showModal();
	};

	let handleFormSubmit = async (event) => {
		modalRef.current.close();
		event.preventDefault();
		let formData = new FormData(event.target);
		let grainSize = formData.get("grain");

		if (parseInt(grainSize) < 1) {
			showError("Grain size must be greater than 0");
			removeBank();
			return;
		}

		let currentElement = banks[current];

		if (currentElement.dropType == "new") {
			let source = props.sources.filter((s) => {
				return s.name == currentElement.sourceNames[0];
			})[0];
			if (!source || !source.buf) {
				showError("cannot find source!");
				removeBank();
				return;
			}
			if (wasm) {
				console.log("buf", source, source.buf);
				let bank = await wasm.Bank.new(source.buf, 100, context);
				loadBank(bank);
			} else {
				showError("wasm not loaded! try again");
				removeBank();
			}
		}
	};

	return (
		<div id="bank" onDrop={handleDrop}>
			<h2>Banks:</h2>
			<div id="banks-container">
				{banks.map((bank, i) => {
					return <BankItem key={i} bank={bank} />;
				})}
			</div>
			<Target />
			<dialog ref={modalRef}>
				<form onSubmit={handleFormSubmit}>
					<label>
						Grain size in ms: <output id="value">50</output>
						<input
							name="grain"
							type="range"
							min="1"
							max="500"
							onChange={(event) => {
								document.getElementById("value").textContent =
									event.target.value;
							}}
						/>
					</label>
					<button type="submit">Create</button>
					<button onClick={() => modalRef.current.close()}>Cancel</button>
				</form>
			</dialog>
			<Error />
		</div>
	);
}
