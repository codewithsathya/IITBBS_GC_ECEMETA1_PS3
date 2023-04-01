import { useEffect, useRef, useState } from "react";
import { createSocketConnectionInstance } from "../helpers/connection";
import VideoTile from "../components/VideoTile";

export default function Meeting(props){
    let connectionInstance = useRef(null)

    let [switcher, setSwitcher] = useState(false)

    const [cameraStatus, setCameraStatus] = useState(false);
    const [micStatus, setMicStatus] = useState(true);

    const [userDetails, setUserDetails] = useState({cameraEnabled: true, micEnabled: true});
    const [idStreamMap, setIdStreamMap] = useState(null)
    console.log(userDetails)

    const handleCamera = () => {
        const { toggleCamera } = connectionInstance.current
        toggleCamera({video: !cameraStatus, audio: micStatus})
        setCameraStatus(!cameraStatus)
    }

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

    const toggleScreenShare = () => {

    }
    return (
        <div>
            {idStreamMap && Object.keys(idStreamMap).map(id => <VideoTile stream={idStreamMap[id]} key={id} muted={connectionInstance.current.myId === id} /> )}
            <button onClick={handleCamera} switcher={`${switcher}`}>Screenshare</button>
        </div>
    )
}
