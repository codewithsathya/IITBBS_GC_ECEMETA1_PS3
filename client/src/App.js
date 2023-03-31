import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ComplexNavbar from "./components/ComplexNavbar";
import Test from "./components/Test";
import { Button } from "@material-tailwind/react";
import Home from "./ui/Home";
import Lobby from "./ui/Lobby";


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
      </Routes>
    </BrowserRouter>
  )
}

export default App;
