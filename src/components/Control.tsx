import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useContext, useState } from "react";
import AppContext from "../context/AppContext";
import MovementFileManager from "./MovementFileManager";

const Control = () => {
    const { connected, setConnected, sendCommand, addLog, setPort, setWriter, setReader, 
        startMovementLoop, stopMovementLoop, movementSequence, setMovementSequence, reader, 
        writer, port, readableStreamClosed, setReadableStreamClosed, writableStreamClosed,
        setWritableStreamClosed } = useContext(AppContext);

    const [angle, setAngle] = useState(45);
    const [duration, setDuration] = useState(1);

    const connect = async () => {
        if ("serial" in navigator) {
            try {
                const selectedPort = await navigator.serial.requestPort();
                await selectedPort.open({ baudRate: 9600 });

                const textEncoder = new TextEncoderStream();

                const writableStreamClosed = selectedPort.writable && 
                textEncoder.readable.pipeTo(selectedPort.writable);

                const portWriter = textEncoder.writable.getWriter();

                const textDecoder = new TextDecoderStream();

                const readableStreamClosed = selectedPort.readable && 
                selectedPort.readable.pipeTo(textDecoder.writable);

                const portReader = textDecoder.readable.getReader();

                setPort(selectedPort);
                setWriter(portWriter);
                setReader(portReader);
                setReadableStreamClosed(readableStreamClosed);
                setWritableStreamClosed(writableStreamClosed);
                setConnected(true);
                console.log("Connected to serial port.");
            } catch (error) {
                console.error("Error connecting:", error);
            }
        } else {
            console.log("Web Serial API not supported.");
        }
    };

    const disconnect = async () => {
        try {
            console.log("Starting disconnect process...");
            if (reader) {
                console.log("Attempting to cancel and release reader...");
                try {
                    await reader.cancel();
                    await readableStreamClosed.catch(() => { addLog("Reader cancelation error ignored."); });
                    await reader.releaseLock();
                    console.log("Reader canceled and released.");
                } catch (error) {
                    console.error("Error canceling reader:", error);
                }
                setReader(null);
            }
    
            if (writer) {
                console.log("Attempting to close and release writer...");
                try {
                    await writer.close();
                    await writableStreamClosed;
                    await writer.releaseLock();
                    console.log("Writer closed and released.");
                } catch (error) {
                    console.error("Error closing writer:", error);
                }
                setWriter(null);
            }
    
            if (port) {
                try {
                    console.log("Attempting to release streams before closing port...");
                    if (port.readable) {
                        //await port.readable.cancel();
                        //await port.readable.pipeTo(new WritableStream()).catch(() => {});
                        console.log("Readable stream drained.");
                    }
                    if (port.writable) {
                        //await port.writable.close();
                        console.log("Writable stream closed.");
                    }
                    console.log("Attempting to close serial port...");
                    await port.close();
                    console.log("Port closed successfully.");
                } catch (error) {
                    console.error("Error closing port:", error);
                }
                setPort(null);
            }
    
            setConnected(false);
            console.log("Disconnected successfully.");
        } catch (error) {
            console.error("Error disconnecting:", error);
        }
    };
    

    const addMovementAction = () => {
        setMovementSequence((prev: any) => [...prev, { angle, duration }]);
        console.log("Added movement: ${angle}° for ${duration}s");
    };

    const removeMovementAction = (index: any) => {
        setMovementSequence((prev: any[]) => prev.filter((_, i) => i !== index));
        console.log("Removed movement at index ${index}");
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

            <h3>Current Movement Actions</h3>
            <ul>
                {movementSequence.map((action: { angle: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; duration: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: Key | null | undefined) => (
                    <li key={index}>
                        Angle: {action.angle}°, Duration: {action.duration}s
                        <button onClick={() => removeMovementAction(index)}>Remove</button>
                    </li>
                ))}
            </ul>

            <h3>Execution</h3>
            <button onClick={startMovementLoop}>Start Sequence</button>
            <button onClick={stopMovementLoop}>Stop Sequence</button>

            <MovementFileManager />
        </div>
    );
};

export default Control;
