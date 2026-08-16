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
  postback?: {
    data: string;
    params?: Record<string, string>;
  };
}

export interface LineWebhookRequest {
  destination: string;
  events: LineWebhookEvent[];
}

export interface QuickReplyItem {
  type: "action";
  action: {
    type: "postback" | "message" | "uri";
    label: string;
    data?: string;
    text?: string;
    uri?: string;
  };
}

export interface FlexBubble {
  type: "bubble";
  size?: "nano" | "micro" | "kilo" | "mega" | "giga";
  header?: FlexBox;
  hero?: FlexComponent;
  body?: FlexBox;
  footer?: FlexBox;
  styles?: Record<string, unknown>;
}

export interface FlexBox {
  type: "box";
  layout: "horizontal" | "vertical" | "baseline";
  contents: FlexComponent[];
  spacing?: string;
  margin?: string;
  paddingAll?: string;
}

export type FlexComponent = FlexBox | FlexText | FlexButton | FlexSeparator | FlexSpacer;

export interface FlexText {
  type: "text";
  text: string;
  size?: string;
  weight?: string;
  color?: string;
  align?: string;
  wrap?: boolean;
  margin?: string;
}

export interface FlexButton {
  type: "button";
  action: {
    type: "postback" | "uri" | "message";
    label?: string;
    data?: string;
    uri?: string;
    text?: string;
  };
  style?: string;
  color?: string;
  height?: string;
}

export interface FlexSeparator {
  type: "separator";
  margin?: string;
}

export interface FlexSpacer {
  type: "spacer";
  size?: string;
}
