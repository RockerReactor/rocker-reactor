import { useContext, useState, useRef, useEffect } from 'react'
import AppContext from '../context/AppContext'
import '../App.css'

const Control = () => {
    const { movementSequence, setMovementSequence, addLog } =
        useContext(AppContext)

    const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>(
        {}
    )
    const instructionSetRef = useRef<HTMLDivElement | null>(null)

    // Function to update the height of instruction set dynamically
    const updateInstructionSetHeight = () => {
        if (instructionSetRef.current) {
            const controlHeight =
                document.querySelector('.column.control')?.clientHeight || 0
            const toolbarHeight =
                document.querySelector('.toolbar')?.clientHeight || 0
            const setupParboxHeight =
                document.querySelector('.setupParbox')?.clientHeight || 0
            const remainingHeight =
                controlHeight - toolbarHeight - 2 * setupParboxHeight

            instructionSetRef.current.style.height = `${remainingHeight}px`
        }
    }

    useEffect(() => {
        updateInstructionSetHeight() // Set height initially
        window.addEventListener('resize', updateInstructionSetHeight) // Recalculate on resize

        return () => {
            window.removeEventListener('resize', updateInstructionSetHeight) // Cleanup
        }
    }, [])

    const handleInputChange = (
        index: number,
        field: 'angle' | 'time',
        value: string
    ) => {
        const isValid = value === '' || !isNaN(Number(value))

        // Update error state
        setInputErrors((prevErrors) => ({
            ...prevErrors,
            [`rotation-${index}-${field}`]: !isValid,
        }))

        // Only update movementSequence if the input is valid
        if (isValid) {
            const updatedSequence = [...movementSequence]
            updatedSequence[index] = {
                ...updatedSequence[index],
                [field]: value, // Update angle or time
            }
            setMovementSequence(updatedSequence)
        }
    }

    const moveInstruction = (index: number, direction: number) => {
        const newIndex = index + direction
        if (newIndex < 0 || newIndex >= movementSequence.length) return

        const updatedSequence = [...movementSequence]
        const [movedItem] = updatedSequence.splice(index, 1)
        updatedSequence.splice(newIndex, 0, movedItem)

        setMovementSequence(updatedSequence)
        //addLog(`Moved instruction from position ${index + 1} to ${newIndex + 1}`);
    }

    const handleAdd = () => {
        setMovementSequence([...movementSequence, {}])
        //addLog(`Added new instruction at position ${movementSequence.length + 1}`);
    }

    const handleRemove = (index: number) => {
        setMovementSequence(
            movementSequence.filter((_: any, i: number) => i !== index)
        )
        //addLog(`Removed instruction at position ${index + 1}`);
    }

    return (
        <div>
            {/*Instruction Set UI*/}
            <div ref={instructionSetRef} className="instructionset">
                {movementSequence.map((instruction: any, index: number) => (
                    <div className="instruction" key={index}>
                        <label>{`Rotation ${index + 1}`}</label>
                        <label className="parText parIn">∠</label>
                        <input
                            className={`parIn ${inputErrors[`rotation-${index}-angle`] ? 'invalid' : ''}`}
                            type="text"
                            value={instruction.angle || ''}
                            onChange={(e) =>
                                handleInputChange(
                                    index,
                                    'angle',
                                    e.target.value
                                )
                            }
                        />
                        <label className="parText parIn">T</label>
                        <input
                            className={`parIn ${inputErrors[`rotation-${index}-time`] ? 'invalid' : ''}`}
                            type="text"
                            value={instruction.time || ''}
                            onChange={(e) =>
                                handleInputChange(index, 'time', e.target.value)
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
                            <button
                                className="remove-button"
                                onClick={() => handleRemove(index)}
                            >
                                −
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Control
