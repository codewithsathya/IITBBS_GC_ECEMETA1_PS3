import React, { useState, useEffect } from "react";
import "./ChatBox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ChatBox(props) {
  const [message, setMessage] = useState("");
  const profile = JSON.parse(localStorage.getItem("profile"));

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chat-box">
      <div className="chat-window">
        <div className="chat-header">
          <div className="profile-image">
            <img src="https://via.placeholder.com/50" alt="Profile Image" />
          </div>
          <div className="user-info">
            <h3 className="user-name">John Doe</h3>
            <span className="user-status">
              The current time is: {time.toLocaleTimeString()}
            </span>
          </div>
          <div className="menu-icon">
            <FontAwesomeIcon icon={faEllipsisV} />
          </div>
        </div>
        <div className="chat-body">
          {props.messages.map((message, idx) => {
            if (message.profile.data.email === profile.data.email) {
              return (
                <div className="chat-message" key={idx}>
                  <div className="recipient-message">
                    <p>{message.message}</p>
                  </div>
                  <div className="message-time">
                    <span>{message.time}</span>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="chat-message" key={idx}>
                  <div className="message-sender">
                    <div className="sender-profile-image">
                      <img src="https://via.placeholder.com/50" alt="Profile" />
                    </div>
                    <div className="sender-message">
                      <p>{message.message}</p>
                    </div>
                  </div>
                  <div className="message-time">
                    <span>{message.time}</span>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="chat-footer">
          <div className="input-box">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="send-icon"
              onClick={() => {
                if (props.connectionInstance) {
                  props.connectionInstance.socket.emit("message", {
                    profile,
                    message,
                    time: time.toLocaleTimeString(),
                  });
                  setMessage("");
                  props.setMessages((prev) => [
                    ...prev,
                    { profile, message, time: time.toLocaleTimeString() },
                  ]);
                }
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
