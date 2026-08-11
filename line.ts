// line.ts - LINE Messaging API Client
export class LineClient {
  private channelAccessToken: string;

  constructor(channelAccessToken: string) {
    this.channelAccessToken = channelAccessToken;
  }

  async replyMessage(replyToken: string, text: string): Promise<void> {
    const url = "https://api.line.me/v2/bot/message/reply";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: [
          {
            type: "text",
            text: text,
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
    const url = "https://api.line.me/v2/bot/message/reply";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: [
          {
            type: "flex",
            altText: altText,
            contents: contents,
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

  async pushFlexMessage(userId: string, altText: string, contents: unknown): Promise<void> {
    const url = "https://api.line.me/v2/bot/message/push";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: "flex",
            altText: altText,
            contents: contents,
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

  async pushMessage(userId: string, text: string): Promise<void> {
    const url = "https://api.line.me/v2/bot/message/push";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: "text",
            text: text,
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

  verifySignature(body: string, signature: string, channelSecret: string): boolean {
    const encoder = new TextEncoder();
    const key = encoder.encode(channelSecret);
    const data = encoder.encode(body);

    return crypto.subtle.importKey(
      "raw",
      key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    ).then((cryptoKey) => {
      return crypto.subtle.sign("HMAC", cryptoKey, data);
    }).then((signatureBuffer) => {
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      const signatureHex = signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
      return signatureBase64 === signature;
    }).catch(() => false);
  }
}
