import { CONVESATION_TYPES } from "../constants/conversationTypes.constant";

export interface ChatCreatorDetails {
  id: string;
}

export interface ChatMember {
  id: string;
}

export interface ChatDetails {
  id: string;
  type: string;
  name: string;
  profilePicture: string;
  members: ChatMember[];
}

export function ChatDetailsMapper(chat: any): ChatDetails {
  if (chat.type == CONVESATION_TYPES.PERSONAL) {
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
    members: chat.participants || [],
  };
}
