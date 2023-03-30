import React from "react";
import "./ChatList.css";
import ChatListItem from "./ChatListItem";

export default function ChatList() {
  return (
    <div className="chat-list">
      <ChatListItem active={false} />
      <ChatListItem active={true} />
      <ChatListItem active={false} />
    </div>
  );
}
