import { useEffect, useRef, useState } from "react";
import "./SingleChat.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import FontIconWrapper from "../FontIconWrapper";
import { Avatar } from "primereact/avatar";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import { chatDetailsSelector } from "../../state/chatDetailsSlice";
import { ChatDetails } from "../../models/chatDetails.model";
import { userDetailsSelector } from "../../state/userDetailsSlice";
import { UserDetails } from "../../models/userDetails.model";
import { MESSAGE_TYPES } from "../../constants/messageTypes.constant";
import {
  MessageDetails,
  messageDetailsMapper,
} from "../../models/messageDetails.model";

export default function SingleChat() {
  const [messageTextField, setMessageTextField] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails
  );
  const chatDetails: ChatDetails | null = useSelector(
    chatDetailsSelector.chatDetails
  );

  useEffect(() => {
    if (chatDetails?.id) {
      const params = {
        conversationId: chatDetails.id,
      };

      setShowLoading(true);
      httpServices
        .get(API_ENDPOINT_CONSTANTS.MESSAGE_LIST, params)
        .then((response) => {
          if (response["status"] == "success") {
            const list: MessageDetails[] = response["data"].map((x) =>
              messageDetailsMapper(x)
            );
            setMessageList(list);
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
    }
  }, [chatDetails?.id]);

  const handleMessageSend = () => {
    const params = {
      conversationId: chatDetails.id,
      messageType: MESSAGE_TYPES.TEXT,
      message: messageTextField,
    };

    setShowLoading(true);
    httpServices
      .post(API_ENDPOINT_CONSTANTS.CREATE_MESSAGE, params)
      .then((response) => {
        if (response["status"] == "success") {
          setMessageTextField("");
          const message: MessageDetails = messageDetailsMapper(response.data);
          const list: MessageDetails[] = [...messageList];
          list.push(message);
          setMessageList(list);
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
  };

  return (
    <div className="single-chat-container">
      <SingleChatHeader conversationName={chatDetails?.name} />

      <div className="conversation-chats">
        {messageList.map((x: any) => {
          return (
            <div
              key={x.id}
              className={`single-message-item ${
                x.senderId != userDetails?.id ? "left-side" : "right-side"
              }`}
            >
              <div className="message-content">{x.message}</div>
              <div className="message-time">18:07</div>
            </div>
          );
        })}
      </div>

      <SingleChatInputField
        handleMessageSend={handleMessageSend}
        messageTextField={messageTextField}
        setMessageTextField={setMessageTextField}
      />
    </div>
  );
}

const SingleChatHeader = ({ conversationName }: any) => {
  return (
    <div className="conversation-header">
      <div className="conversation-header-picture">
        <Avatar
          label="V"
          size="large"
          shape="circle"
          style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
        />
      </div>
      <div className="conversation-header-name">{conversationName}</div>
      <div className="conversation-header-actions">
        <Button className="p-1" text>
          <FontIconWrapper icon="fa-solid fa-circle-info" />
        </Button>
      </div>
    </div>
  );
};

const SingleChatInputField = ({
  messageTextField,
  setMessageTextField,
  handleMessageSend,
}: {
  messageTextField: string;
  setMessageTextField: any;
  handleMessageSend: any;
}) => {
  return (
    <div>
      <div className="single-message-input-wrapper">
        <Button className="button-icon attachement" text>
          <FontIconWrapper icon="fa-solid fa-face-smile" />
        </Button>
        <InputText
          className="input-field"
          placeholder="Type a message"
          value={messageTextField}
          onChange={(e) => setMessageTextField(e.target.value)}
        />
        <Button className="button-icon emoji" text>
          <FontIconWrapper icon="fa-solid fa-paperclip" />
        </Button>
        <Button className="button-icon send" onClick={handleMessageSend}>
          <FontIconWrapper icon="fa-solid fa-arrow-right" />
        </Button>
      </div>
    </div>
  );
};
