import { Peer } from "peerjs"

export default function Peers(){
    const peer = new Peer(undefined, 
        {
            host: "localhost",
            port: 3000,
            path: "/peerjs/myapp"
        }
    )
    peer.on('open', (id) => console.log(id))

    return(
        <div></div>
    )
}