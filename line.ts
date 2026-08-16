// line.ts - LINE Messaging API Client
import type { QuickReplyItem } from "./types.ts";

export class LineClient {
  private channelAccessToken: string;

  constructor(channelAccessToken: string) {
    this.channelAccessToken = channelAccessToken;
  }

  async replyMessage(replyToken: string, text: string): Promise<void> {
    const response = await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        replyToken,
        messages: [{ type: "text", text }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("LINE API Error:", error);
      throw new Error(`LINE API Error: ${response.status}`);
    }
  }

  async replyMessageWithQuickReply(
    replyToken: string,
    text: string,
    quickReplyItems: QuickReplyItem[]
  ): Promise<void> {
    const response = await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        replyToken,
        messages: [
          {
            type: "text",
            text,
            quickReply: { items: quickReplyItems },
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("LINE API Error:", error);
      throw new Error(`LINE API Error: ${response.status}`);
    }
  }

  async replyFlexMessage(replyToken: string, altText: string, contents: unknown): Promise<void> {
    const response = await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        replyToken,
        messages: [{ type: "flex", altText, contents }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("LINE API Error:", error);
      throw new Error(`LINE API Error: ${response.status}`);
    }
  }

  async pushFlexMessage(userId: string, altText: string, contents: unknown): Promise<void> {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [{ type: "flex", altText, contents }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("LINE API Error:", error);
      throw new Error(`LINE API Error: ${response.status}`);
    }
  }

  async pushMessage(userId: string, text: string): Promise<void> {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [{ type: "text", text }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("LINE API Error:", error);
      throw new Error(`LINE API Error: ${response.status}`);
    }
  }

  async verifySignature(
    body: string,
    signature: string,
    channelSecret: string
  ): Promise<boolean> {
    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(channelSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
      return signatureBase64 === signature;
    } catch {
      return false;
    }
  }
}
