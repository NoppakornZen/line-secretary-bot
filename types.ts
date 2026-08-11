// types.ts - Type definitions
export interface Task {
  taskId: string;
  userId: string;
  title: string;
  datetime: Date;
  reminderTime: Date;
  isCompleted: boolean;
  reminderSent: boolean;
  createdAt: Date;
}

export interface User {
  userId: string;
  createdAt: Date;
  settings: {
    morningDigestTime: string;
    defaultReminderMinutes: number;
  };
}

export interface LineWebhookEvent {
  type: string;
  timestamp: number;
  source: {
    type: string;
    userId: string;
  };
  replyToken: string;
  message?: {
    type: string;
    id: string;
    text: string;
  };
}

export interface LineWebhookRequest {
  destination: string;
  events: LineWebhookEvent[];
}
