import { useEffect, useRef } from "react"
import { createSocketConnectionInstance } from "../helpers/connection"

export default function Meeting(props){
    let connectionInstance = useRef(null)

    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        return () => {
            connectionInstance.current?.destroyConnection()
        }
    },[])

    useEffect(() => {
        if(userDetails) startConnection();
    }, [userDetails])

    const startConnection = () => {
        connectionInstance.current = createSocketConnectionInstance({
            updateInstance, userDetails
        })
    }

    

    return (
        <div>

        </div>
    )
}