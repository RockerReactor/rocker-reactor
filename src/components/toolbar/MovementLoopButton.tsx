import { useContext, useState, useRef, useEffect } from "react";
import AppContext from "../../context/AppContext";
import "../../App.css";

const InfiniteRunButton = () => {
    const [isRunning, setIsRunning] = useState(false);
    const isRunningRef = useRef(isRunning); // Ref to track running state in async loop
    const {
        connected,
        addLog,
        movementSequence,
        sendCommand,
        mapAngleToAnalog,
        waitForMessage,
    } = useContext(AppContext);

    // Keep the ref in sync with state
    useEffect(() => {
        isRunningRef.current = isRunning;
    }, [isRunning]);

    useEffect(() => {
        const runLoop = async () => {
            if (!connected || movementSequence.length === 0) {
                addLog("Not connected or movement sequence is empty.");
                setIsRunning(false);
                return;
            }

            addLog(`Starting infinite loop. Total movements: ${movementSequence.length}`);

            while (isRunningRef.current) {
                for (const action of movementSequence) {
                    if (!isRunningRef.current) {
                        addLog("Stopping loop...");
                        return;
                    }

                    addLog(`Processing movement: ${action.angle}° for ${action.time}s`);
                    const position = mapAngleToAnalog(action.angle);
                    await sendCommand(`g${position}`);
                    await waitForMessage("Movement Complete");
                    addLog(`Moved to angle: ${action.angle}°`);

                    await new Promise(resolve => setTimeout(resolve, action.time * 1000));
                }
            }

            // Final cleanup
            sendCommand(`g${mapAngleToAnalog(90)}`);
            addLog("Exited movement loop.");
        };

        if (isRunning) {
            runLoop();
        } else {
            // Ensure a final stop command is sent
            sendCommand(`g${mapAngleToAnalog(90)}`);
        }
    }, [isRunning]); // Trigger the effect only when isRunning changes

    const toggleRun = () => {
        if (isRunning) {
            setIsRunning(false);
        } else {
            setIsRunning(true);
        }
    };

    return (
        <button
            type="button"
            className={`tbbutton ${isRunning ? "running" : ""}`}
            onClick={toggleRun}
        >
            {isRunning ? "⏹️" : "🔁"}
        </button>
    );
};

export default InfiniteRunButton;
