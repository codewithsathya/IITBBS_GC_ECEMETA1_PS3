import { Button, Input } from "@material-tailwind/react";
import SelfVideo from "./SelfVideo";
import { BsMicFill, BsImage } from "react-icons/bs"
import { FaVideo, FaVideoSlash } from "react-icons/fa"
import { AiOutlineUserAdd, AiFillSetting } from "react-icons/ai"
import { useState } from "react";

export default function Lobby(){
    const [cameraTurnedOn, setCamera] = useState(false)

    const toggleCamera = () => {
        if(cameraTurnedOn){
            setCamera(false)
        }else{
            setCamera(true)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2">
            <SelfVideo isTurnedOn={cameraTurnedOn}/>
            <div className="p-4 flex flex-col items-center justify-center h-[30vh] md:h-[100vh] bg-white">
                <div className=" text-blue-gray-900 text-2xl">Join meeting</div>
                <div className="my-4">
                    <Input variant="outlined" label="Enter your name" className=" bg-white w-[90vw] md:w-[270px]" size="lg"/>
                </div>
                <div>
                    <Button size="md" className="w-[90vw] md:w-[270px]">Join meeting</Button>
                </div>
                <div className="flex items-center justify-between py-2">
                    <div className="p-4 border-opacity-50"><BsMicFill /></div>
                    <div className="p-4" onClick={toggleCamera}>{!cameraTurnedOn ? <FaVideo /> : <FaVideoSlash />}</div>
                    <div className="p-4"><AiOutlineUserAdd /></div>
                    <div className="p-4"><BsImage /></div>
                    <div className="p-4"><AiFillSetting /></div>
                </div>
            </div>
        </div>
    )
}