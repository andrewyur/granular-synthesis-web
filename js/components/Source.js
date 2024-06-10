import React, { useEffect, useRef, useState } from "react";
import "./Source.css";

function SourceItem(props) {
	let sourceItemRef = useRef();

	let dragstartHandler = (event) => {
		event.dataTransfer.setData("sourcename", props.name);
		document.getElementById("bank-drop").classList.add("dropZone");
	};

	let dragendHandler = (event) => {
		document.querySelectorAll(".dropZone").forEach((element) => {
			element.classList.remove("dropZone");
		});
	};

	useEffect(() => {
		sourceItemRef.current.addEventListener("dragstart", dragstartHandler);
		sourceItemRef.current.addEventListener("dragend", dragendHandler);
		return () => {
			sourceItemRef.current.removeEventListener("dragend", dragendHandler);
			sourceItemRef.current.removeEventListener("dragstart", dragstartHandler);
		};
	});

	return (
		<div className="source" draggable="true" ref={sourceItemRef}>
			<p>{props.name}</p>
		</div>
	);
}

function CreateButton(props) {
	let modalRef = useRef();
	let errorModalRef = useRef();
	let [errorMessage, setErrorMessage] = useState("There was a problem!");
	let fileRef = useRef();
	let linkRef = useRef();
	let nameRef = useRef();
	let [name, setName] = useState("source");
	let [input, setInput] = useState(null);

	let addSource = (arrayBuffer) => {
		props.setSources([...props.sources, { buf: arrayBuffer, name }]);
	};

	let handleFileChange = (event) => setInput(event.target.files);
	let handleNameChange = (event) => setName(event.target.value);
	let handleLinkChange = (event) => setInput(event.target.value);

	let processInput = async () => {
		if (typeof input == "string") {
			let source = await fetch(input);

			if (!source.ok) {
				setErrorMessage("File could not be fetched!");
				errorModalRef.current.showModal();
			} else {
				const arrayBuffer = await source.arrayBuffer();
				addSource(arrayBuffer);
			}
		} else if (input instanceof FileList) {
			for (let file of input) {
				const reader = new FileReader();
				reader.onload = (event) => {
					const arrayBuffer = event.target.result;
					addSource(arrayBuffer);
				};
				reader.onerror = () => {
					setErrorMessage("File could not be read!");
					errorModalRef.current.showModal();
				};
				reader.readAsArrayBuffer(file);
			}
		}
		setInput(null);
		fileRef.current.value = "";
		linkRef.current.value = "";
		nameRef.current.value = "";
	};

	useEffect(() => {
		fileRef.current.addEventListener("change", handleFileChange);
		linkRef.current.addEventListener("change", handleLinkChange);
		nameRef.current.addEventListener("change", handleNameChange);
		return () => {
			fileRef.current.removeEventListener("change", handleFileChange);
			nameRef.current.removeEventListener("change", handleNameChange);
			linkRef.current.removeEventListener("change", handleLinkChange);
		};
	});

	return (
		<>
			<button
				onClick={() => {
					modalRef.current.showModal();
					setInput(null);
				}}
			>
				create
			</button>
			<dialog ref={modalRef}>
				<label>
					Upload a file:
					<input
						type="file"
						ref={fileRef}
						style={{ display: "block", margin: "5px" }}
						accept=".mp3,.wav"
						multiple
					/>
				</label>
				<p>Or</p>
				<label>
					Provide a link to a file:
					<input
						type="text"
						style={{ display: "block", margin: "5px" }}
						ref={linkRef}
					/>
				</label>
				<label>
					Display name for the source:
					<input
						type="text"
						style={{ display: "block", margin: "5px" }}
						ref={nameRef}
					/>
				</label>
				<div>
					<button
						onClick={() => {
							modalRef.current.close();
							processInput();
						}}
					>
						Ok
					</button>
					<button onClick={() => modalRef.current.close()}>Cancel</button>
				</div>
			</dialog>
			<dialog ref={errorModalRef}>
				<p>{errorMessage}</p>
				<button onClick={() => errorModalRef.current.close()}>Ok</button>
			</dialog>
		</>
	);
}

export default function Source(props) {
	let sources = props.sources;
	let setSources = props.setSources;

	let givenSources = [
		["airport", "https://cdn.freesound.org/previews/31/31446_199517-lq.mp3"],
		["airport2", "https://cdn.freesound.org/previews/31/31446_199517-lq.mp3"],
		["airport3", "https://cdn.freesound.org/previews/31/31446_199517-lq.mp3"],
		["airport4", "https://cdn.freesound.org/previews/31/31446_199517-lq.mp3"],
	];

	let createSources = async (tup) => {
		let [name, link] = tup;

		let source = await (await fetch(link)).arrayBuffer();

		return { buf: source, name };
	};

	useEffect(() => {
		(async () => {
			let given = await Promise.all(givenSources.map(createSources));
			setSources([...sources, ...given]);
		})();
	}, []);

	return (
		<div id="source">
			<div className="title">
				<h2>Sources:</h2>
				<CreateButton setSources={setSources} sources={sources} />
			</div>
			<div id="source-list">
				{sources.map((source_obj) => (
					<SourceItem
						arrayBuffer={source_obj.source}
						name={source_obj.name}
						key={source_obj.name}
					/>
				))}
			</div>
		</div>
	);
}
