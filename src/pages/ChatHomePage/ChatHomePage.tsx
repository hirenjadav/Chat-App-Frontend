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
          <div>
            <h2 className="mb-3">CHAT APP</h2>
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
