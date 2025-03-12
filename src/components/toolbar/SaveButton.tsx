import { useContext } from "react";
import AppContext from "../../context/AppContext";
import "../../App.css";


const SaveButton = () => {

    const {saveMovementSequence} = useContext(AppContext);

    const handleSave = () => {
        console.log("Save functionality to be implemented later.");
    };

    return (
        <button type="button" id="save" className="tbbutton" onClick={saveMovementSequence}>
            💾
        </button>
    );
};

export default SaveButton;
