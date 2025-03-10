import { useContext } from "react";
import AppContext from "../context/AppContext";

const Log = () => {
    const { log } = useContext(AppContext);

    return (
        <div className="console">
            <div className="console-output">
                {log.length === 0 ? (
                    <p>No messages yet...</p>
                ) : (
                    log.map((entry: any, index: any) => <p key={index}>{entry}</p>)
                )}
            </div>
        </div>
    );
};

export default Log;
