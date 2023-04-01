import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Peer } from "peerjs";
import config from "../config.json";
import { BsMicFill, BsImage } from "react-icons/bs";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { AiOutlineUserAdd, AiFillSetting } from "react-icons/ai";
import "./VideoGrid.css";
import VideoTile from "../components/VideoTile";
import useUserMedia from "../hooks/useUserMedia";
import "./VideoGrid.css";
import ChatBox from "../components/ChatBox";

const connectConfig = config[config.env];
const cameraConfig = {
  video: true,
  audio: true,
};

function addVideoStream(stream, setPeerVideos, call) {
  setPeerVideos((prevVal) => {
    return { ...prevVal, [call.connectionId]: { stream, call } };
  });
}

function connectToNewUser(myPeer, stream, userId, setPeerVideos) {
  const call = myPeer.call(userId, stream);
  call.on("stream", (userVideoStream) => {
    console.log("connect to new user call stream");
    addVideoStream(userVideoStream, setPeerVideos, call);
  });

  call.on("close", () => {
    console.log("remove video");
    setPeerVideos((prevVal) => {
      let filteredKeys = Object.keys(prevVal).filter(
        (value) => value !== call.connectionId
      );
      let result = {};
      for (let key of filteredKeys) {
        result[key] = prevVal[key];
      }
      return result;
    });
  });
}

export default function VideoGrid() {
  const [renderCount, setRenderCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  const videoRef = useRef();
  const mediaStream = useUserMedia({
    video: true,
    audio: true,
  });
  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    videoRef.current.play();
  }

  const [peerVideos, setPeerVideos] = useState({});

  useEffect(() => {
    if (renderCount === 0) {
      const socket = io(connectConfig.socket_url);
      const myPeer = new Peer(undefined, {
        host: connectConfig.peer_server,
        port: connectConfig.peer_server_port,
        path: connectConfig.peer_server_path,
      });

      navigator.mediaDevices.getUserMedia(cameraConfig).then((stream) => {
        myPeer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userVideoStream) => {
            addVideoStream(userVideoStream, setPeerVideos, call);
          });
        });

        socket.on("user-connected", (userId) => {
          console.log(userId);
          connectToNewUser(myPeer, stream, userId, setPeerVideos);
        });
      });

      socket.on("user-disconnected", (userId) => {
        console.log("user-disconnected");
        console.log(userId);
        setPeerVideos((prevVal) => {
          return prevVal;
          // let filteredKeys = Object.keys(prevVal).filter((value) => value !== peers[userId].connectionId)
          // let result = {}
          // for(let key of filteredKeys){
          //   result[key] = prevVal[key]
          // }
          // return result
        });
        // if (peers[userId]) peers[userId].close();
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
    setChatOpen(!chatOpen);
    console.log("toggle camera");
  };

  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="wrapper">
      <div className={chatOpen ? "chat" : "closed"}>
        {chatOpen && <ChatBox />}
      </div>
      <div>
        <div className={!chatOpen ? "grid-container" : "grid-container closed"}>
          <div className="pinned">
            <video
              ref={videoRef}
              onCanPlay={handleCanPlay}
              muted
              autoPlay
              playsInline
              className="pinned-video"
            />
          </div>
          <div className="unpinned">
            <div className="my-video">
              {videoRef.current && (
                <VideoTile stream={videoRef.current.srcObject} />
              )}
            </div>
            <div className="other-videos">
              {arr.map((value) => {
                return (
                  videoRef.current && (
                    <VideoTile
                      key={value}
                      stream={videoRef.current.srcObject}
                    />
                  )
                );
              })}
              {/* {Object.keys(peerVideos).map((connectionId) => {
            let stream = peerVideos[connectionId].stream;
            return <VideoTile stream={stream} key={connectionId} />;
          })} */}
            </div>
          </div>
        </div>
        <div
          className={
            chatOpen
              ? "flex items-center justify-center py-1 bg-gray-300 rounded-lg object-fill mx-1 closed"
              : "flex items-center justify-center py-1 bg-gray-300 rounded-lg object-fill mx-1"
          }
        >
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
    </div>
  );
}
