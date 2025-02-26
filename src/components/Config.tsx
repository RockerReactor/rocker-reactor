import { useContext } from "react";
import AppContext from "../context/AppContext";

const Config = () => {
	//? A in AngleStep should be lowercase to match camel case
	const { PWM, setPWM, SPWM, setSPWM, AngleStep, setAngleStep } =
		useContext(AppContext);

	//? Formatting error, line length
	return (
		<div>
			<h2>Config</h2>
			<label>
				PWM:
				<input
					type="number"
					value={PWM}
					onChange={(e) => setPWM(Number(e.target.value))}
				/>
			</label>
			<br />
			<label>
				SPWM:
				<input
					type="number"
					value={SPWM}
					onChange={(e) => setSPWM(Number(e.target.value))}
				/>
			</label>
			<br />
			<label>
				Angle Step:
				<input
					type="number"
					value={AngleStep}
					//! is there a security issue here?
					//* Converting these to numbers can potentially erase data
					onChange={(e) => setAngleStep(Number(e.target.value))}
				/>
			</label>
		</div>
	);
};

export default Config;
