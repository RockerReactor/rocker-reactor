import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { useContext } from "react";
import AppContext from "./context/AppContext";
import Config from "./components/Config"
import Control from "./components/Control"
import Log from "./components/Log"
import AddButton from "./components/toolbar/AddButton";
import SaveButton from "./components/toolbar/SaveButton";
import ImportButton from "./components/toolbar/ImportButton";
import ConnectionButton from "./components/toolbar/ConnectionButton";
import RunButton from "./components/toolbar/RunButton"
import InfiniteRunButton from "./components/toolbar/MovementLoopButton";

interface Instruction {
  label: string;
}

function App() {
  const { PWM, setPWM, SPWM, setSPWM, AngleStep, setAngleStep, writer, addLog, sendConfigCommand, isRunning, setIsRunning } = useContext(AppContext);

  const [instructions, setInstructions] = useState<Instruction[]>([
    {label: "Rotation 1" },
    {label: "Rotation 2" },
    {label: "Rotation 3" },
  ]);

  
  const [isLooping, setIsLooping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});

  const instructionSetRef = useRef<HTMLDivElement | null>(null); // Reference to the instruction set

  //Function to update the height of instructionset
  const updateInstructionSetHeight = () => {
    if (instructionSetRef.current) {
      const controlHeight = document.querySelector(".column.control")?.clientHeight || 0;
      const toolbarHeight = document.querySelector(".toolbar")?.clientHeight || 0;
      const setupParboxHeight = document.querySelector(".setupParbox")?.clientHeight || 0;
      const remainingHeight = controlHeight - toolbarHeight - (2*setupParboxHeight);
      
      instructionSetRef.current.style.height = `${remainingHeight}px`;
    }
  };

  useEffect(() => {
    updateInstructionSetHeight(); // Set height initially
    window.addEventListener("resize", updateInstructionSetHeight); // Recalculate on resize

    return () => {
      window.removeEventListener("resize", updateInstructionSetHeight); // Clean up the event listener
    };
  }, []);

  const toggleRun = () => {
    setIsRunning((prev: boolean) => !prev);
  };

  const toggleConnect = () => {
    setIsConnected((prev) => !prev);
  };

  const toggleLoop = () => {
    setIsLooping((prev) => !prev);
  };

  const handleImport = () => {
    console.log("Import functionality to be implemented later.");
  };
  
  const handleSave = () => {
    console.log("Save functionality to be implemented later.");
  };
  
  const handleHelp = () => {
    alert("Help functionality to be implemented later.");
  };
  
  const handleCalibrate = () => {
    console.log("Calibrate functionality to be implemented later.");
  };

const handleInputChange = (id: string, value: string) => {
    const isValid = value === "" || !isNaN(Number(value));
    setInputErrors((prevErrors) => ({
        ...prevErrors,
        [id]: !isValid,
    }));

    if (isValid) {
        const numValue = Number(value);
        switch (id) {
            case "stepSize":
                setAngleStep(numValue);
                sendConfigCommand(`a${numValue}`);
                break;
            case "powerMin":
                setSPWM(numValue);
                sendConfigCommand(`s${numValue}`);
                break;
            case "powerMax":
                setPWM(numValue);
                sendConfigCommand(`p${numValue}`);
                break;
            default:
                break;
        }
    }
};


  const moveInstruction = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= instructions.length) return;

    const updatedInstructions = [...instructions];
    const [movedItem] = updatedInstructions.splice(index, 1);
    updatedInstructions.splice(newIndex, 0, movedItem);

    setInstructions(updatedInstructions);
  };

  const handleAdd = () => {
    setInstructions([...instructions, { label: `Rotation ${instructions.length + 1}` }]);
  };

  const handleRemove = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const [consoleMessages, setConsoleMessages] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;

    //Override console.log
    console.log = (...args: any[]) => {
      originalLog(...args);

      //Convert arguments to a string and add to consoleMessages
      setConsoleMessages((prevMessages) => [
        ...prevMessages,
        args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' '),
      ]);
    };

    //Cleanup: Restore the original console.log on component unmount
    return () => {
      console.log = originalLog;
    };
  }, []);

  return (
    <div>
      <div className="row">
        {/*Control Panel*/}
        <div className="column control">
          <div className="row test">
            {/*Setup Parameters*/}
              <Config />
          </div>
        

          {/*Instruction Set*/}
          <Control />

          {/*Toolbar*/}
          <div className="toolbar">
            <RunButton />
            <ImportButton />
            <SaveButton />
            <InfiniteRunButton />
           {/**  <button
              type="button"
              id="loop"
              className={`tbbutton ${isLooping ? "looping" : ""}`}
              onClick={toggleLoop}
            >
              🔁
            </button> */}
            <AddButton />
            <ConnectionButton />
            <button type="button" id="help" className="tbbutton" onClick={handleHelp}>
              ❓
            </button>
            <button type="button" id="calibrate" className="tbbutton" onClick={handleCalibrate}>
              ⚙️
            </button>
          </div>
        </div>

        {/*Right Side*/}
        <div className="column view">
          <Log />
        </div>
      </div>
    </div>
  );
}

export default App;