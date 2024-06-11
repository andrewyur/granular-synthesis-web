import React, { useEffect, useRef } from "react";
import "./Source.css";
import { useError } from "./Error";

function CreateButton(props) {
	const modalRef = useRef();
	const [Error, showError] = useError();

	const handleFormSubmit = async (event) => {
		modalRef.current.close();

		event.preventDefault();

		const formData = new FormData(event.target);

		const link = formData.get("link");
		const fileList = formData.get("file");

		if (link) {
			const source = await fetch(link);

			if (!source.ok) {
				showError("File could not be fetched!");
			}

			const arrayBuffer = await source.arrayBuffer();
			props.addSource(arrayBuffer, link);
		}
		if (fileList) {
			for (const file of fileList) {
				const reader = new FileReader();
				reader.onload = (event) => {
					const arrayBuffer = event.target.result;
					props.addSource(arrayBuffer, file.name);
				};
				reader.onerror = () => {
					showError("File could not be read!");
				};
				reader.readAsArrayBuffer(file);
			}
		}
	};

	return (
		<>
			<button id="create-source" onClick={() => modalRef.current.showModal()}>
				Add a source
			</button>
			<dialog ref={modalRef}>
				<form onSubmit={handleFormSubmit}>
					<label>
						Upload a file:
						<input type="file" name="file" accept=".mp3,.wav" multiple />
					</label>
					<p>Or</p>
					<label>
						Provide a link to a file:
						<input type="url" name="link" />
					</label>
					<div>
						<button type="submit">Ok</button>
						<button onClick={() => modalRef.current.close()}>Cancel</button>
					</div>
				</form>
			</dialog>
			<Error />
		</>
	);
}

function SourceItem(props) {
	const dragstartHandler = (event) => {
		event.dataTransfer.setData("source/name", props.name);
		document.getElementById("create-bank").classList.add("dropZone");
	};

	const dragendHandler = () => {
		document.getElementById("create-bank").classList.remove("dropZone");
	};

	return (
		<div
			className="source"
			draggable="true"
			onDragStart={dragstartHandler}
			onDragEnd={dragendHandler}
		>
			<p>{props.name}</p>
		</div>
	);
}

export default function SourceContainer(props) {
	const givenSources = [
		"https://cdn.freesound.org/previews/31/31446_199517-lq.mp3",
	];

	const addSource = (arrayBuffer, name) => {
		props.setSources([...props.sources, { buf: arrayBuffer, name }]);
	};

	// This useEffect has to stay here because state updates must happen after render
	useEffect(() => {
		givenSources.forEach(async (link) => {
			const source = await (await fetch(link)).arrayBuffer();
			addSource(source, link);
		});
	}, []);

	return (
		<div id="source">
			<h2>Sources:</h2>
			<div id="source-list">
				{props.sources.map((source_obj, i) => (
					<SourceItem
						arrayBuffer={source_obj.source}
						name={source_obj.name}
						key={i}
					/>
				))}
			</div>
			<CreateButton addSource={addSource} />
		</div>
	);
}
