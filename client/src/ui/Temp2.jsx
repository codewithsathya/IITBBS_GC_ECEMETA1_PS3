import useUserMedia from "../hooks/useUserMedia"
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Peer } from "peerjs";
import config from "../config.json";
import useObjectState from "../hooks/useObjectState";

const connectConfig = config[config.env];
const peerOptions = {
    host: connectConfig.peer_server,
    port: connectConfig.peer_server_port,
    path: connectConfig.peer_server_path,
}

const cameraConfig = {
    video: false,
    audio: false
}

const roomId = "room1Id";

export default function Meeting(){
    const settings = JSON.parse(localStorage.getItem("user-settings"));
    const cameraEnabled = settings.cameraEnabled;
    const microphoneEnabled = settings.microphoneEnabled;
    // const cameraConfig = {
    //     video: cameraEnabled,
    //     audio: microphoneEnabled
    // }

    console.log(cameraConfig)

    const [userMediaStream, userMediaRef] = useUserMedia(cameraConfig);

    function handleCanPlay(){
        userMediaRef.current.play()
    }

    const [peersData, setPeersData, addPeer, changePeerData, addPeers] = useObjectState()

    useEffect(() => {
        let peer = new Peer(undefined, peerOptions)
        let socket = io(connectConfig.socket_url)

        peer.on('open', (userId) => {
            socket.emit("join-room", roomId, userId)
            socket.on("take-existing-users-data", (data) => {
                data = JSON.parse(data);
                if(!data || !data.type) return;
                if(data.type === "user:existing-data"){
                    addPeers(data)
                }
            })
        })

        peer.on("call", (call) => {
            // call.answer(userMediaStream)
            // changePeerData(call.peer, "mediaConnection", call)
            // call.on('stream', (otherUserStream) => {
            //     changePeerData(call.peer, "mediaStream", otherUserStream)
            //     changePeerData(call.peer, "streamEnabled", true)
            // })
        })

        socket.on("data", (data) => {
            data = JSON.parse(data);
            if(!data || !data.type) return;
            if(data.type === "user:new-user-connected"){
                const { peerId: newPeerId, microphoneEnabled, cameraEnabled } = data.newUserData
                addPeer(newPeerId, { microphoneEnabled, cameraEnabled })
                // let call;
                // if(userMediaStream){
                //     call = peer.call(newPeerId, userMediaStream)
                // }else{
                //     call = peer.call(newPeerId, userMediaStream)
                //     console.log(call)
                // }
                // changePeerData(newPeerId, "mediaConnection", call)

                // call.on('stream', (mediaStream) => {
                //     console.log(mediaStream)
                //     // changePeerData(newPeerId, "mediaStream", mediaStream)
                //     // changePeerData(newPeerId, "streamEnabled", true)
                // })

                // call.on('close', () => {
                //     changePeerData(newPeerId, "streamEnabled", false)
                // })

                // call.on('error', (err) => {
                //     console.log(err)
                // })
            }
        })

    }, [])

    function handleClick(){
        console.log(userMediaStream)
    }

    return (
        <div>
            <video ref={userMediaRef} onCanPlay={handleCanPlay} muted autoPlay playsInline></video>
            <button onClick={handleClick}>click</button>
        </div>
    )
}