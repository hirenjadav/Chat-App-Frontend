import { Button } from "primereact/button";
import React, { useState } from "react";
import FontIconWrapper from "../FontIconWrapper";
import "./ChatSideBar.scss";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userDetailsActions } from "../../state/userDetailsSlice";

export default function ChatSideBar() {
  const [currentTab, setCurrentTab] = useState("chats");
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
          onClick={() => setCurrentTab("chats")}
          tooltipOptions={{ disabled: currentTab == "chats" }}
          className={`sidebar-button ${currentTab == "chats" ? "active" : ""}`}
          tooltip="Chats"
        >
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button>

        <Button
          text
          onClick={() => setCurrentTab("groups")}
          tooltipOptions={{ disabled: currentTab == "groups" }}
          className={`sidebar-button ${currentTab == "groups" ? "active" : ""}`}
          tooltip="Groups"
        >
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button>

        <Button
          text
          onClick={() => setCurrentTab("channels")}
          tooltipOptions={{ disabled: currentTab == "channels" }}
          className={`sidebar-button ${
            currentTab == "channels" ? "active" : ""
          }`}
          tooltip="Channels"
        >
          <FontIconWrapper icon="fa-solid fa-user-group" />
        </Button>
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
