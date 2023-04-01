import io from "socket.io-client"
import Peer from "peerjs"
import config from "../config.json"

const connectConfig = config[config.env];
const peerOptions = {
    host: connectConfig.peer_server,
    port: connectConfig.peer_server_port,
    path: connectConfig.peer_server_path,
}

let socketInstance = null;
let peers = {}

const initializePeerConnection = () => {
    // return new Peer(undefined, peerOptions)
    return new Peer()
}

const initializeSocketConnection = () => {
    return io(connectConfig.socket_url)
}

class Connection{
    videoContainer = {};
    message = [];
    settings;
    streaming = false;
    screenStreaming = false;
    myPeer;
    socket;
    updateUI;
    myId = '';

    constructor(settings, updateUI) {
        this.settings = settings;
        this.updateUI = updateUI
        this.myPeer = initializePeerConnection();
        this.socket = initializeSocketConnection();
        this.initializeSocketEvents();
        this.initializePeerEvents();
    }

    initializeSocketEvents = () => {
        this.socket.on('connect', () => {
            console.log("Socket connected")
        })

        this.socket.on('user-disconnected', (userId) => {
            console.log('User disconnected: ', userId)
            this.removeVideo(userId)
        })

        this.socket.on('disconnect', () => {
            console.log("Socket disconnected")
        })

        this.socket.on('error', (err) => {
            console.log("Socket error: ", err)
        })

        this.socket.on('new-broadcast-message', (data) => {
            this.message.push(data);
            // this.settings.updateInstance('message', this.message)
        })

        // this.socket.on('')
    }

    initializePeerEvents = () => {
        this.myPeer.on('open', async (id) => {
            const { userDetails } = this.settings;
            this.myId = id
            const roomId = window.location.pathname.split('/')[2];
            const userData = {
                userId: id, roomId, ...userDetails
            }
            console.log("Joined the room: ", roomId, userData)
            this.socket.emit('join-room', userData)
            await this.setNavigator();
        })
        this.myPeer.on('error', (err) => {
            console.log('Peer connections error: ', err)
        })
    }

    setNavigator = async () => {
        const stream = await this.getMediaStream();
        if(stream){
            this.streaming = true;
            this.settings.updateInstance('streaming', true)
            this.createVideo({ userId: this.myId, stream });
            this.setPeerEventListeners(stream);
            this.newUserConnection(stream);
        }
    }

    enableScreenShare = async () => {
        const screenStream = await this.getScreenStream()
        if(screenStream){
            this.screenStreaming = true;
            this.createVideo({userId: this.myId, stream: screenStream, isScreenStream: true})
        }
    }

    getMediaStream = (video=true, audio=true) => {
        const myNavigator = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia;
        return myNavigator({video, audio})
    }

    getScreenStream = (video=true, audio=true) => {
        return navigator.mediaDevices.getDisplayMedia({audio: true, video: true})
    }

    setPeerEventListeners = (stream) => {
        this.myPeer.on("call", (call) => {
            call.answer(stream)
            call.on('stream', (userVideoStream) => {
                this.createVideo({userId: call.metadata.id, stream: userVideoStream})
            })
            call.on('close', () => {
                console.log('Closing peer: ', call.metadata.id)
                this.removeVideo(call.metadata.id)
            })
            call.on('error', (err) => {
                console.log('Peer error: ', err);
                this.removeVideo(call.metadata.id)
            })
            peers[call.metadata.id] = call;
        })
    }

    removeVideo = (userId) => {
        delete this.videoContainer[userId]
        this.updateUI()
    }

    newUserConnection = (stream) => {
        this.socket.on('new-user-connected', (userData) => {
            console.log("New user connected: ", userData)
            this.connectToNewUser(userData, stream)
        })
    }

    connectToNewUser(userData, stream){
        const { userId } = userData;
        console.log("Calling: ", userId)
        const call = this.myPeer.call(userId, stream, {metadata: {id: this.myId}})
        // old one calling new one and waiting
        call.on('stream', (userVideoStream) => {
            console.log("Getting stream")
            this.createVideo({userId, stream: userVideoStream, userData}, )
        })
        call.on('close', () => {
            console.log('Closing new user', userId);
            this.removeVideo(userId);
        });
        call.on('error', (err) => {
            console.log('peer error', err)
            this.removeVideo(userId);
        })
        peers[userId] = call;
    }

    createVideo(videoData){
        // if(videoData.isScreenStream){
        //     if(!this.videoContainer[videoData.userId]){
        //         this.videoContainer[videoData.userId] = { userId: videoData.userId }
        //     }
        //     this.videoContainer[videoData.userId].screenStream = videoData.stream
        // }else{
            this.videoContainer[videoData.userId] = {
                ...videoData
            }
        // }
        this.updateUI()
    }

    destroyConnection = () => {
        const myMediaTracks = this.videoContainer[this.myId]?.stream.getTracks();
        myMediaTracks?.forEach((track) => {
            track.stop();
        })
        socketInstance?.socket.disconnect();
        this.myPeer.destroy();

    }

    toggleCamera = (status) => {
        this.reInitializeStream(status.video, status.audio)
    }

    reInitializeStream = (video, audio, type='userMedia') => {
        const media = type === 'userMedia' ? this.getMediaStream(video, audio) : navigator.mediaDevices.getDisplayMedia(video, audio)
        return new Promise((resolve) => {
            media.then((stream) => {
                if(type === 'screenShare'){

                }
                this.createVideo({userId: this.myId, stream})
                replaceStream(stream)
                resolve(true)
            })
        })
    }
}

const replaceStream = (mediaStream) => {
    console.log(peers)
    Object.values(peers).map(peer => {
        peer.peerConnection?.getSenders().map(sender => {
            if(sender.track.kind === "audio"){
                if(mediaStream.getAudioTracks().length > 0){
                    sender.replaceTrack(mediaStream.getAudioTracks()[0]);
                }
            }
            if(sender.track.kind === "video"){
                if(mediaStream.getVideoTracks().length > 0){
                    sender.replaceTrack(mediaStream.getVideoTracks()[0]);
                }
            }
        })
    })
}

export function createSocketConnectionInstance(settings={}, updateUI) {
    return socketInstance = new Connection(settings, updateUI);
}