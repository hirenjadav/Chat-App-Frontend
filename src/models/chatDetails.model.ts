import { CONVESATION_TYPES } from "../constants/conversationTypes.constant";
import { MessageDetails, messageDetailsMapper } from "./messageDetails.model";

export interface ChatCreatorDetails {
  id: string,
}

export interface ChatMember {
  id: string,
}

export interface ChatDetails {
  id: string;
  type: string;
  name: string;
  creatorDetails: ChatCreatorDetails;
  members: ChatMember[];
  latestMessage: MessageDetails;
}

export function ChatDetailsMapper(chat: any): ChatDetails {
  if(chat.type == CONVESATION_TYPES.PERSONAL) {
    chat.name = chat.participants[0].firstName + " " + chat.participants[0].lastName;
  }

  return {
    id: chat.id || '',
    type: chat.type || '',
    name: chat.name || '',
    creatorDetails: chat.creatorDetails || null,
    members: chat.participants || [],
    latestMessage: chat.messages.length ? messageDetailsMapper(chat.messages[0]) : null,
  };
}