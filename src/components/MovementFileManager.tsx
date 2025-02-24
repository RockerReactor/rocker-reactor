import { useContext } from "react";
import AppContext from "../context/AppContext";

const MovementFileManager = () => {
    const { movementSequence, setMovementSequence, addLog } = useContext(AppContext);

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
