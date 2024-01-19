export interface Notification {
  highPriority: HighPriority[];
  recent: HighPriority[];
}

export interface HighPriority {
  Category_name: string;
  Description: string;
  Link_name: string;
  Link_url: string;
  Title: string;
  eventName: string;
  eventStartDt: string;
  eventAge: string;
  new: boolean;
}

export interface NotificationCount {
  newNotificationCount: number;
}
