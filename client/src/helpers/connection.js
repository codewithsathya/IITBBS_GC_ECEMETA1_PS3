import io from "socket.io-client";
import Peer from "peerjs";
import config from "../config.json";

const connectConfig = config[config.env];
const peerOptions = {
  host: connectConfig.peer_server,
  port: connectConfig.peer_server_port,
  path: connectConfig.peer_server_path,
};

let socketInstance = null;
let peers = {};

const initializePeerConnection = () => {
  // return new Peer(undefined, peerOptions)
  return new Peer();
};

const initializeSocketConnection = () => {
  return io(connectConfig.socket_url);
};

class Connection {
    videoContainer = {};
    screenShareContainer = {};
    message = [];
    settings;
    streaming = false;
    screenStreaming = false;
    myPeer;
    screenSharePeer;
    socket;
    updateUI;
    updateMessage;
    myId = "";

    constructor(settings, updateUI, updateMessage) {
      this.settings = settings;
      this.updateUI = updateUI;
      this.updateMessage = updateMessage;
      this.myPeer = initializePeerConnection();
      this.screenSharePeer = initializePeerConnection();
      this.socket = initializeSocketConnection();
      this.initializeSocketEvents();
      this.initializePeerEvents();
    }

    initializeSocketEvents = () => {
      this.socket.on("connect", () => {
        console.log("Socket connected");
      });
      this.socket.on("user-disconnected", (userId) => {
        console.log("User disconnected: ", userId);
        this.removeVideo(userId);
      });
      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      this.socket.on("error", (err) => {
        console.log("Socket error: ", err);
      });
      this.socket.on("new-broadcast-message", (data) => {
        this.message.push(data);
        // this.settings.updateInstance('message', this.message)
      });
      this.socket.on("new-screenshare-started", (userData) => {
        const userId = userData.userId;
        Object.keys(peers).map(peer => {
          console.log(peer.peerConnection?.getSenders())
        })
      })
      // this.socket.on('')
    };

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
      try {
        const stream = await getMediaStream(true, true)
        if(stream){
            this.streaming = true;
            this.settings.updateInstance('streaming', true)
            this.createVideo({ userId: this.myId, stream });
            if(this.settings.userSettings){
              if(!this.settings.userSettings.cameraEnabled){
                this.disableCamera();
              }else if(!this.settings.userSettings.micEnabled){
                this.disableMic();
              }
            }
            this.setPeerEventListeners(stream);
            this.newUserConnection(stream);
        }
      } catch (error) {
        window.location.href = "/"
      }
    }

    broadcastMessage = (message) => {
      this.message.push(message);
      this.socket.emit('broadcast-message', message);
    }

    setPeerEventListeners = (stream) => {
      this.myPeer.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (userVideoStream) => {
          this.createVideo({ userId: call.metadata.id, stream: userVideoStream });
        });
        call.on("close", () => {
          console.log("Closing peer: ", call.metadata.id);
          this.removeVideo(call.metadata.id);
        });
        call.on("error", (err) => {
          console.log("Peer error: ", err);
          this.removeVideo(call.metadata.id);
        });
        peers[call.metadata.id] = call;
      });
    };

    removeVideo = (userId) => {
      delete this.videoContainer[userId];
      this.updateUI();
    };

    newUserConnection = (stream) => {
      this.socket.on("new-user-connected", (userData) => {
        console.log("New user connected: ", userData);
        this.connectToNewUser(userData, stream);
      });
    };

    connectToNewUser(userData, stream) {
      const { userId } = userData;
      console.log("Calling: ", userId);
      const call = this.myPeer.call(userId, stream, {
        metadata: { id: this.myId },
      });
      // old one calling new one and waiting
      call.on("stream", (userVideoStream) => {
        console.log("Getting stream");
        this.createVideo({ userId, stream: userVideoStream, userData });
      });
      call.on("close", () => {
        console.log("Closing new user", userId);
        this.removeVideo(userId);
      });
      call.on("error", (err) => {
        console.log("peer error", err);
        this.removeVideo(userId);
      });
      peers[userId] = call;
    }

    createVideo(videoData) {
      if(videoData.isScreenStream){
          this.screenShareContainer[videoData.userId] = {
            ...videoData
          }
      }else{
        this.videoContainer[videoData.userId] = {
          ...videoData,
        };
      }
      this.updateUI();
    }

    destroyConnection = () => {
      const myMediaTracks = this.videoContainer[this.myId]?.stream.getTracks();
      myMediaTracks?.forEach((track) => {
        track.stop();
      });
      socketInstance?.socket.disconnect();
      this.myPeer.destroy();
    };

    enableScreenShare = async () => {
      const screenStream = await getScreenStream();
      if (screenStream) {
        this.screenStreaming = true;
        // this.createVideo({
        //   userId: this.myId,
        //   stream: screenStream,
        //   isScreenStream: true,
        // });
        const userStream = this.videoContainer[this.myId].stream
        const screenTracks = screenStream.getVideoTracks()

        replaceStream(screenStream)
        this.socket.emit("screenshare-started")
      }

    };

    disableScreenShare = async () => {
      const userStream = await getMediaStream();
      if(userStream){
        this.screenStreaming = false;
        replaceStream(userStream)
        this.socket.emit("screenshare-ended")
      }
    }

    toggleCamera = (status) => {
        if(!status.video){
          this.disableCamera();
        }else{
          this.enableCamera();
        }
    }

    enableCamera = () => {
      navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(newStream => {
        const oldStream = this.videoContainer[this.myId].stream
        const videoTracks = newStream.getVideoTracks()
        const oldVideoTracks = oldStream.getVideoTracks()
        oldStream.removeTrack(oldVideoTracks[0])
        oldStream.addTrack(videoTracks[0])

        Object.values(peers).forEach(peer => {
          peer.peerConnection?.getSenders().forEach(sender => {
            if(sender.track && sender.track.kind === 'video'){
              sender.replaceTrack(videoTracks[0])
            }
          })
        })
      })
    }

    disableCamera = () => {
      const stream = this.videoContainer[this.myId].stream
      const videoTracks = stream.getVideoTracks()
      videoTracks[0].stop();
    }

    toggleMic = (status) => {
        if(!status.audio){
          this.disableMic();
        }else{
          this.enableMic()
        }
    }

    enableMic = () => {
      navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(newStream => {
        const oldStream = this.videoContainer[this.myId].stream
        const audioTracks = newStream.getAudioTracks()
        const oldAudioTracks = oldStream.getAudioTracks()
        oldStream.removeTrack(oldAudioTracks[0])
        oldStream.addTrack(audioTracks[0])

        Object.values(peers).forEach(peer => {
          peer.peerConnection?.getSenders().forEach(sender => {
            if(sender.track && sender.track.kind === 'audio'){
              sender.replaceTrack(audioTracks[0])
            }
          })
        })
      })
    }

    disableMic = () =>{
      const stream = this.videoContainer[this.myId].stream
      const audioTracks = stream.getAudioTracks()
      audioTracks[0].stop();
    }

    toggleScreenShare = (status) => {
      if(status){
        this.enableScreenShare()
      }else{
        this.disableScreenShare()
      }
    }

    reInitializeStream = (video, audio, type = "userMedia") => {
      const media =
        type === "userMedia"
          ? getMediaStream(video, audio)
          : navigator.mediaDevices.getDisplayMedia(video, audio);
      return new Promise((resolve) => {
        media.then((stream) => {
          if (type === "screenShare") {
          }
          this.createVideo({ userId: this.myId, stream });
          replaceStream(stream);
          resolve(true);
        });
      });
    }
}

const getScreenStream = (video = true, audio = true) => {
  return navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
};


const getMediaStream = (video = true, audio = true) => {
  const myNavigator =
    navigator.mediaDevices.getUserMedia ||
    navigator.mediaDevices.webkitGetUserMedia ||
    navigator.mediaDevices.mozGetUserMedia ||
    navigator.mediaDevices.msGetUserMedia;
  return myNavigator({ video, audio });
};

const replaceStream = (mediaStream) => {
  console.log(peers);
  Object.values(peers).map((peer) => {
    peer.peerConnection?.getSenders().map((sender) => {
      if (sender.track.kind === "audio") {
        if (mediaStream.getAudioTracks().length > 0) {
          sender.replaceTrack(mediaStream.getAudioTracks()[0]);
        }
      }
      if (sender.track.kind === "video") {
        if (mediaStream.getVideoTracks().length > 0) {
          sender.replaceTrack(mediaStream.getVideoTracks()[0]);
        }
      }
    });
  });
};

export function createSocketConnectionInstance(
  settings,
  updateUI,
  updateMessage
) {
  return new Connection(settings, updateUI, updateMessage);
}
