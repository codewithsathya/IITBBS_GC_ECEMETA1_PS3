import { useEffect, useRef } from "react"

export default function VideoTile({ stream, muted }){
    const ref = useRef()
    useEffect(() => {
        if (stream) {
            const video = ref.current;
            video.srcObject = stream;
            video.addEventListener("loadedmetadata", () => {
                video.play();
            });
        }
    }, [stream])
    return (
        <video ref={ref} muted={muted}></video>
    )
}