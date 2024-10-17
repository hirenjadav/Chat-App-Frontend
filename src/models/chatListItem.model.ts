import { CONVERSATION_TYPES } from "../constants/conversationTypes.constant";
import { ChatMember, chatMemberMapper } from "./chatMember.model";
import { MessageDetails, messageDetailsMapper } from "./messageDetails.model";

export interface ChatListItem {
  id: string;
  type: string;
  name: string;
  profilePicture: string;
  members: ChatMember[];
  latestMessage: MessageDetails;
}

export function ChatListItemMapper(chat: any): ChatListItem {
  if (chat.type == CONVERSATION_TYPES.PERSONAL) {
    let userData = null;
    if (localStorage.getItem("userData")) {
      userData = JSON.parse(localStorage.getItem("userData")!);
    }
    const participantData =
      chat.participants && chat.participants.length
        ? chat.participants.filter((x: any) => x?.userId != userData?.id)[0]
        : null;
    if (participantData) {
      chat.name = participantData.fullName;
      chat.profilePicture = participantData.profilePicture;
    }
  }

  return {
    id: chat.id || "",
    type: chat.type || "",
    name: chat.name || "",
    profilePicture: chat.profilePicture || "",
    members: chat.participants
      ? chat.participants.map((x) => chatMemberMapper(x))
      : [],
    latestMessage: messageDetailsMapper(chat.latestMessage),
  };
}
