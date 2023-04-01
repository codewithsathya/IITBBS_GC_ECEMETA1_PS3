import { useEffect, useRef, useState } from "react";

export default function useUserMedia(requestedMedia){
    const [mediaStream, setMediaStream] = useState(null)
    useEffect(() => {
        async function enableStream(){
            try{
                const stream = await navigator.mediaDevices.getUserMedia(requestedMedia)
                setMediaStream(stream)
            }catch(err){

            }
        }

        if(!mediaStream){
            enableStream()
        }else{
            return function cleanup(){
                mediaStream.getTracks().forEach(track => {
                    // track.stop()
                })
            }
        }
    }, [mediaStream, requestedMedia])
    return mediaStream;

    // const ref = useRef(null);
    // const [myVideo, setMyVideo] = useState({ ref })
    // useEffect(() => {
    //     if(myVideo.stream){
    //         const video = myVideo.ref.current;
    //         video.srcObject = myVideo.stream;
    //         video.addEventListener("loadedmetadata", () => {
    //             video.play()
    //         })
    //     }
    // }, [myVideo])
    // return [myVideo, setMyVideo]
}