import { useEffect, useRef, useState } from "react";
import "./SingleChat.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import FontIconWrapper from "../FontIconWrapper";
import { Avatar } from "primereact/avatar";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

export default function SingleChat() {
  const [messageTextField, setMessageTextField] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData")!);

  useEffect(() => {
    setShowLoading(true);
    httpServices
      .get(API_ENDPOINT_CONSTANTS.CHATS)
      .then((response) => {
        if (response["status"] == "success") {
          setMessageList(response["data"]);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: response?.data?.errorDescription
              ? response?.data?.errorDescription
              : "Something Went Wrong",
          });
        }
      })
      .finally(() => setShowLoading(false));
  }, [userData.id]);

  return (
    <div className="single-chat-container">
      <div className="conversation-header">
        <div className="conversation-header-picture">
          <Avatar
            label="V"
            size="large"
            shape="circle"
            style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
          />
        </div>
        <div className="conversation-header-name">Conversation Name</div>
        <div className="conversation-header-actions">
          <Button className="p-1" text>
            <FontIconWrapper icon="fa-solid fa-circle-info" />
          </Button>
        </div>
      </div>

      <div className="conversation-chat">User Chat</div>

      <div>
        <div className="single-message-input-wrapper">
          <Button className="button-icon attachement" text>
            <FontIconWrapper icon="fa-solid fa-paperclip" />
          </Button>
          <InputText
            className="input-field"
            placeholder="Type a message"
            value={messageTextField}
            onChange={(e) => setMessageTextField(e.target.value)}
          />
          <Button className="button-icon emoji" text>
            <FontIconWrapper icon="fa-solid fa-face-smile" />
          </Button>
          <Button className="button-icon send">
            <FontIconWrapper icon="fa-solid fa-arrow-right" />
          </Button>
        </div>
      </div>
    </div>
  );
}
