import { createContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [port, setPort] = useState(null);
    const [writer, setWriter] = useState(null);
    const [reader, setReader] = useState(null);
    const [readableStreamClosed, setReadableStreamClosed] = useState(null);
    const [writableStreamClosed, setWritableStreamClosed] = useState(null);
    const [movementSequence, setMovementSequence] = useState([]);
    const [log, setLog] = useState([]);
    const [PWM, setPWM] = useState(175);
    const [SPWM, setSPWM] = useState(175);
    const [AngleStep, setAngleStep] = useState(10);
    const [position, setPosition] = useState(0);
    const [connected, setConnected] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const addLog = (message) => {
        setLog((prevLogs) => [...prevLogs, message]);
    };

    const sendCommand = async (command) => {
        if (writer) {
            try {
                addLog(`Attempting to send: ${command}`);
                await writer.write(command + "\n");
                addLog(`Command sent: ${command}`);
            } catch (error) {
                addLog(`Error writing to serial port: ${error}`);
            }
        } else {
            addLog("Serial port not connected.");
        }
    };

    const mapAngleToAnalog = (angle) => {
        const minAnalog = 100;
        const maxAnalog = 900;
        return Math.round(minAnalog + (angle / 180) * (maxAnalog - minAnalog));
    };

    const startMovementLoop = async () => {
        if (!connected || isRunning) return;

        setIsRunning(true);
        addLog("Starting movement sequence...");
        addLog(movementSequence.length)

        if (movementSequence.length === 0) {
            addLog("No movement actions found. Exiting StartMovementLoop.");
            setIsRunning(false);
            return;
        }

        while (isRunning) {
            addLog("I'm running");
            for (const action of movementSequence) {
                addLog(`Processing movement: ${action.angle}° for ${action.duration}s`);
                if (!isRunning) break;
                
                const desiredPosition = mapAngleToAnalog(action.angle);
                addLog("Trying to send movement command");
                await sendCommand(`g${desiredPosition}`);
                addLog(`Moved to Angle: ${action.angle}°`);

                await new Promise((resolve) => setTimeout(resolve, action.duration * 1000));
            }
        }
    };

    const stopMovementLoop = () => {
        setIsRunning(false);
        addLog("Stopping movement sequence...");
        sendCommand(`g${mapAngleToAnalog(0)}`);
    };

    return (
        <AppContext.Provider value={{
            port, setPort, writer, setWriter, reader, setReader,
            movementSequence, setMovementSequence, log, addLog,
            PWM, setPWM, SPWM, setSPWM, AngleStep, setAngleStep, 
            position, setPosition, connected, setConnected,
            sendCommand, startMovementLoop, stopMovementLoop, 
            readableStreamClosed, writableStreamClosed,
            setReadableStreamClosed, setWritableStreamClosed
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
