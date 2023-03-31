import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ComplexNavbar from "./components/ComplexNavbar";
import Test from "./components/Test";
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
        <Route path="/" element={<Home />}/>
        <Route path="/lobby" element={<Lobby />}/>
        <Route path="/peers"  element={<Peers />}/>
        <Route path="/grid" element={<VideoGrid />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
