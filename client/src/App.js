import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ComplexNavbar from "./components/ComplexNavbar";
import Test from "./components/Test";
import Call from "./components/Videocall";
import { Button } from "@material-tailwind/react";
import Home from "./ui/Home";
import Lobby from "./ui/Lobby";
import Peers from "./ui/Peers";
import VideoGrid from "./ui/VideoGrid";

function App() {
  return (
    // <div>
    //   <ComplexNavbar />
    //   <Home />

    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/peers" element={<Peers />} />
        <Route path="/grid" element={<VideoGrid />} />
        <Route path="/test" element={<Test />} />
        <Route path="/" element={<Home />}/>
        <Route path="/lobby" element={<Lobby />}/>
        <Route path="/test" element={<Test />}/>
        <Route path="/call" element={<Call />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
