import React, { createContext, useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const WasmContext = createContext(null);

export const WasmProvider = ({ children }) => {
	const [wasm, setWasm] = useState(null);

	useEffect(() => {
		import("../pkg/index.js").then(setWasm).catch(console.error);
	}, []);

	return <WasmContext.Provider value={wasm}>{children}</WasmContext.Provider>;
};

export const useWasm = () => {
	return useContext(WasmContext);
};

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
	return (
		<AudioContext.Provider value={new window.AudioContext()}>
			{children}
		</AudioContext.Provider>
	);
};

export const useAudio = () => {
	return useContext(AudioContext);
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<WasmProvider>
		<AudioProvider>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</AudioProvider>
	</WasmProvider>
);
