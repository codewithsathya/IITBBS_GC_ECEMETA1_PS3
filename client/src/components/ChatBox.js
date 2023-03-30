import React from "react";
import "./ChatBox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ChatBox() {
  return (
    <div className="chat-box">
      <div className="chat-window">
        <div className="chat-header">
          <div className="profile-image">
            <img src="https://via.placeholder.com/50" alt="Profile Image" />
          </div>
          <div className="user-info">
            <h3 className="user-name">John Doe</h3>
            <span className="user-status">Online</span>
          </div>
          <div className="menu-icon">
            <FontAwesomeIcon icon={faEllipsisV} />
          </div>
        </div>
        <div className="chat-body">
          <div className="chat-message">
            <div className="message-sender">
              <div className="sender-profile-image">
                <img src="https://via.placeholder.com/50" alt="Profile Image" />
              </div>
              <div className="sender-message">
                <p>Hi, how are you doing?</p>
              </div>
            </div>
            <div className="message-time">
              <span>3:35 PM</span>
            </div>
          </div>
          <div className="chat-message">
            <div className="message-recipient">
              <div className="recipient-message">
                <p>
                  Hey, I'm good. How about you? adsfjhsadjfnsdkj vksjbvninv sv
                  jvnsfvnsdkj vskjnisdjfiihds
                </p>
              </div>
            </div>
            <div className="message-time">
              <span>3:40 PM</span>
            </div>
          </div>
          <div className="chat-message">
            <div className="message-sender">
              <div className="sender-profile-image">
                <img src="https://via.placeholder.com/50" alt="Profile Image" />
              </div>
              <div className="sender-message">
                <p>I'm doing great, thanks for asking.</p>
              </div>
            </div>
            <div className="message-time">
              <span>3:42 PM</span>
            </div>
          </div>
        </div>
        <div className="chat-footer">
          <div className="input-box">
            <input type="text" placeholder="Type your message..." />
            <button className="send-icon">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
