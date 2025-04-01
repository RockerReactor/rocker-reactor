import { createContext, useState } from 'react'
import { useEffect, useRef } from 'react'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [port, setPort] = useState(null)
    const [writer, setWriter] = useState(null)
    const [reader, setReader] = useState(null)
    const [readableStreamClosed, setReadableStreamClosed] = useState(null)
    const [writableStreamClosed, setWritableStreamClosed] = useState(null)
    const [movementSequence, setMovementSequence] = useState([])
    const [log, setLog] = useState([])
    const [PWM, setPWM] = useState(175)
    const [SPWM, setSPWM] = useState(175)
    const [AngleStep, setAngleStep] = useState(10)
    const [position, setPosition] = useState(0)
    const [connected, setConnected] = useState(false)
    const isRunningRef = useRef(false)
    const [cycles, setCycles] = useState(0)

    const connect = async () => {
        if ('serial' in navigator) {
            try {
                const selectedPort = await navigator.serial.requestPort()
                await selectedPort.open({ baudRate: 9600 })

                const textEncoder = new TextEncoderStream()

                const writableStreamClosed =
                    selectedPort.writable &&
                    textEncoder.readable.pipeTo(selectedPort.writable)

                const portWriter = textEncoder.writable.getWriter()

                const textDecoder = new TextDecoderStream()

                const readableStreamClosed =
                    selectedPort.readable &&
                    selectedPort.readable.pipeTo(textDecoder.writable)

                const portReader = textDecoder.readable.getReader()

                setPort(selectedPort)
                setWriter(portWriter)
                setReader(portReader)
                setReadableStreamClosed(readableStreamClosed)
                setWritableStreamClosed(writableStreamClosed)
                setConnected(true)
                //addLog("Connected to serial port.");
            } catch (error) {
                //addLog(`Error connecting: ${error}`);
            }
        } else {
            //addLog("Web Serial API not supported.");
        }
    }

    useEffect(() => {
        let cancelled = false
        let buffer = ''

        const listenToPort = async () => {
            if (!reader) return

            try {
                while (true) {
                    const { value, done } = await reader.read()
                    if (done || cancelled) break

                    if (value) {
                        buffer += value

                        let lines = buffer.split('\n')
                        buffer = lines.pop() //Save the incomplete part (if any)

                        for (const line of lines) {
                            const trimmed = line.trim()
                            if (trimmed) {
                                addLog(`Serial: ${trimmed}`)
                            }
                        }
                    }
                }
            } catch (error) {
                if (!cancelled) {
                    addLog(`Error reading from serial port: ${error}`)
                }
            }
        }

        listenToPort()

        return () => {
            cancelled = true
        }
    }, [reader])

    const disconnect = async () => {
        try {
            //addLog("Starting disconnect process...");

            if (reader) {
                //addLog("Attempting to cancel and release reader...");
                try {
                    await reader.cancel()
                    await readableStreamClosed.catch(() => {
                        /**addLog("Reader cancelation error ignored.");*/
                    })
                    await reader.releaseLock()
                    //addLog("Reader canceled and released.");
                } catch (err) {
                    //addLog(`Error canceling reader: ${err}`);
                }
                setReader(null)
            }

            if (writer) {
                //addLog("Attempting to close and release writer...");
                try {
                    await writer.close()
                    await writableStreamClosed
                    await writer.releaseLock()
                    //addLog("Writer closed and released.");
                } catch (err) {
                    addLog(`Error closing writer: ${err}`)
                }
                setWriter(null)
            }

            if (port) {
                try {
                    //addLog("Attempting to release streams before closing port...");
                    if (port.readable) {
                        //await port.readable.cancel();
                        //await port.readable.pipeTo(new WritableStream()).catch(() => {});
                        //addLog("Readable stream drained.");
                    }
                    if (port.writable) {
                        //await port.writable.close();
                        //addLog("Writable stream closed.");
                    }

                    //addLog("Attempting to close serial port...");
                    await port.close()
                    //addLog("Port closed successfully.");
                } catch (err) {
                    addLog(`Error closing port: ${err}`)
                }
                setPort(null)
            }

            setConnected(false)
            //addLog("Disconnected successfully.");
        } catch (error) {
            addLog(`Error disconnecting: ${error}`)
        }
    }

    const addLog = (message) => {
        setLog((prevLogs) => [...prevLogs, message])
    }

    const sendCommand = async (command) => {
        if (writer) {
            try {
                //addLog(`Attempting to send: ${command}`);
                await writer.write(command + '\n')
                //addLog(`Command sent: ${command}`);
            } catch (error) {
                addLog(`Error writing to serial port: ${error}`)
            }
        } else {
            addLog('Serial port not connected.')
        }
    }

    const mapAngleToAnalog = (angle) => {
        const minAnalog = 100
        const maxAnalog = 900
        return Math.round(minAnalog + (angle / 180) * (maxAnalog - minAnalog))
    }

    //Function to save the movement sequence to JSON file
    const saveMovementSequence = async () => {
        try {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: 'movement_sequence.json',
                types: [
                    {
                        description: 'JSON Files',
                        accept: { 'application/json': ['.json'] },
                    },
                ],
            })
            const writableStream = await fileHandle.createWritable()
            const sequenceData = JSON.stringify(movementSequence, null, 2)
            await writableStream.write(sequenceData)
            await writableStream.close()
            addLog('Movement sequence saved successfully.')
        } catch (error) {
            addLog(`Error saving movement sequence: ${error}`)
        }
    }

    //Function to load the movement sequence from JSON file
    const loadMovementSequence = async () => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'JSON Files',
                        accept: { 'application/json': ['.json'] },
                    },
                ],
            })
            const file = await fileHandle.getFile()
            const fileContent = await file.text()
            const loadedSequence = JSON.parse(fileContent)
            setMovementSequence(loadedSequence)
            addLog('Movement sequence loaded successfully.')
        } catch (error) {
            addLog(`Error loading movement sequence: ${error}`)
        }
    }

    return (
        <AppContext.Provider
            value={{
                port,
                setPort,
                writer,
                setWriter,
                reader,
                setReader,
                movementSequence,
                setMovementSequence,
                log,
                addLog,
                PWM,
                setPWM,
                SPWM,
                setSPWM,
                AngleStep,
                setAngleStep,
                position,
                setPosition,
                connected,
                setConnected,
                sendCommand,
                readableStreamClosed,
                writableStreamClosed,
                setReadableStreamClosed,
                setWritableStreamClosed,
                saveMovementSequence,
                loadMovementSequence,
                connect,
                disconnect,
                isRunningRef,
                mapAngleToAnalog,
                connected,
                setConnected,
                cycles,
                setCycles,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
