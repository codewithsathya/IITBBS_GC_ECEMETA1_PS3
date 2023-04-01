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
    return new Peer(undefined, peerOptions)
}

const initializeSocketConnection = () => {
    return io(connectConfig.socket_url)
}

class Connection{
    videoContainer = {};
    message = [];
    settings;
    streaming = false;
    myPeer;
    socket;
    myID = '';

    constructor(settings) {
        this.settings = settings;
        this.myPeer = initializePeerConnection();
        this.socket = initializeSocketConnection();
        this.initializeSocketEvents();
        this.initializePeersEvents();
    }

    initializeSocketEvents(){
        this.socket.on('connect', () => {
            console.log("Socket connected")
        })

        this.socket.on('user-disconnected', (userId) => {
            console.log('User disconnected: ', userId)
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

    initializePeerEvents(){
        this.myPeer.on('open', async (id) => {
            const { userDetails } = this.settings;
            this.myId = id
            const roomId = window.location.pathname.split('/')[2];
            const userData = {
                userId: id, roomId, ...userDetails
            }
            console.log("Joined the room: ", roomId, userData)
            this.socket.emit('join-room', userData)
        })
    }

    setNavigator = async () => {
        const stream = await this.getMediaStream();
        if(stream){
            this.streaming = true;
            this.settings.updateInstance('streaming', true)
            this.createVideo({ id: this.myId, stream });
            this.setPeerEventListeners(stream);
            this.newUserConnection(stream);
        }
    }

    getMediaStream = (video=true, audio=true) => {
        const myNavigator = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia;
        return myNavigator({video, audio})
    }

    setPeerEventListeners = (stream) => {
        this.myPeer.on('call', (call) => {
            call.answer(stream)
            call.on('stream', (userVideoStream) => {
                
            })
            call.on('close', () => {
                console.log('Closing peer: ', call.metadata.id)
            })
            call.on('error', (err) => {
                console.log('Peer error: ', err);
                // removeVideo(call.metadata.id)
            })
            peers[call.metadata.id] = call;
        })
    }

    newUserConnection = (stream) => {
        this.socket.on('new-user-connect', (userData) => {
            console.log("New user connected: ", userData)
            this.connectToNewUser(userData, stream)
        })
    }

    connectToNewUser(userData, stream){
        const { userId } = userData;
        const call = this.myPeer.call(userId, stream, {metadata: {id: this.myId}})
        call.on('stream', (userVideoStream) => {
            this.createVideo({id: userId, stream: userVideoStream, userData})
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
}

export function createSocketConnectionInstance(settings={}) {
    return socketInstance = new Connection(settings);
}