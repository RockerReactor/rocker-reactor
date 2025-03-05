import React, { useState } from "react";
import "./App.css";

interface Instruction {
  id: string;
  label: string;
}

function App() {
  const [instructions, setInstructions] = useState<Instruction[]>([
    { id: "1", label: "Rotation 1" },
    { id: "2", label: "Rotation 2" },
    { id: "3", label: "Rotation 3" }
  ]);

  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});

  const handleInputChange = (id: string, value: string) => {
    //Check if the value is non-numeric, but allow empty strings
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
    setInstructions([...instructions, { id: newId, label: `Rotation ${newId}` }]);
  };

  const handleRemove = (id: string) => {
    setInstructions(instructions.filter((instruction) => instruction.id !== id));
  };

  return (
    <div>
      <html lang="en">
        <head>
          <title>CSS Website Layout</title>
        </head>
        <body>
          <div className="row">
            {/* Control Panel */}
            <div className="column control">
              <div className="row test">
                <div className="setupParbox">
                  <div className="setupParam">
                    <label className="setupText">Step Size </label>
                    <input
                      className={`parIn ${inputErrors["stepSize"] ? 'invalid' : ''}`}
                      type="text"
                      onChange={(e) => handleInputChange("stepSize", e.target.value)}
                    />
                    <label className="setupSym">∠</label>
                  </div>
                  <div className="setupParam">
                    <label className="setupText">Power Min </label>
                    <input
                      className={`parIn ${inputErrors["powerMin"] ? 'invalid' : ''}`}
                      type="text"
                      onChange={(e) => handleInputChange("powerMin", e.target.value)}
                    />
                    <label className="setupSym">V</label>
                  </div>
                </div>
                <div className="setupParbox">
                  <div className="setupParam">
                    <label className="setupText">Cycles </label>
                    <input
                      className={`parIn ${inputErrors["cycles"] ? 'invalid' : ''}`}
                      type="text"
                      onChange={(e) => handleInputChange("cycles", e.target.value)}
                    />
                    <label className="setupSym">↻</label>
                  </div>
                  <div className="setupParam">
                    <label className="setupText">Power Max </label>
                    <input
                      className={`parIn ${inputErrors["powerMax"] ? 'invalid' : ''}`}
                      type="text"
                      onChange={(e) => handleInputChange("powerMax", e.target.value)}
                    />
                    <label className="setupSym">V</label>
                  </div>
                </div>
              </div>

              {/*Instruction Set*/}
              <div className="instructionset">
                {instructions.map((instruction, index) => (
                  <div className="instruction" key={instruction.id}>
                    <label>{instruction.label}</label>
                    <label className="parText parIn">∠</label>
                    <input
                      className={`parIn ${inputErrors[`rotation-${instruction.id}-angle`] ? 'invalid' : ''}`}
                      type="text"
                      onChange={(e) => handleInputChange(`rotation-${instruction.id}-angle`, e.target.value)}
                    />
                    <label className="parText parIn">T</label>
                    <input
                      className={`parIn ${inputErrors[`rotation-${instruction.id}-time`] ? 'invalid' : ''}`}
                      type="text"
                      onChange={(e) => handleInputChange(`rotation-${instruction.id}-time`, e.target.value)}
                    />
                    <div className="button-container">
                      {/*Move Up Button*/}
                      <button
                        className="move-button"
                        onClick={() => moveInstruction(index, -1)}
                        disabled={index === 0} //Disable for first item
                      >
                        ↑
                      </button>

                      {/*Move Down Button*/}
                      <button
                        className="move-button"
                        onClick={() => moveInstruction(index, 1)}
                        disabled={index === instructions.length - 1} //Disable for last item
                      >
                        ↓
                      </button>

                      {/* Remove Button */}
                      <button className="remove-button" onClick={() => handleRemove(instruction.id)}>
                        −
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/*Toolbar*/}
              <div className="toolbar">
                <button type="button" id="run tbbutton">
                  RUN
                </button>
                <button type="button" id="import tbbutton">
                  I
                </button>
                <button type="button" id="save tbbutton">
                  S
                </button>
                <button type="button" id="loop tbbutton">
                  L
                </button>
                <button type="button" id="add tbbutton" onClick={handleAdd}>
                  +
                </button>
              </div>
            </div>

            {/*Right Side*/}
            <div className="column view">
              <h2>Main Content</h2>
              <p>Lorem ipsum dolor sit amet...</p>
              <p>Lorem ipsum dolor sit amet...</p>
            </div>
          </div>
        </body>
      </html>
    </div>
  );
}

export default App;
