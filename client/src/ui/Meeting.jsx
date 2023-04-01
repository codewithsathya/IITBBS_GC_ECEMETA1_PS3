import { useEffect, useRef, useState } from "react";
import { createSocketConnectionInstance } from "../helpers/connection";
import VideoTile from "../components/VideoTile";

export default function Meeting(props) {
  let connectionInstance = useRef(null);
  let [switcher, setSwitcher] = useState(false);

  const [userDetails, setUserDetails] = useState({
    cameraEnabled: true,
    micEnabled: true,
  });
  const [idStreamMap, setIdStreamMap] = useState(null);
  console.log(userDetails);

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

  return (
    <div>
      {idStreamMap &&
        Object.keys(idStreamMap).map((id) => (
          <VideoTile stream={idStreamMap[id]} key={id} />
        ))}
      <button onClick={handleClick} switcher={`${switcher}`}>
        click
      </button>
    </div>
  );
}
