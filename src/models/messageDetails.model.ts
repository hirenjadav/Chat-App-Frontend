export interface MessageDetails {
  id: string;
  messageType: string;
  messageStatus: string;
  message: string;
  messageAttachment: any;
  messageAttachmentType: string;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  messageTime: string;
  conversationId: string;
  senderId: string;
}

export function messageDetailsMapper(data: any): MessageDetails {
  if (!data) return null;

  return {
    id: data.id || null,
    messageType: data.messageType || null,
    messageStatus: data.messageStatus || null,
    message: data.message || null,
    messageAttachment: data.messageAttachment || null,
    messageAttachmentType: data.messageAttachmentType || null,
    deletedAt: data.deletedAt ? new Date(data.deletedAt) : null,
    createdAt: data.createdAt ? new Date(data.createdAt) : null,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    messageTime: formateDateLabel(
      new Date(data.createdAt),
      new Date(data.updatedAt)
    ),
    conversationId: data.conversationId || null,
    senderId: data.senderId || null,
  };
}

function formateDateLabel(createDate: Date, updateDate: Date): string {
  let dateInput = createDate;
  if (createDate.getTime() > updateDate.getTime()) dateInput = updateDate;

  const today = new Date();

  // Check if the dateInput is from today
  const isToday =
    dateInput.getDate() === today.getDate() &&
    dateInput.getMonth() === today.getMonth() &&
    dateInput.getFullYear() === today.getFullYear();

  if (isToday) {
    // Return the time in hours and minutes if it's today
    const hours = dateInput.getHours().toString().padStart(2, "0");
    const minutes = dateInput.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else {
    // Return the date and month for other days
    const day = dateInput.getDate().toString().padStart(2, "0");
    const month = (dateInput.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-indexed
    return `${day}/${month}`;
  }
}
