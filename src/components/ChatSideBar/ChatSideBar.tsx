import { Button } from "primereact/button";
import FontIconWrapper from "../FontIconWrapper";
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
    <div className="flex h-full flex-col items-center justify-between bg-white px-3 py-5">
      <div className="flex flex-col items-center gap-y-4">
        <Button
          text
          onClick={() => handleChatCategoryChange("chats")}
          tooltipOptions={{ disabled: selectedChatCategory == "chats" }}
          className={`flex h-[50px] w-[50px] items-center justify-center rounded-[50%] text-2xl ${
            selectedChatCategory == "chats"
              ? "shadow-sm ring-2 ring-white ring-offset-2 ring-offset-[#9dc1fb]"
              : ""
          }`}
          tooltip="Chats"
        >
          <FontIconWrapper icon="fa-solid fa-message" />
        </Button>

        <Button
          text
          onClick={() => handleChatCategoryChange("groups")}
          tooltipOptions={{ disabled: selectedChatCategory == "groups" }}
          className={`flex h-[50px] w-[50px] items-center justify-center rounded-[50%] text-2xl ${
            selectedChatCategory == "groups"
              ? "shadow-sm ring-2 ring-white ring-offset-2 ring-offset-[#9dc1fb]"
              : ""
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
          className="p-0 text-2xl"
          tooltip="Logout"
        >
          <FontIconWrapper icon="fa-solid fa-arrow-right-from-bracket" />
        </Button>
      </div>
    </div>
  );
}
