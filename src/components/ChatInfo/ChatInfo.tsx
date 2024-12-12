import { Button } from "primereact/button";
import FontIconWrapper from "../FontIconWrapper";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { CONVERSATION_TYPES } from "../../constants/conversationTypes.constant";
import { UserDetails } from "../../models/userDetails.model";
import { useSelector } from "react-redux";
import { ChatDetails } from "../../models/chatDetails.model";
import { userDetailsSelector } from "../../state/userDetailsSlice";
import { chatDetailsSelector } from "../../state/chatDetailsSlice";
import { Avatar } from "primereact/avatar";

export default function ChatInfo() {
  const [chatInfoVisible, setChatInfoVisible] = useState(false);
  const userDetails: UserDetails | null = useSelector(
    userDetailsSelector.userDetails,
  );
  const chatDetails: ChatDetails | null = useSelector(
    chatDetailsSelector.chatDetails,
  );
  let chatTitle: string = chatDetails.name;
  let chatEmail: string = "";
  let chatNumber: number = null;

  if (chatDetails?.type == CONVERSATION_TYPES.PERSONAL) {
    const otherMembers = chatDetails.members.filter(
      (x) => x.userId != userDetails.id,
    );
    if (otherMembers.length) {
      chatTitle = otherMembers[0].fullName;
      chatEmail = otherMembers[0].email;
      chatNumber = otherMembers[0].phoneNumber;
    }
  }

  const sidebarHeader = () => {
    return (
      <div className="flex items-center gap-x-3">
        <Avatar
          label={chatTitle[0]}
          size="normal"
          shape="circle"
          style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
        />
        <h2 className="m-0">{chatTitle}</h2>
      </div>
    );
  };

  return (
    <>
      <Button onClick={() => setChatInfoVisible(true)} className="p-1" text>
        <FontIconWrapper icon="fa-solid fa-circle-info" />
      </Button>
      <Sidebar
        visible={chatInfoVisible}
        position="right"
        header={sidebarHeader}
        onHide={() => setChatInfoVisible(false)}
      >
        {chatDetails.type == CONVERSATION_TYPES.PERSONAL && (
          <div>
            <h3 className="mt-0">Personal Details</h3>
            <p className="mt-0">Email: {chatEmail}</p>
            <p className="mt-0">Number: {chatNumber}</p>
          </div>
        )}

        {chatDetails.type == CONVERSATION_TYPES.GROUP && (
          <div>
            <h3 className="mt-0">Members</h3>
            <div className="flex flex-col gap-y-2">
              {chatDetails.members.map((member) => {
                return (
                  <div className="flex items-center gap-x-3">
                    <Avatar
                      label={member.fullName[0]}
                      size="normal"
                      shape="circle"
                      style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                    />
                    <p className="m-0">
                      {member.userId == userDetails.id
                        ? "You"
                        : member.fullName}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Sidebar>
    </>
  );
}
