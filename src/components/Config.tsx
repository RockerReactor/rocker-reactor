import { useContext } from 'react'
import React, { useState, useEffect, useRef } from 'react'
import AppContext from '../context/AppContext'
import '../App.css'

const Config = () => {
    const {
        PWM,
        setPWM,
        SPWM,
        setSPWM,
        AngleStep,
        setAngleStep,
        writer,
        addLog,
        cycles,
        setCycles,
    } = useContext(AppContext)
    const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>(
        {}
    )

    // Function to send the configuration command to the Arduino
    const sendConfigCommand = async (command: string) => {
        if (!writer) {
            addLog('Error: No serial connection.')
            return
        }
        try {
            await writer.write(command + '\n') // Send command to Arduino
            //addLog(`Sent command: ${command}`);
        } catch (error) {
            addLog(`Error sending command: ${error}`)
        }
    }

    const handleInputChange = (id: string, value: string) => {
        const isValid = value === '' || !isNaN(Number(value))
        setInputErrors((prevErrors) => ({
            ...prevErrors,
            [id]: !isValid,
        }))

        if (isValid) {
            const numValue = Number(value)
            switch (id) {
                case 'stepSize':
                    setAngleStep(numValue)
                    sendConfigCommand(`a${numValue}`)
                    break
                case 'powerMin':
                    setSPWM(numValue)
                    sendConfigCommand(`s${numValue}`)
                    break
                case 'powerMax':
                    setPWM(numValue)
                    sendConfigCommand(`p${numValue}`)
                    break
                case 'cycles':
                    setCycles(numValue)
                    break
                default:
                    break
            }
        }
    }

    return (
        <div className="setupParbox">
            <div className="setupParam">
                <label className="setupText">Step Size </label>
                <input
                    className={`parIn ${inputErrors['stepSize'] ? 'invalid' : ''}`}
                    type="text"
                    value={AngleStep} // Keeps UI synced
                    onChange={(e) =>
                        handleInputChange('stepSize', e.target.value)
                    }
                />
                <label className="setupSym">∠</label>
            </div>
            <div className="setupParam">
                <label className="setupText">Power Min </label>
                <input
                    className={`parIn ${inputErrors['powerMin'] ? 'invalid' : ''}`}
                    type="text"
                    value={SPWM} // Keeps UI synced
                    onChange={(e) =>
                        handleInputChange('powerMin', e.target.value)
                    }
                />
                <label className="setupSym">V</label>
            </div>
            <div className="setupParam">
                <label className="setupText">Cycles </label>
                <input
                    className={`parIn ${inputErrors['cycles'] ? 'invalid' : ''}`}
                    type="text"
                    onChange={(e) =>
                        handleInputChange('cycles', e.target.value)
                    }
                />
                <label className="setupSym">↻</label>
            </div>
            <div className="setupParam">
                <label className="setupText">Power Max </label>
                <input
                    className={`parIn ${inputErrors['powerMax'] ? 'invalid' : ''}`}
                    type="text"
                    value={PWM} // Keeps UI synced
                    onChange={(e) =>
                        handleInputChange('powerMax', e.target.value)
                    }
                />
                <label className="setupSym">V</label>
            </div>
        </div>
    )
}

export default Config
