import { useContext, useState, useRef, useEffect } from "react";
import AppContext from "../context/AppContext";
import "../App.css";

const Control = () => {
    const {
        movementSequence,
        setMovementSequence,
        addLog
    } = useContext(AppContext);

    const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});
    const instructionSetRef = useRef<HTMLDivElement | null>(null);

    // Function to update the height of instruction set dynamically
    const updateInstructionSetHeight = () => {
        if (instructionSetRef.current) {
            const controlHeight = document.querySelector(".column.control")?.clientHeight || 0;
            const toolbarHeight = document.querySelector(".toolbar")?.clientHeight || 0;
            const setupParboxHeight = document.querySelector(".setupParbox")?.clientHeight || 0;
            const remainingHeight = controlHeight - toolbarHeight - (2 * setupParboxHeight);

            instructionSetRef.current.style.height = `${remainingHeight}px`;
        }
    };

    useEffect(() => {
        updateInstructionSetHeight(); // Set height initially
        window.addEventListener("resize", updateInstructionSetHeight); // Recalculate on resize

        return () => {
            window.removeEventListener("resize", updateInstructionSetHeight); // Cleanup
        };
    }, []);

    const handleInputChange = (id: string, value: string) => {
        const isValid = value === "" || !isNaN(Number(value));
        setInputErrors((prevErrors) => ({
            ...prevErrors,
            [id]: !isValid,
        }));
    };

    const moveInstruction = (index: number, direction: number) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= movementSequence.length) return;

        const updatedInstructions = [...movementSequence];
        const [movedItem] = updatedInstructions.splice(index, 1);
        updatedInstructions.splice(newIndex, 0, movedItem);

        setMovementSequence(updatedInstructions);
        addLog(`Moved instruction from index ${index} to ${newIndex}`);
    };

    const handleAdd = () => {
        const newId = (movementSequence.length + 1).toString();
        setMovementSequence([
            ...movementSequence,
            { id: newId, label: `Rotation ${newId}` },
        ]);
        console.log(`Added new instruction: Rotation ${newId}`);
    };

    const handleRemove = (id: string) => {
        setMovementSequence(movementSequence.filter((instruction: any) => instruction.id !== id));
        addLog(`Removed instruction: ${id}`);
    };

    return (
        <div>
            {/* Instruction Set UI */}
            <div ref={instructionSetRef} className="instructionset">
                {movementSequence.map((instruction: any, index: any) => (
                    <div className="instruction" key={instruction.id}>
                        <label>{instruction.label}</label>
                        <label className="parText parIn">∠</label>
                        <input
                            className={`parIn ${inputErrors[`rotation-${instruction.id}-angle`] ? "invalid" : ""}`}
                            type="text"
                            onChange={(e) =>
                                handleInputChange(`rotation-${instruction.id}-angle`, e.target.value)
                            }
                        />
                        <label className="parText parIn">T</label>
                        <input
                            className={`parIn ${inputErrors[`rotation-${instruction.id}-time`] ? "invalid" : ""}`}
                            type="text"
                            onChange={(e) =>
                                handleInputChange(`rotation-${instruction.id}-time`, e.target.value)
                            }
                        />
                        <div className="button-container">
                            <button
                                className="move-button"
                                onClick={() => moveInstruction(index, -1)}
                                disabled={index === 0}
                            >
                                ↑
                            </button>
                            <button
                                className="move-button"
                                onClick={() => moveInstruction(index, 1)}
                                disabled={index === movementSequence.length - 1}
                            >
                                ↓
                            </button>
                            <button className="remove-button" onClick={() => handleRemove(instruction.id)}>
                                −
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Control;
