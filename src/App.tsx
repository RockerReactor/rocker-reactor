import { AppProvider } from "./context/AppContext";
import Config from "./components/Config";
import Control from "./components/Control";
import Log from "./components/Log";

function App() {
    return (
        <AppProvider>
            <div>
                <h1>Serial Interface App</h1>
                <Config />
                <Control />
                <Log />
            </div>
        </AppProvider>
    );
}

export default App;
