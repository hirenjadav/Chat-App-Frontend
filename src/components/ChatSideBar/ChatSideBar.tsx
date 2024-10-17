import { Button } from "primereact/button";
import FontIconWrapper from "../FontIconWrapper";
import "./ChatSideBar.scss";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userDetailsActions } from "../../state/userDetailsSlice";

interface ChatSideBarProps {
  selectedChatCategory: string;
  handleChatCategoryChange: any;
}

export default function ChatSideBar({
  selectedChatCategory,
  handleChatCategoryChange,
}: ChatSideBarProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    authService.doLogout();
    dispatch(userDetailsActions.setUserDetails(null));
    navigate("/auth/login");
  };

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-buttons">
        <Button
          text
          onClick={() => handleChatCategoryChange("chats")}
          tooltipOptions={{ disabled: selectedChatCategory == "chats" }}
          className={`sidebar-button ${
            selectedChatCategory == "chats" ? "active" : ""
          }`}
          tooltip="Chats"
        >
          <FontIconWrapper icon="fa-solid fa-message" />
        </Button>

        <Button
          text
          onClick={() => handleChatCategoryChange("groups")}
          tooltipOptions={{ disabled: selectedChatCategory == "groups" }}
          className={`sidebar-button ${
            selectedChatCategory == "groups" ? "active" : ""
          }`}
          tooltip="Groups"
        >
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button>

        {/* <Button
          text
          onClick={() => handleChatCategoryChange("channels")}
          tooltipOptions={{ disabled: selectedChatCategory == "channels" }}
          className={`sidebar-button ${
            selectedChatCategory == "channels" ? "active" : ""
          }`}
          tooltip="Channels"
        >
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button> */}
      </div>
      <div className="chat-sidebar-actions">
        <Button
          text
          onClick={handleLogout}
          className="sidebar-action-btn"
          tooltip="Logout"
        >
          <FontIconWrapper icon="fa-solid fa-arrow-right-from-bracket" />
        </Button>
      </div>
    </div>
  );
}
