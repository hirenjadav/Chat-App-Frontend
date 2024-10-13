import React, { useEffect, useRef, useState } from "react";
import "./ChatList.scss";
import { Toast } from "primereact/toast";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import CreateNewChat from "../CreateNewChat/CreateNewChat";
import { UserDetails } from "../../models/userDetails.model";
import { useDispatch, useSelector } from "react-redux";
import { userDetailsSelector } from "../../state/userDetailsSlice";
import { ChatDetailsMapper } from "../../models/chatDetails.model";
import { chatDetailsActions } from "../../state/chatDetailsSlice";

export default function ChatList() {
  const [showLoading, setShowLoading] = useState(false);
  const [chatList, setChatList] = useState([]);
  const toast = useRef<Toast>(null);
  const dispatch = useDispatch();
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails
  );

  useEffect(() => {
    setShowLoading(true);
    httpServices
      .get(API_ENDPOINT_CONSTANTS.CHAT_LIST)
      .then((response) => {
        if (response["status"] == "success") {
          const list: any = response.data.map((x) => ChatDetailsMapper(x));
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
  }, [userDetails?.id]);

  const handleChatSelection = (x) => {
    dispatch(chatDetailsActions.setChatDetails(x));
  };

  return (
    <div className="bg-white overflow-hidden p-3 rounded-5">
      <CreateNewChat />

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
                    <img src={x.image} />
                  </div>
                  <div className="single-item-details">
                    <div className="single-item-details-name">{x.name}</div>
                    <div className="single-item-details-message">
                      {x.latest_message}
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

const formatChatListDate = (list: any[]) => {
  return list.map((x) => {
    const today = new Date();
    const date = new Date(x.latest_message_time);

    const isToday = today.toDateString() === date.toDateString();

    let formattedDate;

    if (isToday) {
      // Format for today's date (HH:MM)
      formattedDate = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      // Format for other dates (MM/DD/YYYY)
      formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    return {
      ...x,
      latest_message_time: formattedDate,
    };
  });
};
