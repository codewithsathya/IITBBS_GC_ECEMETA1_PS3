import { Button, Input } from "@material-tailwind/react";
import SelfVideo from "./SelfVideo";
import { BsMicFill, BsImage } from "react-icons/bs";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { AiOutlineUserAdd, AiFillSetting } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const [cameraTurnedOn, setCamera] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleCamera = () => {
    if (cameraTurnedOn) {
      setCamera(false);
    } else {
      setCamera(true);
    }
  };

  const navigate = useNavigate();

  return (
    <div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Invite</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    I always felt like I could do anything. That’s the main
                    thing people are controlled by! Thoughts- their perception
                    of themselves! They're slowed down by their perception of
                    themselves. If you're taught you can’t do anything, you
                    won’t do anything. I was taught I could do everything.
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <SelfVideo isTurnedOn={cameraTurnedOn} />
        <div className="p-4 flex flex-col items-center justify-center h-[30vh] md:h-[100vh] bg-white">
          <div className=" text-blue-gray-900 text-2xl">Join meeting</div>
          <div className="my-4">
            <Input
              variant="outlined"
              label="Enter your name"
              className=" bg-white w-[90vw] md:w-[270px]"
              size="lg"
            />
          </div>
          <div>
            <Button
              size="md"
              className="w-[90vw] md:w-[270px]"
              onClick={() => navigate("/grid")}
            >
              Join meeting
            </Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="p-4 border-opacity-50">
              <BsMicFill />
            </div>
            <div className="p-4" onClick={toggleCamera}>
              {!cameraTurnedOn ? <FaVideo /> : <FaVideoSlash />}
            </div>
            <div className="p-4" onClick={() => setShowModal(true)}>
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
    </div>
  );
}
