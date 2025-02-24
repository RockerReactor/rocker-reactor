import { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import MovementFileManager from "./MovementFileManager";

const Control = () => {
    const { connected, setConnected, sendCommand, addLog, setPort, setWriter, setReader, startMovementLoop, stopMovementLoop, setMovementSequence } = useContext(AppContext);
    const [angle, setAngle] = useState(45);
    const [duration, setDuration] = useState(1);

    const connect = async () => {
        if ("serial" in navigator) {
            try {
                const selectedPort = await navigator.serial.requestPort();
                await selectedPort.open({ baudRate: 9600 });

                const textEncoder = new TextEncoderStream();
                selectedPort.writable && textEncoder.readable.pipeTo(selectedPort.writable);
                const portWriter = textEncoder.writable.getWriter();

                const textDecoder = new TextDecoderStream();
                selectedPort.readable && selectedPort.readable.pipeTo(textDecoder.writable);
                const portReader = textDecoder.readable.getReader();

                setPort(selectedPort);
                setWriter(portWriter);
                setReader(portReader);
                setConnected(true);
                addLog("Connected to serial port.");
            } catch (error) {
                addLog(`Error connecting: ${error}`);
            }
        } else {
            addLog("Web Serial API not supported.");
        }
    };

    const disconnect = async () => {
        try {
            if (setReader) {
                await setReader.cancel();
                await setReader.releaseLock();
                setReader(null);
            }
            if (setWriter) {
                await setWriter.close();
                setWriter(null);
            }
            if (setPort) {
                await setPort.close();
                setPort(null);
            }
            setConnected(false);
            addLog("Disconnected.");
        } catch (error) {
            addLog(`Error disconnecting: ${error}`);
        }
    };

    const addMovementAction = () => {
        setMovementSequence((prev: any) => [...prev, { angle, duration }]);
        addLog(`Added movement: ${angle}° for ${duration}s`);
    };

    const removeMovementAction = (index: any) => {
        setMovementSequence((prev: any[]) => prev.filter((_, i) => i !== index));
        addLog(`Removed movement at index ${index}`);
    };

    return (
        <div>
            <h2>Control</h2>
            <button onClick={connect} disabled={connected}>Connect</button>
            <button onClick={disconnect} disabled={!connected}>Disconnect</button>

            <h3>Movement Sequence</h3>
            <label>Angle: <input type="number" value={angle} onChange={(e) => setAngle(Number(e.target.value))} /></label>
            <label>Duration (s): <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} /></label>
            <button onClick={addMovementAction}>Add Movement</button>

            <h3>Execution</h3>
            <button onClick={startMovementLoop}>Start Sequence</button>
            <button onClick={stopMovementLoop}>Stop Sequence</button>

            <MovementFileManager />
        </div>
    );
};

export default Control;
