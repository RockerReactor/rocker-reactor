import { useContext } from "react";
import AppContext from "../context/AppContext";

const MovementFileManager = () => {
	const { movementSequence, setMovementSequence, addLog } =
		useContext(AppContext);

	// Function to save the movement sequence to JSON file
	const saveMovementSequence = async () => {
		try {
			const fileHandle = await (window as any).showSaveFilePicker({
				suggestedName: "movement_sequence.json",
				types: [
					{
						description: "JSON Files",
						accept: { "application/json": [".json"] },
					},
				],
			});
			const writableStream = await fileHandle.createWritable();
			const sequenceData = JSON.stringify(movementSequence, null, 2);
			await writableStream.write(sequenceData);
			await writableStream.close();
			addLog("Movement sequence saved successfully.");

			//! Errors are very wide, and this block can return a variety of them.
			//! Needs to be some sort of type matching.
		} catch (error) {
			addLog(`Error saving movement sequence: ${error}`);
		}
	};

	// Function to load the movement sequence from JSON file
	const loadMovementSequence = async () => {
		try {
			const [fileHandle] = await (window as any).showOpenFilePicker({
				types: [
					{
						description: "JSON Files",
						accept: { "application/json": [".json"] },
					},
				],
			});
			const file = await fileHandle.getFile();
			const fileContent = await file.text();
			const loadedSequence = JSON.parse(fileContent);
			setMovementSequence(loadedSequence);
			addLog("Movement sequence loaded successfully.");
		} catch (error) {
			//! I think this could be very problematic
			//! This adds the error to the on-screen log, potentially opening
			//! the door for things like XSS attacks.
			addLog(`Error loading movement sequence: ${error}`);
		}
	};

	return (
		<div>
			<h2>Movement Sequence File Manager</h2>
			<button onClick={saveMovementSequence}>Save Sequence</button>
			<button onClick={loadMovementSequence}>Load Sequence</button>
		</div>
	);
};

export default MovementFileManager;
