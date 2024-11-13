import { CONVERSATION_TYPES } from "../constants/conversationTypes.constant";
import { ChatMember, chatMemberMapper } from "./chatMember.model";

export interface ChatDetails {
  id: string;
  type: string;
  name: string;
  profilePicture: string;
  members: ChatMember[];
  lastSeenMessageTime: Date;
}

export function ChatDetailsMapper(chat: any): ChatDetails {
  let userData = null;
  if (localStorage.getItem("userData")) {
    userData = JSON.parse(localStorage.getItem("userData")!);
  }
  if (chat.type == CONVERSATION_TYPES.PERSONAL) {
    const participantData =
      chat.participants && chat.participants.length
        ? chat.participants.filter((x: any) => x?.id != userData?.id)[0]
        : null;
    if (participantData) {
      chat.name = participantData.fullName;
      chat.profilePicture = participantData.profilePicture;
    }
  }

  const lastSeenMessageTime = new Date(
    chat.participants.filter((x: any) => x?.id == userData?.id)[0]
      .lastSeenMessageTime || null
  );

  return {
    id: chat.id || "",
    type: chat.type || "",
    name: chat.name || "",
    profilePicture: chat.profilePicture || "",
    members: chat.participants
      ? chat.participants.map((x) => chatMemberMapper(x))
      : [],
    lastSeenMessageTime,
  };
}
