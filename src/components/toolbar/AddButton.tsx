import { useContext } from "react";
import AppContext from "../../context/AppContext";

const AddButton = () => {
    const { movementSequence, setMovementSequence, addLog } = useContext(AppContext);

    const handleAdd = () => {
        const newId = (movementSequence.length + 1).toString();
        setMovementSequence([...movementSequence, { id: newId, label: `Rotation ${newId}` }]);
        addLog(`Added new instruction: Rotation ${newId}`);
    };

    return (
        <button type="button" id="add" className="tbbutton" onClick={handleAdd}>
            ➕
        </button>
    );
};

export default AddButton;
