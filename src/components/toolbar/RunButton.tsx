import { useContext, useState, useEffect } from "react";
import AppContext from "../../context/AppContext";

const RunButton = () => {
    const [isRunning, setIsRunning] = useState(false);
    const { connected, addLog, movementSequence, sendCommand, mapAngleToAnalog } = useContext(AppContext);

    useEffect(() => {
        let isActive = true; // Flag to keep track of the loop state

        const startMovementLoop = async () => {
            if (!connected || movementSequence.length === 0) {
                addLog(`isRunning is ${isRunning}`)
                addLog("No movement actions found or not connected. Exiting StartMovementLoop.");
                setIsRunning(false);
                return;
            }

            addLog("Starting movement sequence...");
            addLog(`Total movements: ${movementSequence.length}`);

            while (isRunning && isActive) {
                for (const action of movementSequence) {
                    if (!isRunning || !isActive) return; // Stop immediately if flag changes
                    
                    addLog(`Processing movement: ${action.angle}° for ${action.time}s`);
                    
                    const desiredPosition = mapAngleToAnalog(action.angle);
                    addLog("Trying to send movement command");
                    await sendCommand(`g${desiredPosition}`);
                    addLog(`Moved to Angle: ${action.angle}°`);

                    await new Promise(resolve => setTimeout(resolve, action.time * 1000));
                }
            }
        };

        if (isRunning) {
            startMovementLoop();
        }

        return () => {
            isActive = false; // Cleanup function to prevent unwanted execution after state change
        };
    }, [isRunning, connected, movementSequence, sendCommand, mapAngleToAnalog]);

    const toggleRun = () => {
        if (isRunning) {
            setIsRunning(false);
            addLog("Stopping movement sequence...");
            sendCommand(`g${mapAngleToAnalog(0)}`);
        } else {
            setIsRunning(true);
        }
    };

    return (
        <button
            type="button"
            id="run"
            className={`tbbutton ${isRunning ? "running" : ""}`}
            onClick={toggleRun}
        >
            {isRunning ? "⏹️" : "▶️"}
        </button>
    );
};

export default RunButton;
