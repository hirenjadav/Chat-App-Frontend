import React, { useEffect, useRef, useState } from "react";
import "./ChatList.scss";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import httpServices from "../../services/httpServices";
import API_ENDPOINT_CONSTANTS from "../../constants/apiEndpointConstants";
import CreateNewChat from "../CreateNewChat/CreateNewChat";
import { Button } from "primereact/button";

export default function ChatList() {
  const [showLoading, setShowLoading] = useState(false);
  const [chatList, setChatList] = useState([]);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData")!);

  useEffect(() => {
    setShowLoading(true);
    httpServices
      .get(API_ENDPOINT_CONSTANTS.CHATS)
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

  return (
    <div className="bg-white overflow-hidden p-3 rounded-4">
      <div>
        <CreateNewChat />
      </div>

      <div>
        {chatList.map((x: any) => {
          return (
            <Button text>
              <div className="row">
                <div className="col-2"></div>
                <div className="col-10">{x?.name}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
