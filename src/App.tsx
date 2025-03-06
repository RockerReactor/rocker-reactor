import React, { useState, useEffect, useRef } from "react";
import "./App.css";

interface Instruction {
  id: string;
  label: string;
}

function App() {
  const [instructions, setInstructions] = useState<Instruction[]>([
    { id: "1", label: "Rotation 1" },
    { id: "2", label: "Rotation 2" },
    { id: "3", label: "Rotation 3" },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
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
    setIsRunning((prev) => !prev);
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
    const newId = (instructions.length + 1).toString();
    setInstructions([
      ...instructions,
      { id: newId, label: `Rotation ${newId}` },
    ]);
  };

  const handleRemove = (id: string) => {
    setInstructions(instructions.filter((instruction) => instruction.id !== id));
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
            <div className="setupParbox">
              <div className="setupParam">
                <label className="setupText">Step Size </label>
                <input
                  className={`parIn ${inputErrors["stepSize"] ? "invalid" : ""}`}
                  type="text"
                  onChange={(e) => handleInputChange("stepSize", e.target.value)}
                />
                <label className="setupSym">∠</label>
              </div>
              <div className="setupParam">
                <label className="setupText">Power Min </label>
                <input
                  className={`parIn ${inputErrors["powerMin"] ? "invalid" : ""}`}
                  type="text"
                  onChange={(e) => handleInputChange("powerMin", e.target.value)}
                />
                <label className="setupSym">V</label>
              </div>
              <div className="setupParam">
                <label className="setupText">Cycles </label>
                <input
                  className={`parIn ${inputErrors["cycles"] ? "invalid" : ""}`}
                  type="text"
                  onChange={(e) => handleInputChange("cycles", e.target.value)}
                />
                <label className="setupSym">↻</label>
              </div>
              <div className="setupParam">
                <label className="setupText">Power Max </label>
                <input
                  className={`parIn ${inputErrors["powerMax"] ? "invalid" : ""}`}
                  type="text"
                  onChange={(e) => handleInputChange("powerMax", e.target.value)}
                />
                <label className="setupSym">V</label>
              </div>
            </div>
          </div>

          {/*Instruction Set*/}
          <div ref={instructionSetRef} className="instructionset">
            {instructions.map((instruction, index) => (
              <div className="instruction" key={instruction.id}>
                <label>{instruction.label}</label>
                <label className="parText parIn">∠</label>
                <input
                  className={`parIn ${
                    inputErrors[`rotation-${instruction.id}-angle`] ? "invalid" : ""
                  }`}
                  type="text"
                  onChange={(e) =>
                    handleInputChange(`rotation-${instruction.id}-angle`, e.target.value)
                  }
                />
                <label className="parText parIn">T</label>
                <input
                  className={`parIn ${
                    inputErrors[`rotation-${instruction.id}-time`] ? "invalid" : ""
                  }`}
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
                    disabled={index === instructions.length - 1}
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

          {/*Toolbar*/}
          <div className="toolbar">
            <button
              type="button"
              id="run"
              className={`tbbutton ${isRunning ? "running" : ""}`}
              onClick={toggleRun}
            >
              {isRunning ? "⏹️" : "▶️"}
            </button>
            <button type="button" id="import" className="tbbutton" onClick={handleImport}>
              ⬆️
            </button>
            <button type="button" id="save" className="tbbutton" onClick={handleSave}>
              💾
            </button>
            <button
              type="button"
              id="loop"
              className={`tbbutton ${isLooping ? "looping" : ""}`}
              onClick={toggleLoop}
            >
              🔁
            </button>
            <button type="button" id="add" className="tbbutton" onClick={handleAdd}>
              ➕
            </button>
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
          <div className="console">
            <div className="console-output">
              {consoleMessages.length === 0 ? (
                <p>No messages yet...</p>
              ) : (
                consoleMessages.map((msg, index) => <p key={index}>{msg}</p>)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
