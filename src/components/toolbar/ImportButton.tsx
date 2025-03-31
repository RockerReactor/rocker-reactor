import { useContext } from "react";
import AppContext from "../../context/AppContext";
import "../../App.css";

const ImportButton = () => {

    const {loadMovementSequence} = useContext(AppContext);

    return (
        <button type="button" id="import" className="tbbutton" onClick={loadMovementSequence}>
            ⬆️
        </button>
    );
};

export default ImportButton;
