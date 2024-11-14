import React, { useState, useEffect } from "react";

type MovementAction = {
	angle: number; // In degrees
	duration: number; // In seconds
};

const SerialInterface: React.FC = () => {
	// State variables
	const [port, setPort] = useState<SerialPort | null>(null);
	const [writer, setWriter] =
		useState<WritableStreamDefaultWriter<string> | null>(null);
	const [reader, setReader] =
		useState<ReadableStreamDefaultReader<string> | null>(null);
	const [movementSequence, setMovementSequence] = useState<MovementAction[]>(
		[]
	);
	const [log, setLog] = useState<string[]>([]);
	const [PWM, setPWM] = useState<number>(175); // Default PWM value
	const [SPWM, setSPWM] = useState<number>(175); // Default SPWM value
	const [AngleStep, setAngleStep] = useState<number>(10); // Default AngleStep
	const [position, setPosition] = useState<number>(0); // Current position from Arduino

	/**
	 * Connect to the serial port selected by the user.
	 */
	const connect = async () => {
		if ("serial" in navigator) {
			try {
				// Request a port and open a connection.
				const selectedPort = await navigator.serial.requestPort();
				await selectedPort.open({ baudRate: 9600 }); // Adjust baudRate as needed
				setPort(selectedPort);

				// Set up text encoder for writing to the port.
				const textEncoder = new TextEncoderStream();
				const writableStreamClosed =
					selectedPort.writable != null
						? textEncoder.readable.pipeTo(selectedPort.writable)
						: null;
				const portWriter = textEncoder.writable.getWriter();
				setWriter(portWriter);

				// Set up text decoder for reading from the port.
				const textDecoder = new TextDecoderStream();
				const readableStreamClosed =
					selectedPort.readable != null
						? selectedPort.readable.pipeTo(textDecoder.writable)
						: null;
				const portReader = textDecoder.readable.getReader();
				setReader(portReader);

				readLoop(); // Start reading data from Arduino

				console.log("Connected to serial port");
			} catch (error) {
				console.error("Error connecting to serial port:", error);
			}
		} else {
			console.error("Web Serial API not supported in this browser.");
		}
	};

	/**
	 * Disconnect from the serial port.
	 */
	const disconnect = async () => {
		try {
			if (reader) {
				await reader.cancel();
				await reader.releaseLock();
				setReader(null);
			}
			if (writer) {
				await writer.close();
				setWriter(null);
			}
			if (port) {
				await port.close();
				setPort(null);
			}
			console.log("Disconnected from serial port");
		} catch (error) {
			console.error("Error disconnecting from serial port:", error);
		}
	};

	/**
	 * Send a command string to the Arduino via serial port.
	 * @param command The command string to send.
	 */
	const sendCommand = async (command: string) => {
		if (writer) {
			try {
				await writer.write(command + "\n"); // Append newline character
				console.log("Sent command:", command);
			} catch (error) {
				console.error("Error writing to serial port:", error);
			}
		} else {
			console.error("Serial port not connected.");
		}
	};

	/**
	 * Read data from the serial port.
	 */
	const readLoop = async () => {
		if (reader) {
			try {
				while (true) {
					const { value, done } = await reader.read();
					if (done) {
						// Allow the serial port to be closed later.
						break;
					}
					if (value) {
						handleSerialData(value);
					}
				}
			} catch (error) {
				console.error("Error reading from serial port:", error);
			}
		}
	};

	/**
	 * Handle incoming serial data from the Arduino.
	 * @param data The data received from the Arduino.
	 */
	const handleSerialData = (data: string) => {
		// Split data by lines
		const lines = data.split("\n");
		lines.forEach((line) => {
			line = line.trim();
			if (line) {
				console.log("Received:", line);
				setLog((prevLog) => [...prevLog, line]);

				// Parse known outputs
				if (line.startsWith("power max,")) {
					const pwmValue = parseInt(line.split(",")[1]);
					setPWM(pwmValue);
				} else if (line.startsWith("power min,")) {
					const spwmValue = parseInt(line.split(",")[1]);
					setSPWM(spwmValue);
				} else if (line.startsWith("anglestep,")) {
					const angleStepValue = parseInt(line.split(",")[1]);
					setAngleStep(angleStepValue);
				} else if (line.startsWith("position,")) {
					const positionValue = parseInt(line.split(",")[1]);
					setPosition(positionValue);
				} else if (line.startsWith("Error")) {
					// Handle errors
					console.error("Arduino Error:", line);
				}
			}
		});
	};

	/**
	 * Map angle in degrees to analog reading (100 - 900).
	 * Adjust the mapping function based on calibration.
	 * @param angle The angle in degrees.
	 */
	const mapAngleToAnalog = (angle: number): number => {
		// For demonstration, assume 0 degrees => 100, 180 degrees => 900
		const minAnalog = 100;
		const maxAnalog = 900;
		const mappedValue = minAnalog + (angle / 180) * (maxAnalog - minAnalog);
		return Math.round(mappedValue);
	};

	/**
	 * Start the rocking process by sending movement commands to the Arduino.
	 */
	const startButtonHandler = async () => {
		if (!port || !writer) {
			console.error("Serial port not connected.");
			return;
		}

		// Send PWM, SPWM, and AngleStep settings to Arduino
		await sendCommand(`p${PWM}`);
		await sendCommand(`s${SPWM}`);
		await sendCommand(`a${AngleStep}`);

		for (const action of movementSequence) {
			const desiredPosition = mapAngleToAnalog(action.angle);
			await sendMovementCommand(desiredPosition);
			logMovement(action.angle, action.duration);

			// Wait for the specified duration
			await new Promise((resolve) =>
				setTimeout(resolve, action.duration * 1000)
			);
		}
	};

	/**
	 * Send movement command to the Arduino.
	 * @param desiredPosition The desired analog position (100 - 900).
	 */
	const sendMovementCommand = async (desiredPosition: number) => {
		// Construct command string
		const command = `g${desiredPosition}`;
		await sendCommand(command);
	};

	/**
	 * Stop the rocking process by returning to default position
	 */
	const stopButtonHandler = async () => {
		// Move to default position (e.g., angle 0 degrees)
		const defaultPosition = mapAngleToAnalog(0);
		await sendMovementCommand(defaultPosition);
	};

	/**
	 * Log the movement action for monitoring purposes.
	 * @param angle The angle moved to.
	 * @param duration The duration waited after moving.
	 */
	const logMovement = (angle: number, duration: number) => {
		const timestamp = new Date().toLocaleTimeString();
		const entry = `Time: ${timestamp}, Moved to Angle: ${angle}°, Duration: ${duration}s`;
		setLog((prevLog) => [...prevLog, entry]);
	};

	/**
	 * Add a new movement action to the sequence.
	 * @param angle The angle for the new movement.
	 * @param duration The duration for the new movement.
	 */
	const addMovementAction = (angle: number, duration: number) => {
		setMovementSequence((prevSequence) => [
			...prevSequence,
			{ angle, duration },
		]);
	};

	/**
	 * Remove a movement action from the sequence by index.
	 * @param index The index of the movement action to remove.
	 */
	const removeMovementAction = (index: number) => {
		setMovementSequence((prevSequence) =>
			prevSequence.filter((_, i) => i !== index)
		);
	};

	// Clean up on component unmount
	useEffect(() => {
		return () => {
			disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

export default SerialInterface;
