export enum NotificationType {
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_CONVERSATION = 'NEW_CONVERSATION',
  BROADCAST = 'BROADCAST',
  NOTIFICATION = 'NOTIFICATION',
  CONNECTED = 'CONNECTED'
}

export interface NotificationDTO {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: any;
  read: boolean;
}