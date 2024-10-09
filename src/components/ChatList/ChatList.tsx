import React, { useEffect, useRef, useState } from "react";
import "./ChatList.scss";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";

export default function ChatList() {
  const [showLoading, setShowLoading] = useState(false);
  const [chatList, setChatList] = useState([]);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData")!);

  useEffect(() => {
    setShowLoading(true);
    const params = {
      userId: userData.id,
    };

    httpServices
      .get(API_ENDPOINT_CONSTANTS.CHATS, params)
      .then((response) => {
        if (response["status"] == "success") {
          setChatList(response["data"]);
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

  return <div>ChatList</div>;
}
