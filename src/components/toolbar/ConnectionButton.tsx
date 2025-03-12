import { useContext } from "react";
import AppContext from "../../context/AppContext";
import "../../App.css";

const ConnectionButton = () => {

    const {connect, disconnect, isConnected, setIsConnected} = useContext(AppContext);

    const toggleConnect = async () => {
        if (isConnected) {
            await disconnect();
        } else {
            await connect();
        }
    };

    return (
        <button
        type="button"
        id="connect"
        className={`tbbutton ${isConnected ? "connected" : ""}`}
        onClick={toggleConnect}
      >
        {isConnected ? "🛑" : "🔗"}
      </button>
    );
};

export default ConnectionButton;