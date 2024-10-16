import "./ChatHomePage.scss";
import ChatList from "../../components/ChatList/ChatList";
import SingleChat from "../../components/SingleChat/SingleChat";
import ChatSideBar from "../../components/ChatSideBar/ChatSideBar";
import { UserDetails } from "../../models/userDetails.model";
import { useDispatch, useSelector } from "react-redux";
import {
  userDetailsActions,
  userDetailsSelector,
} from "../../state/userDetailsSlice";
import { useEffect } from "react";
import CreateNewGroup from "../../components/CreateNewGroup/CreateNewGroup";

export default function ChatHomePage() {
  const dispatch = useDispatch();
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails
  );

  useEffect(() => {
    if (!userDetails) {
      dispatch(userDetailsActions.fetchUserDetails());
    }
  }, [userDetails]);

  return (
    <div className="min-vh-100 h-100 d-flex">
      <div className="chat-sidebar-container">
        <ChatSideBar />
      </div>
      <div className="chat-home-container">
        <div className="chat-list">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="m-0">CHAT APP</h3>
            <div>
              <CreateNewGroup />
            </div>
          </div>

          <ChatList />
        </div>
        <div className="single-chat">
          <SingleChat />
        </div>
      </div>
    </div>
  );
}
