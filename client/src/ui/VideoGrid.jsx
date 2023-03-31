import {useState, useEffect, useCallback} from 'react'
import io from "socket.io-client"
import { Peer } from "peerjs"
import config from "../config.json"

const connectConfig = config[config.env]

function addVideoStream(videoGrid, video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

function connectToNewUser(setPeers, peers, myPeer, videoGrid, stream, userId){
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        console.log("connect to new user call stream")
        addVideoStream(videoGrid, video, userVideoStream)
    })

    call.on('close', () => {
        console.log("remove video")
        video.remove()
    })
    setPeers({...peers, [userId]: call})
}

export default function VideoGrid(){
    const [renderCount, setRenderCount] = useState(0)

    const [peers, setPeers] = useState({})

    useEffect(() => {
        if(renderCount === 0){
            const socket = io(connectConfig.socket_url)
            const videoGrid = document.getElementById('video-grid')
            const myPeer = new Peer(undefined, {
                host: connectConfig.peer_server,
                port: connectConfig.peer_server_port,
                path: connectConfig.peer_server_path
            })
            const myVideo = document.createElement('video')
            myVideo.muted = true

            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                addVideoStream(videoGrid, myVideo, stream)
                myPeer.on('call', call => {
                    console.log("peer call");
                    console.log(call)
                    call.answer(stream)
                    const userVideo = document.createElement('video')
                    call.on('stream', userVideoStream => {
                        console.log("peer stream")
                        console.log(userVideoStream)
                        addVideoStream(videoGrid, userVideo, userVideoStream)
                    })
                })

                socket.on('user-connected', userId => {
                    console.log("user connected")
                    connectToNewUser(setPeers, peers, myPeer, videoGrid, stream, userId)
                })

                socket.on('connected-peers', (connectedPeers) => {
                    console.log(connectedPeers)
                    let existingUsers = JSON.parse(connectedPeers)
                    for(let userId in Object.keys(existingUsers)){
                        if(existingUsers[userId] !== 0){
                            
                        }
                    }
                })
            })

            socket.on('user-disconnected', userId => {
                console.log("user-disconnected")
                if(peers[userId]) peers[userId].close()
            })

            myPeer.on('open', id => {
                console.log("peer open")
                socket.emit('join-room', "kjakalkekksds", id)
            })

            setRenderCount(renderCount + 1)
        }
    }, [])

    return (
        <div id='video-grid'>
        </div>
    )
}
