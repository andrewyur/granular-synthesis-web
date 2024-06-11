import React, { useState, useRef } from "react";

export function useError() {
	const errorModalRef = useRef();
	const [errorMessage, setErrorMessage] = useState("There was a problem!");
	return [
		() => (
			<dialog ref={errorModalRef}>
				<p>{errorMessage}</p>
				<button onClick={() => errorModalRef.current.close()}>Ok</button>
			</dialog>
		),
		(message) => {
			setErrorMessage(message);
			errorModalRef.current.showModal();
		},
	];
}
