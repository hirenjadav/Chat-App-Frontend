import { useEffect, useRef, useState } from "react";
import "./SingleChat.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import FontIconWrapper from "../FontIconWrapper";
import { Avatar } from "primereact/avatar";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import {
  chatDetailsActions,
  chatDetailsSelector,
} from "../../state/chatDetailsSlice";
import { ChatDetails } from "../../models/chatDetails.model";
import { userDetailsSelector } from "../../state/userDetailsSlice";
import { UserDetails } from "../../models/userDetails.model";
import { MESSAGE_TYPES } from "../../constants/messageTypes.constant";
import {
  MessageDetails,
  messageDetailsMapper,
} from "../../models/messageDetails.model";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../configs/socket.config";
import { MESSAGE_EVENTS } from "../../constants/websocketEvents.constant";
import { Skeleton } from "primereact/skeleton";
import EmojiPicker from "emoji-picker-react";
import { OverlayPanel } from "primereact/overlaypanel";
import { MESSAGE_STATUS_TYPES } from "../../constants/messageStatusType";

export default function SingleChat() {
  const [messageTextField, setMessageTextField] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const { id: chatId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const divRef = useRef(null);
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails
  );
  const chatDetails: ChatDetails | null = useSelector(
    chatDetailsSelector.chatDetails
  );

  useEffect(() => {
    if (chatId) {
      fetchChatDetails();
    } else {
      dispatch(chatDetailsActions.setChatDetails(null));
    }

    return () => disconnectWebSocket();
  }, [chatId]);

  useEffect(() => {
    fetchMessageList();

    if (!chatDetails?.id) disconnectWebSocket();
  }, [chatDetails?.id]);

  const fetchMessageList = () => {
    if (!chatDetails?.id) return;

    const params = {
      conversationId: chatDetails.id,
    };

    setShowLoading(true);
    httpServices
      .get(API_ENDPOINT_CONSTANTS.MESSAGE_LIST, params)
      .then((response) => {
        if (response["status"] == "success") {
          const list: MessageDetails[] = response["data"].map((x: any) =>
            messageDetailsMapper(x)
          );
          setMessageList(list);
          scrollToBottom();
          connectWebSocket();
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

  const fetchChatDetails = () => {
    if (!chatId) return;

    setShowLoading(true);
    const params = {
      conversationId: chatId,
    };

    httpServices
      .get(API_ENDPOINT_CONSTANTS.CHAT_LIST, params)
      .then((response) => {
        if (response["status"] == "success") {
          if (response.data && response.data.length) {
            dispatch(chatDetailsActions.setChatDetails(response.data[0]));
          } else {
            navigate("/chat");
            dispatch(chatDetailsActions.setChatDetails(null));
          }
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

  const connectWebSocket = () => {
    socket.emit(MESSAGE_EVENTS.JOIN_CONVERSATION, chatDetails.id);

    socket.on(MESSAGE_EVENTS.RECIEVE_MESSAGE, (newMessage) =>
      addNewMessage(newMessage)
    );
  };

  const disconnectWebSocket = () => {
    if (socket.connected)
      socket.emit(MESSAGE_EVENTS.LEAVE_CONVERSATION, chatId);
  };

  const handleMessageSend = () => {
    if (!messageTextField.trim()) return;

    const params = {
      senderId: userDetails.id,
      conversationId: chatDetails.id,
      messageType: MESSAGE_TYPES.TEXT,
      message: messageTextField.trim(),
    };

    setMessageTextField("");
    socket.emit(MESSAGE_EVENTS.SEND_MESSAGE, params, (response: any) => {
      if (response.success) {
        addNewMessage(response.data);
      } else {
        console.error("Failed to send message:", response.error);
      }
    });
  };

  const addNewMessage = (newMessage: any) => {
    const mappedMessage = messageDetailsMapper(newMessage);
    setMessageList((prevMessages) => [...prevMessages, mappedMessage]);
    markMessagesSeen([mappedMessage]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  };

  const markMessagesSeen = (messages: MessageDetails[]) => {
    const params = {
      senderId: userDetails.id,
      status: MESSAGE_STATUS_TYPES.SEEN,
      conversationId: chatDetails.id,
      messageIds: messages.map((x) => x.id),
    };

    socket.emit(
      MESSAGE_EVENTS.UPDATE_MESSAGE_STATUS,
      params,
      (response: any) => {
        if (!response.success) {
          console.error("Failed to mark message seen:", response.error);
        }
      }
    );
  };

  if (!chatDetails?.id) {
    return (
      <div className="single-chat-container">
        <div className="align-self-center">START NEW CHAT</div>
      </div>
    );
  }

  return (
    <div className="single-chat-container">
      <SingleChatHeader conversationName={chatDetails?.name} />

      {showLoading ? (
        <div className="conversation-chats" ref={divRef}>
          {[
            true,
            true,
            false,
            true,
            false,
            false,
            true,
            false,
            true,
            false,
            false,
          ].map((x: any, i: number) => {
            return (
              <Skeleton
                key={i}
                className={`mb-3 ${x ? "ms-auto" : ""}`}
                height="1.5rem"
                width="65%"
                borderRadius="2rem"
                style={{ backgroundColor: "lightgray" }}
              ></Skeleton>
            );
          })}
        </div>
      ) : (
        <div className="conversation-chats" ref={divRef}>
          {messageList.map((x: MessageDetails) => {
            return (
              <div
                key={x.id}
                className={`single-message-item ${
                  x.senderId != userDetails?.id ? "left-side" : "right-side"
                }`}
              >
                <div className="message-content">{x.message}</div>
                <div className="message-time">{x.messageTime}</div>
              </div>
            );
          })}
        </div>
      )}

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
  const emojiOverlay = useRef(null);

  const handleKeyDown = (event: any) => {
    if (!event.shiftKey && !event.ctrlKey && event.key === "Enter")
      handleMessageSend();
  };

  return (
    <div>
      <div className="single-message-input-wrapper">
        <Button
          onClick={(e) => emojiOverlay.current.toggle(e)}
          className="button-icon attachement"
          text
        >
          <FontIconWrapper icon="fa-solid fa-face-smile" />
        </Button>
        <InputText
          className="input-field"
          placeholder="Type a message"
          onKeyDown={handleKeyDown}
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

      <OverlayPanel pt={{ content: { className: "p-0" } }} ref={emojiOverlay}>
        <EmojiPicker />
      </OverlayPanel>
    </div>
  );
};
