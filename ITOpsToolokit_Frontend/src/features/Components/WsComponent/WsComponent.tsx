import { useEffect } from "react"
import { useWs } from "../../../customhooks/useWs"

export const WsComponent = () => {
    const url = "ws://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8006/role_socket_test/ws/1516"
    const [ready, val, send] = useWs({ url })

    useEffect(() => {
        console.log(val)
    }, [ready, send]) // make sure to include send in dependency array

    return (
        <div>
            Ready: {JSON.stringify(ready)}, Value: {val}
            <button onClick={() => {
                send("test My message message")
            }}> Send message hello</button>
        </div>
    )
}