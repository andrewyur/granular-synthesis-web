import React, { useEffect, useRef, useState } from "react";
import "./Bank.css";

function Target(props) {
	let targetRef = useRef();

	let dragoverHandler = (event) => {
		if (event.dataTransfer.types.includes("sourcename")) {
			event.dataTransfer.effectAllowed = "link";
			event.preventDefault();
		}
	};
	let dropHandler = (event) => {
		if (event.dataTransfer.types.includes("sourcename")) {
			event.dropType = "new";
		}
	};

	useEffect(() => {
		targetRef.current.addEventListener("dragover", dragoverHandler);
		targetRef.current.addEventListener("drop", dropHandler);

		return () => {
			targetRef.current.removeEventListener("dragover", dragoverHandler);
			targetRef.current.removeEventListener("drop", dropHandler);
		};
	});
	return (
		<div id="bank-drop" ref={targetRef} className="dropTarget">
			drop a source here to make a new bank
		</div>
	);
}

export default function Bank(props) {
	let bankRef = useRef();
	let [banks, setBanks] = useState([]);

	let dropHandler = (event) => {
		let name = event.dataTransfer.getData("sourcename");
		let data = props.sources.filter((s) => s.name == name)[0];

		console.log(data);
		console.log(event.dropType);

		event.preventDefault();

		//trigger popover, all the other stuff
	};

	useEffect(() => {
		bankRef.current.addEventListener("drop", dropHandler);

		return () => {
			bankRef.current.removeEventListener("drop", dropHandler);
		};
	});

	return (
		<div id="bank" ref={bankRef}>
			<h2>Banks:</h2>
			<div id="banks-container">{banks}</div>
			<Target />
		</div>
	);
}
