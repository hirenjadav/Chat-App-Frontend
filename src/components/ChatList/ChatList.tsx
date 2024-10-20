import React, { useEffect, useRef, useState } from "react";
import "./ChatList.scss";
import { Toast } from "primereact/toast";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import CreateNewChat from "../CreateNewChat/CreateNewChat";
import { UserDetails } from "../../models/userDetails.model";
import { useSelector } from "react-redux";
import { userDetailsSelector } from "../../state/userDetailsSlice";
import {
  ChatListItem,
  ChatListItemMapper,
} from "../../models/chatListItem.model";
import { Avatar } from "primereact/avatar";
import { useNavigate } from "react-router-dom";
import { CONVERSATION_TYPES } from "../../constants/conversationTypes.constant";
import { Skeleton } from "primereact/skeleton";
import { socket } from "../../configs/socket.config";
import { MESSAGE_EVENTS } from "../../constants/websocketEvents.constant";
import { messageDetailsMapper } from "../../models/messageDetails.model";
import { ChatDetails } from "../../models/chatDetails.model";
import { chatDetailsSelector } from "../../state/chatDetailsSlice";
import { cloneDeep, findIndex } from "lodash";
import { Badge } from "primereact/badge";

interface ChatListProps {
  selectedChatCategory: string;
}

export default function ChatList({ selectedChatCategory }: ChatListProps) {
  const [showLoading, setShowLoading] = useState(false);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails
  );
  const chatDetails: ChatDetails | null = useSelector(
    chatDetailsSelector.chatDetails
  );

  useEffect(() => {
    const params: any = {};
    if (selectedChatCategory) {
      switch (selectedChatCategory) {
        case "groups":
          params["conversationType"] = CONVERSATION_TYPES.GROUP;
          break;

        case "channels":
          params["conversationType"] = CONVERSATION_TYPES.CHANNEL;
          break;
      }
    }

    setShowLoading(true);
    httpServices
      .get(API_ENDPOINT_CONSTANTS.CHAT_LIST, params)
      .then((response) => {
        if (response["status"] == "success") {
          const list: ChatListItem[] = response.data.map((x: any) =>
            ChatListItemMapper(x)
          );
          setChatList(list);
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
  }, [userDetails?.id, selectedChatCategory]);

  const handleChatSelection = (x: ChatListItem, index: number) => {
    const list = cloneDeep(chatList);
    list[index].unseenMessageCount = 0;
    setChatList(list);
    navigate("/chat/" + x.id);
  };

  useEffect(() => {
    const handleNewMessage = (newMessage: any) => {
      const mappedMessage = messageDetailsMapper(newMessage);
      const list = cloneDeep(chatList);
      const index = findIndex(
        list,
        (x) => x.id == mappedMessage.conversationId
      );
      if (index > -1) {
        list[index].latestMessage = mappedMessage;
        if (mappedMessage.conversationId != chatDetails?.id)
          list[index].unseenMessageCount++;
      }
      setChatList(list);
    };

    socket.on(MESSAGE_EVENTS.CHAT_LIST_NEW_MESSAGE, handleNewMessage);

    return () => {
      socket.off(MESSAGE_EVENTS.CHAT_LIST_NEW_MESSAGE, handleNewMessage);
    };
  });

  if (showLoading) {
    return (
      <div className="bg-white overflow-hidden p-3 rounded-5">
        <CreateNewChat inputDisabled={true} />

        <div className="chat-list-container">
          {[1, 1, 1, 1, 1, 1].map((x: number, i: number) => {
            return (
              <div
                key={i}
                className="d-flex column-gap-3 align-items-center mb-3"
              >
                <Skeleton
                  shape="circle"
                  size="3rem"
                  className="mr-2"
                ></Skeleton>
                <div>
                  <Skeleton width="10rem" className="mb-2"></Skeleton>
                  <Skeleton width="5rem" className="mb-2"></Skeleton>
                  <Skeleton height=".5rem"></Skeleton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden p-3 rounded-5">
      <CreateNewChat inputDisabled={false} />

      <div className="chat-list-container">
        {chatList.length > 0 &&
          chatList.map((x: ChatListItem, index: number) => {
            return (
              <React.Fragment key={x.id}>
                {index !== 0 && <hr key={`hr-${index}`} className="my-2" />}
                <button
                  key={`button-${x.id}`}
                  className="chat-list-single-item"
                  onClick={() => handleChatSelection(x, index)}
                >
                  <div key={`picture-${x.id}`} className="single-item-picture">
                    {x.profilePicture ? (
                      <img src={x.profilePicture} alt="Profile" />
                    ) : (
                      <Avatar
                        label={"X"}
                        size="large"
                        shape="circle"
                        style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                      />
                    )}
                  </div>
                  <div key={`details-${x.id}`} className="single-item-details">
                    <div className="single-item-details-name">{x.name}</div>
                    <div className="single-item-details-message">
                      {x.latestMessage?.message}
                    </div>
                  </div>
                  <div key={`status-${x.id}`} className="single-item-status">
                    <div className="single-item-status-time">
                      {x.latestMessage?.messageTime}
                    </div>
                    <div className="single-item-status-new-message">
                      {x.unseenMessageCount > 0 && (
                        <Badge value={x.unseenMessageCount}></Badge>
                      )}
                    </div>
                  </div>
                </button>
              </React.Fragment>
            );
          })}

        {chatList.length == 0 && (
          <p className="text-center">No result found.</p>
        )}
      </div>
    </div>
  );
}
