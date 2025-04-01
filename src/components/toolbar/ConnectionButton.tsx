import { useContext } from 'react'
import AppContext from '../../context/AppContext'
import '../../App.css'

const ConnectionButton = () => {
    const {
        connect,
        disconnect,
        isConnected,
        setIsConnected,
        connected,
        setConnected,
    } = useContext(AppContext)

    const toggleConnect = async () => {
        if (connected) {
            await disconnect()
        } else {
            await connect()
        }
    }

    return (
        <button
            type="button"
            id="connect"
            className={`tbbutton ${connected ? 'connected' : ''}`}
            onClick={toggleConnect}
        >
            {isConnected ? '🛑' : '🔗'}
        </button>
    )
}

export default ConnectionButton
