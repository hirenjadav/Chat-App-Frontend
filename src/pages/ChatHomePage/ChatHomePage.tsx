import React from "react";
import "./ChatHomePage.scss";
import ChatList from "../../components/ChatList/ChatList";
import SingleChat from "../../components/SingleChat/SingleChat";
import { Button } from "primereact/button";
import FontIconWrapper from "../../components/FontIconWrapper";

export default function ChatHomePage() {
  return (
    <div className="min-vh-100 h-100 d-flex">
      <div className="chat-sidebar-container">
        <Button text className="sidebar-button" tooltip="Chats">
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button>

        <Button text className="sidebar-button" tooltip="Groups">
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button>

        <Button text className="sidebar-button" tooltip="Channels">
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button>
      </div>
      <div className="chat-home-container">
        <div className="chat-list">
          <div>
            <h2 className="mb-3">CHAT APP</h2>
          </div>

          <ChatList />
        </div>
        <div className="single-chat">
          <SingleChat />
        </div>
      </div>
    </div>
  );
}
