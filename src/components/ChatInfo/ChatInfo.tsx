import { Button } from "primereact/button";
import "./ChatInfo.scss";
import FontIconWrapper from "../FontIconWrapper";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { ChatDetails } from "../../models/chatDetails.model";

export default function ChatInfo({
  chatDetails,
}: {
  chatDetails: ChatDetails;
}) {
  const [chatInfoVisible, setChatInfoVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setChatInfoVisible(true)} className="p-1" text>
        <FontIconWrapper icon="fa-solid fa-circle-info" />
      </Button>
      <Sidebar
        visible={chatInfoVisible}
        position="right"
        onHide={() => setChatInfoVisible(false)}
      >
        <h2>Right Sidebar</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </Sidebar>
    </>
  );
}
