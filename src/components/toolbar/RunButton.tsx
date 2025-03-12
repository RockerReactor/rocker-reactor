import { useContext } from "react";
import AppContext from "../../context/AppContext";


const RunButton = () => {
    const { isRunning, setIsRunning, startMovementLoop, stopMovementLoop } = useContext(AppContext);

    const toggleRun = async () => {
        if (isRunning) {
            await startMovementLoop();
        } else {
            await stopMovementLoop();
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
