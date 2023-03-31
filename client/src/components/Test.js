import React, { useState, useEffect } from "react";
import ChatBox from "./ChatBox";
import ChatList from "./ChatList";
import "./Test.css";
import { Peer } from "peerjs";
import io from "socket.io-client";

import Button from "@material-tailwind/react/components/Button"

function Test() {
  const peers = {};
  const videoGrid = document.getElementById("video-grid");
  const myVideo = document.createElement("video");
  myVideo.muted = true;
  const peer = new Peer(undefined, {
    host: "localhost",
    port: 3000,
    path: "/peerjs/myapp",
  });

  let myVideoStream;
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      myVideoStream = stream;
      addVideoStream(myVideo, stream);
      peer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });
      socket.on("user-connected", (userID) => {
        connectToNewUser(userID, stream);
      });
    });
  
  const socket = io("http://localhost:3000");
  socket.on("connected", (args) => {
    console.log(args)
  });

  const onClick = () => {
    socket.emit("test")
  }

  socket.on("user-disconnected", (userID) => {
    console.log("user disconnected-- closing peers", userID);
    peers[userID] && peers[userID].close();
    removeVideo(userID);
  });

  socket.on("disconnected", () => {
    console.log("Disconnected");
  });
  
  socket.on("user-connected", (userID) => {
    console.log("user connected", userID);
    connectToNewUser(userID, myVideoStream);
  });

  const connectToNewUser = (userID, stream) => {
    console.log("connecting to new user", userID);
    const call = peer.call(userID, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();
    });
    peers[userID] = call;
  };

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGrid.append(video);
  };

  const removeVideo = (userID) => {
    const video = document.getElementById(userID);
    video.remove();
  };

  return (
    <div id="room-container">
      <Button onClick={onClick}>Click</Button>
      <div id="video-grid"></div>
    </div>
  );
}

export default Test;
