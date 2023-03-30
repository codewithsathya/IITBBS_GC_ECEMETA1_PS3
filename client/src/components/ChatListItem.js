import React from "react";
import "./ChatListItem.css";

export default function ChatListItem({ active }) {
  return (
    <div className="message-windows-container">
      <div className={active ? "message-window active" : "message-window"}>
        <div className="profile-image">
          <img src="https://via.placeholder.com/50" alt="Profile" />
        </div>
        <div className="message-content">
          <div className="sender-info">
            <h3 className="sender-name">John Doe</h3>
            <span className="message-time">3:30 PM</span>
          </div>
          <p className="message-preview">Hey, how are you doing?</p>
        </div>
      </div>
    </div>
  );
}
