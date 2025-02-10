import { useContext } from "react";
import AppContext from "../context/AppContext";

const Config = () => {
    const { PWM, setPWM, SPWM, setSPWM, AngleStep, setAngleStep } = useContext(AppContext);

    return (
        <div>
            <h2>Config</h2>
            <label>PWM: 
                <input type="number" value={PWM} onChange={(e) => setPWM(Number(e.target.value))} />
            </label>
            <br />
            <label>SPWM: 
                <input type="number" value={SPWM} onChange={(e) => setSPWM(Number(e.target.value))} />
            </label>
            <br />
            <label>Angle Step: 
                <input type="number" value={AngleStep} onChange={(e) => setAngleStep(Number(e.target.value))} />
            </label>
        </div>
    );
};

export default Config;
