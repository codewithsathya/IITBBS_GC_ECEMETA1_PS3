import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Peer } from "peerjs";
import config from "../config.json";
import { BsMicFill, BsImage } from "react-icons/bs";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { AiOutlineUserAdd, AiFillSetting } from "react-icons/ai";
import "./VideoGrid.css";
import VideoTile from "../components/VideoTile";

const connectConfig = config[config.env];

function addVideoStream(stream, setPeerVideos, call) {
  console.log("id", call)
  setPeerVideos((prevVal) => {return {...prevVal, [call.connectionId]: stream}});
}

function connectToNewUser(
  setPeers,
  peers,
  myPeer,
  stream,
  userId,
  setPeerVideos
) {
  const call = myPeer.call(userId, stream);
  call.on("stream", (userVideoStream) => {
    console.log("connect to new user call stream");
    addVideoStream(userVideoStream, setPeerVideos, call);
  });

  call.on("close", () => {
    console.log("remove video");
    setPeerVideos((prevVal) =>  delete prevVal[call.connectionId]);
  });
  setPeers({ ...peers, [userId]: call });
}

export default function VideoGrid() {
  const [renderCount, setRenderCount] = useState(0);
  const [peers, setPeers] = useState({});
  const ref = useRef(null);
  const [myVideo, setMyVideo] = useState({ ref });
  // const [myVideo, setMyVideo] = useMyVideo()
  const [peerVideos, setPeerVideos] = useState({});

  useEffect(() => {
    if (renderCount === 0) {
      const socket = io(connectConfig.socket_url);
      const myPeer = new Peer(undefined, {
        host: connectConfig.peer_server,
        port: connectConfig.peer_server_port,
        path: connectConfig.peer_server_path,
      });
      //   const myVideo = document.createElement("video");
      //   myVideo.muted = true;

      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          //   addVideoStream(stream);
          setMyVideo({ ref, stream });
          console.log(stream);
          myPeer.on("call", (call) => {
            console.log("peer call");
            console.log(call);
            call.answer(stream);
            // const userVideo = document.createElement("video");
            call.on("stream", (userVideoStream) => {
              console.log("peer stream");
              console.log(userVideoStream);
              addVideoStream(userVideoStream, setPeerVideos, call);
            });
          });

          socket.on("user-connected", (userId) => {
            console.log("user connected");
            connectToNewUser(
              setPeers,
              peers,
              myPeer,
              stream,
              userId,
              setPeerVideos,
            );
          });
        });

      socket.on("user-disconnected", (userId) => {
        console.log("user-disconnected");
        if (peers[userId]) peers[userId].close();
      });

      myPeer.on("open", (id) => {
        console.log("peer open");
        socket.emit("join-room", "kjakalkekksds", id);
      });

      setRenderCount(renderCount + 1);
    }
  }, []);

  const cameraTurnedOn = true;
  const toggleCamera = () => {
    console.log("toggle camera");
  };

  useEffect(() => {
    if (myVideo.stream) {
      const video = myVideo.ref.current;
      if(video == null) return;
      video.srcObject = myVideo.stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }
  }, [myVideo]);


  return (
    <div>
      <div id="video-grid" className="grid-container">
        <video ref={myVideo.ref} muted />
        {Object.keys(peerVideos).map(connectionId => {
          let stream = peerVideos[connectionId]
          return(
          <VideoTile stream={stream} key={connectionId}/>
        )})}
      </div>
      <div className="flex items-center justify-center py-2">
        <div className="p-4 border-opacity-50">
          <BsMicFill />
        </div>
        <div className="p-4" onClick={toggleCamera}>
          {!cameraTurnedOn ? <FaVideo /> : <FaVideoSlash />}
        </div>
        <div className="p-4">
          <AiOutlineUserAdd />
        </div>
        <div className="p-4">
          <BsImage />
        </div>
        <div className="p-4">
          <AiFillSetting />
        </div>
      </div>
    </div>
  );
}
