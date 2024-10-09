import React from "react";
import "./ChatHomePage.scss";
import ChatList from "../../components/ChatList/ChatList";
import SingleChat from "../../components/SingleChat/SingleChat";

export default function ChatHomePage() {
  return (
    <div>
      <div className="row">
        <div className="col-12 col-sm-3">
          <ChatList />
        </div>
        <div className="col-12 col-sm-9">
          <SingleChat />
        </div>
      </div>
    </div>
  );
}
