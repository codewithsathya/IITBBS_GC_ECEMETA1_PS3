import React from "react";
import ChatBox from "./ChatBox";
import ChatList from "./ChatList";
import "./Test.css";

function Test() {
  return (
    <div className="box">
      <ChatList />
      <ChatBox />
    </div>
  );
}

export default Test;
