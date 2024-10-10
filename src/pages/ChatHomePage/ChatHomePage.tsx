import "./ChatHomePage.scss";
import ChatList from "../../components/ChatList/ChatList";
import SingleChat from "../../components/SingleChat/SingleChat";
import ChatSideBar from "../../components/ChatSideBar/ChatSideBar";

export default function ChatHomePage() {
  

  return (
    <div className="min-vh-100 h-100 d-flex">
      <div className="chat-sidebar-container">
        <ChatSideBar />
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
