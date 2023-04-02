import Webcam from "react-webcam";
import Person from "../images/user.svg"

function WebcamComponent(){
    return (<div className="rounded-md p-1 bg-blue-gray-800">
        <Webcam />
    </div>)
}

function PersonAvatar(){
    return (
        <div className="flex justify-center">
            <img src={Person} alt="Person" width={500}/>
        </div>
    )
}

export default function SelfVideo({cameraTurnedOn}){
    return (
        <div className="w-[60vw] h-[70vh] md:h-[100vh] flex items-center justify-center">
            {cameraTurnedOn ? <WebcamComponent /> : <PersonAvatar />}
        </div>
    )
}