import ChatList from "../../components/ChatList/ChatList";
import SingleChat from "../../components/SingleChat/SingleChat";
import ChatSideBar from "../../components/ChatSideBar/ChatSideBar";
import { UserDetails } from "../../models/userDetails.model";
import { useDispatch, useSelector } from "react-redux";
import {
  userDetailsActions,
  userDetailsSelector,
} from "../../state/userDetailsSlice";
import { useEffect, useState } from "react";
import CreateNewGroup from "../../components/CreateNewGroup/CreateNewGroup";

export default function ChatHomePage() {
  const [selectedChatCategory, setSelectedChatCategory] =
    useState<string>("chats");

  const dispatch = useDispatch();
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails,
  );

  useEffect(() => {
    if (!userDetails) {
      dispatch(userDetailsActions.fetchUserDetails());
    }
  }, [userDetails]);

  const handleChatCategoryChange = (value: string) =>
    setSelectedChatCategory(value);

  return (
    <div className="flex h-full min-h-screen">
      <div className="basis-[82px]">
        <ChatSideBar
          selectedChatCategory={selectedChatCategory}
          handleChatCategoryChange={handleChatCategoryChange}
        />
      </div>
      <div className="flex flex-grow gap-x-5 p-5">
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center justify-between">
            <h3 className="m-0">CHAT APP</h3>
            <div>
              <CreateNewGroup />
            </div>
          </div>

          <ChatList selectedChatCategory={selectedChatCategory} />
        </div>
        <div className="flex-grow rounded-3xl bg-white p-5">
          <SingleChat />
        </div>
      </div>
    </div>
  );
}
