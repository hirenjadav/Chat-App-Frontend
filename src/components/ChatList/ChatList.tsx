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

interface ChatListProps {
  selectedChatCategory: string;
}

export default function ChatList({ selectedChatCategory }: ChatListProps) {
  const [showLoading, setShowLoading] = useState(false);
  const [chatList, setChatList] = useState([]);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails
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

  const handleChatSelection = (x: ChatListItem) => {
    navigate("/chat/" + x.id);
  };

  if (showLoading) {
    return (
      <div className="bg-white overflow-hidden p-3 rounded-5">
        <CreateNewChat inputDisabled={true} />

        <div className="chat-list-container">
          {[1, 1, 1, 1, 1, 1].map((x) => {
            return (
              <div className="d-flex column-gap-3 align-items-center mb-3">
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
          chatList.map((x: any, index: number) => {
            return (
              <>
                {index != 0 && <hr className="my-2" />}

                <button
                  key={x.id}
                  className="chat-list-single-item"
                  onClick={() => handleChatSelection(x)}
                >
                  <div className="single-item-picture">
                    {x.profilePicture ? (
                      <img src={x.profilePicture} />
                    ) : (
                      <Avatar
                        label={"X"}
                        size="large"
                        shape="circle"
                        style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                      />
                    )}
                  </div>
                  <div className="single-item-details">
                    <div className="single-item-details-name">{x.name}</div>
                    <div className="single-item-details-message">
                      {x.latestMessage?.message}
                    </div>
                  </div>
                  <div className="single-item-status">
                    <div className="single-item-status-time">
                      {x.latest_message_time}
                    </div>
                    <div className="single-item-details-new-message">
                      {x.unread_message}
                    </div>
                  </div>
                </button>
              </>
            );
          })}

        {chatList.length == 0 && (
          <p className="text-center">No result found.</p>
        )}
      </div>
    </div>
  );
}
