import { useContext, useState, useEffect } from 'react'
import AppContext from '../../context/AppContext'

const RunButton = () => {
<<<<<<< HEAD
    const [isRunning, setIsRunning] = useState(false)
    const {
        connected,
        addLog,
        movementSequence,
        sendCommand,
        mapAngleToAnalog,
        cycles,
    } = useContext(AppContext)
=======
    const [isRunning, setIsRunning] = useState(false);
    const { connected, addLog, movementSequence, sendCommand, 
        mapAngleToAnalog, cycles, waitForMessage } = useContext(AppContext);
>>>>>>> origin/Serial-UI-Integration

    useEffect(() => {
        let isActive = true // Flag to keep track of the loop state

        const startMovementLoop = async () => {
            if (!connected || movementSequence.length === 0 || cycles <= 0) {
                addLog(`isRunning is ${isRunning}`)
                addLog(
                    'No movement actions found, not connected, or cycles set to 0. Exiting StartMovementLoop.'
                )
                setIsRunning(false)
                return
            }

            addLog('Starting movement sequence...')
            addLog(
                `Total movements: ${movementSequence.length}, Cycles: ${cycles}`
            )

            for (let i = 0; i < cycles && isActive; i++) {
                addLog(`Cycle ${i + 1} of ${cycles}`)
                for (const action of movementSequence) {
<<<<<<< HEAD
                    if (!isActive) return //Stop immediately if flag changes
=======
                    if (!isActive) return; //Stop immediately if flag changes
                    
                    addLog(`Processing movement: ${action.angle}° for ${action.time}s`);
                    
                    const desiredPosition = mapAngleToAnalog(action.angle);
                    //addLog("Trying to send movement command");
                    await sendCommand(`g${desiredPosition}`);
                    await waitForMessage("Movement Complete");
                    addLog(`Moved to Angle: ${action.angle}°`);
>>>>>>> origin/Serial-UI-Integration

                    addLog(
                        `Processing movement: ${action.angle}° for ${action.time}s`
                    )

                    const desiredPosition = mapAngleToAnalog(action.angle)
                    //addLog("Trying to send movement command");
                    await sendCommand(`g${desiredPosition}`)
                    addLog(`Moved to Angle: ${action.angle}°`)

                    await new Promise((resolve) =>
                        setTimeout(resolve, action.time * 1000)
                    )
                }
            }
<<<<<<< HEAD

            setIsRunning(false)
            sendCommand(`g${mapAngleToAnalog(105)}`)
            addLog('Movement sequence completed.')
        }
=======
            
            setIsRunning(false);
            sendCommand(`g${mapAngleToAnalog(90)}`);
            addLog("Movement sequence completed.");
        };
>>>>>>> origin/Serial-UI-Integration

        if (isRunning) {
            startMovementLoop()
        }

        return () => {
            isActive = false //Cleanup function to prevent unwanted execution after state change
        }
    }, [isRunning])

    const toggleRun = () => {
        if (isRunning) {
<<<<<<< HEAD
            setIsRunning(false)
            addLog('Stopping movement sequence...')
            sendCommand(`g${mapAngleToAnalog(105)}`)
=======
            setIsRunning(false);
            addLog("Stopping movement sequence...");
            sendCommand(`g${mapAngleToAnalog(90)}`);
>>>>>>> origin/Serial-UI-Integration
        } else {
            setIsRunning(true)
        }
    }

    return (
        <button
            type="button"
            id="run"
            className={`tbbutton ${isRunning ? 'running' : ''}`}
            onClick={toggleRun}
        >
            {isRunning ? '⏹️' : '▶️'}
        </button>
    )
}

export default RunButton
