export interface ChatMember {
  id: string;
  participantType: string;
  userId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  profilePicture: string;
}

export function chatMemberMapper(data: any): ChatMember {
  if (!data) return null;

  return {
    id: data.id || null,
    participantType: data.participantType || null,
    userId: data.userId || null,
    fullName: data.fullName || null,
    firstName: data.firstName || null,
    lastName: data.lastName || null,
    email: data.email || null,
    phoneNumber: data.phoneNumber || null,
    profilePicture: data.profilePicture || null,
  };
}
