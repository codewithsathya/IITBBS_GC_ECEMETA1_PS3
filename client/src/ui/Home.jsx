import { useState } from "react";
import { Button } from "@material-tailwind/react/components/Button";
import ComplexNavbar from "../components/ComplexNavbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../actions/meeting";
import * as api from "../api"

export default function Home() {
  const navigate = useNavigate()
  if(localStorage.getItem("profile") && localStorage.getItem("cache-meeting-code")){
    navigate(`/meeting/${localStorage.getItem("cache-meeting-code")}`)
  }
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleMeeting = async () => {
    try {
      let { data } = await api.createMeeting();
      localStorage.setItem("meeting-details", JSON.stringify({data: data}))
      navigate("/lobby");
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <ComplexNavbar open={open} setOpen={setOpen} />
      <div id="home" className="h-[70vh] text-center">
        <div className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-center p-2">
          <div>
            {/* <p className="text-sm uppercase tracking-widest text-gray-600 dark:text-gray-100">
                        Experience seamless video meetings, without spending a penny
                    </p> */}
            <h1 className="text-3xl font-extrabold leading-9 text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              Experience seamless video meetings, without spending a penny
            </h1>
            <Button
              className="my-4 leading-6 font-semibold text-md"
              onClick={async () => {
                if (!user) {
                  setOpen(true);
                }else{
                  await handleMeeting()
                }
              }}
            >
              Create a meeting
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
