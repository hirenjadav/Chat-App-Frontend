export interface MessageDetails {
  id: string,
  messageType: string,
  messageStatus: string,
  message: string,
  messageAttachment: any,
  messageAttachmentType: string,
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  conversationId: string,
  senderId: string
}

export function messageDetailsMapper(data: any): MessageDetails {
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
    conversationId: data.conversationId || null,
    senderId: data.senderId || null
  };
}