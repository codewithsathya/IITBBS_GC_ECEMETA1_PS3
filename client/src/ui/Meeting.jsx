import { useEffect, useRef, useState } from "react";
import { createSocketConnectionInstance } from "../helpers/connection";
import VideoTile from "../components/VideoTile";

import { BsMicFill, BsImage } from "react-icons/bs";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { AiOutlineUserAdd, AiFillSetting } from "react-icons/ai";
import ChatBox from "../components/ChatBox";
import "./VideoGrid.css";

export default function Meeting(props) {
  let connectionInstance = useRef(null);

  let [switcher, setSwitcher] = useState(false);

  const [cameraStatus, setCameraStatus] = useState(false);
  const [micStatus, setMicStatus] = useState(true);

  const [userDetails, setUserDetails] = useState({
    cameraEnabled: true,
    micEnabled: true,
  });
  const [idStreamMap, setIdStreamMap] = useState(null);
  console.log(userDetails);

  const handleCamera = () => {
    const { toggleCamera } = connectionInstance.current;
    toggleCamera({ video: !cameraStatus, audio: micStatus });
    setCameraStatus(!cameraStatus);
  };

  useEffect(() => {
    return () => {
      connectionInstance.current?.destroyConnection();
    };
  }, []);

  const updateUI = () => {
    setSwitcher(!switcher);
    const videoContainer = { ...connectionInstance.current.videoContainer };
    const map = {};
    for (let key of Object.keys(videoContainer)) {
      map[key] = videoContainer[key].stream;
    }
    setIdStreamMap(map);
  };

  useEffect(() => {
    connectionInstance.current = createSocketConnectionInstance(
      {
        updateInstance,
        userDetails,
      },
      updateUI
    );
  }, []);

  const updateInstance = (key, value) => {};

  const handleClick = () => {
    console.log(connectionInstance);
  };

  const toggleScreenShare = () => {};

  const [chatOpen, setChatOpen] = useState(false);
  const cameraTurnedOn = true;
  return (
    <div className="wrapper">
      <div className={chatOpen ? "chat" : "closed"}>
        {chatOpen && <ChatBox />}
      </div>
      <div>
        <div className={!chatOpen ? "grid-container" : "grid-container closed"}>
          <div className="pinned">
            {connectionInstance &&
              connectionInstance.current &&
              connectionInstance.current.myId &&
              idStreamMap &&
              idStreamMap[connectionInstance.current.myId] && (
                <VideoTile
                  stream={idStreamMap[connectionInstance.current.myId]}
                  className="pinned-video"
                  muted={true}
                />
              )}
          </div>
          <div className="unpinned">
            <div className="my-video">
              {connectionInstance &&
                connectionInstance.current &&
                connectionInstance.current.myId &&
                idStreamMap &&
                idStreamMap[connectionInstance.current.myId] && (
                  <VideoTile
                    stream={idStreamMap[connectionInstance.current.myId]}
                    muted={true}
                  />
                )}
            </div>
            <div className="other-videos">
              {idStreamMap &&
                Object.keys(idStreamMap).map((id) => {
                  if (connectionInstance.current.myId !== id)
                    return <VideoTile stream={idStreamMap[id]} key={id} />;
                })}
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
          <div
            className="p-4 border-opacity-50"
            onClick={() => setChatOpen(true)}
          >
            <BsMicFill />
          </div>
          <div className="p-4">
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
