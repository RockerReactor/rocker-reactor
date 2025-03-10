import { useContext } from "react";
import AppContext from "../../context/AppContext";

const RunButton = () => {
    const { isRunning, setIsRunning } = useContext(AppContext);

    const toggleRun = () => {
        setIsRunning((prev: any) => !prev);
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
