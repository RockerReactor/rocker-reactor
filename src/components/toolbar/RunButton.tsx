import { useContext } from "react";
import AppContext from "../../context/AppContext";


const RunButton = () => {
    const { isRunning, setIsRunning, startMovementLoop, stopMovementLoop } = useContext(AppContext);

    const toggleRun = async () => {
        if (isRunning) {
            setIsRunning(false);
            stopMovementLoop();
        } else {
            setIsRunning(true);
            startMovementLoop();
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
