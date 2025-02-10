import { createContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [port, setPort] = useState(null);
    const [writer, setWriter] = useState(null);
    const [reader, setReader] = useState(null);
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
                await writer.write(command + "\n");
                addLog(`Sent command: ${command}`);
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

        while (isRunning) {
            for (const action of movementSequence) {
                if (!isRunning) break;
                
                const desiredPosition = mapAngleToAnalog(action.angle);
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
            sendCommand, startMovementLoop, stopMovementLoop
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
