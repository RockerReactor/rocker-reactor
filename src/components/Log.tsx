import {
	JSXElementConstructor,
	Key,
	ReactElement,
	ReactNode,
	ReactPortal,
	useContext,
} from "react";
import AppContext from "../context/AppContext";

const Log = () => {
	const { log } = useContext(AppContext);

	return (
		<div>
			<h2>Log</h2>
			<div>
				{log.map(
					(
						//! Why do we need so many types on this?
						entry:
							| string
							| number
							| boolean
							| ReactElement<
									any,
									string | JSXElementConstructor<any>
							  >
							| Iterable<ReactNode>
							| ReactPortal
							| null
							| undefined,
						index: Key | null | undefined
					) => (
						//! Likely should have some sort of sanitization of these.
						<p key={index}>{entry}</p>
					)
				)}
			</div>
		</div>
	);
};

export default Log;
