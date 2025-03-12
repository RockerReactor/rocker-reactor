import { useContext } from "react";
import AppContext from "../../context/AppContext";
import "../../App.css";

const ImportButton = () => {

    const {loadMovementSequence} = useContext(AppContext);

    const handleImport = () => {
        console.log("Import functionality to be implemented later.");
    };

    return (
        <button type="button" id="import" className="tbbutton" onClick={loadMovementSequence}>
            ⬆️
        </button>
    );
};

export default ImportButton;
