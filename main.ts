// main.ts - Deno Deploy Entry Point
import { LineClient } from "./line.ts";
import { parseTask } from "./parser.ts";
import { createUserIfNotExists, createTask, getTodayTasks, getUserTasks, updateTask, deleteTask } from "./database.ts";
import { buildTaskList } from "./flexMessage.ts";
import type { LineWebhookRequest } from "./types.ts";
import "./cron.ts"; // Register cron jobs

const channelAccessToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN") || "";
const channelSecret = Deno.env.get("LINE_CHANNEL_SECRET") || "";
const lineClient = new LineClient(channelAccessToken);

// ===================================
// WEBHOOK HANDLER
// ===================================
async function handleWebhook(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("x-line-signature") || "";

    // Verify signature
    const isValid = await lineClient.verifySignature(body, signature, channelSecret);
    if (!isValid) {
      console.error("[Webhook] Invalid signature");
      return new Response("Invalid signature", { status: 403 });
    }

    const data: LineWebhookRequest = JSON.parse(body);

    for (const event of data.events) {
      // Handle postback events (from buttons)
      if (event.type === "postback") {
        const userId = event.source.userId;
        const postbackData = event.postback.data;
        const replyToken = event.replyToken;

        console.log(`[Webhook] Postback from ${userId}: ${postbackData}`);

        await createUserIfNotExists(userId);

        // Parse postback data
        const params = new URLSearchParams(postbackData);
        const action = params.get("action");
        const taskId = params.get("taskId");

        if (action === "complete" && taskId) {
          await updateTask(taskId, { isCompleted: true });
          await lineClient.replyMessage(replyToken, "✅ ทำเครื่องหมายงานเสร็จแล้ว!");
        } else if (action === "delete" && taskId) {
          await deleteTask(taskId);
          await lineClient.replyMessage(replyToken, "🗑️ ลบงานเรียบร้อย!");
        } else if (action === "view_today") {
          const tasks = await getTodayTasks(userId);
          const flexMessage = buildTaskList(tasks);
          await lineClient.replyFlexMessage(replyToken, "งานวันนี้", flexMessage);
        } else if (action === "view_all") {
          const tasks = await getUserTasks(userId);
          const flexMessage = buildTaskList(tasks);
          await lineClient.replyFlexMessage(replyToken, "งานทั้งหมด", flexMessage);
        } else if (action === "add_task") {
          await lineClient.replyMessage(
            replyToken,
            "✍️ พิมพ์คำสั่งเพิ่มงาน:\n\n" +
            "งาน [ชื่องาน] [วันนี้/พรุ่งนี้] [เวลา]\n\n" +
            "ตัวอย่าง:\n" +
            "งาน ประชุมทีม วันนี้ 14:30"
          );
        }
      }

      // Handle text messages
      if (event.type === "message" && event.message.type === "text") {
        const userId = event.source.userId;
        const text = event.message.text.trim();
        const replyToken = event.replyToken;

        console.log(`[Webhook] Message from ${userId}: ${text}`);

        // Create user if not exists
        await createUserIfNotExists(userId);

        // Handle commands
        if (text === "ช่วยเหลือ" || text === "help") {
          await lineClient.replyMessage(
            replyToken,
            "📋 วิธีใช้งาน:\n\n" +
            "งาน [ชื่องาน] [วันนี้/พรุ่งนี้] [เวลา]\n\n" +
            "ตัวอย่าง:\n" +
            "งาน ประชุมทีม วันนี้ 14:30\n" +
            "งาน ส่งรายงาน พรุ่งนี้ 09:00\n\n" +
            "💡 บอทจะเตือนล่วงหน้า 30 นาที\n" +
            "💡 ส่งสรุปงานวันนี้ทุกเช้า 8:00 น."
          );
        } else if (text === "ดูงานวันนี้" || text === "งานวันนี้") {
          const tasks = await getTodayTasks(userId);
          const flexMessage = buildTaskList(tasks);
          await lineClient.replyFlexMessage(replyToken, "งานวันนี้", flexMessage);
        } else if (text === "ดูงานทั้งหมด" || text === "งานทั้งหมด") {
          const tasks = await getUserTasks(userId);
          const flexMessage = buildTaskList(tasks);
          await lineClient.replyFlexMessage(replyToken, "งานทั้งหมด", flexMessage);
        } else {
          // Parse task command
          const parsedTask = parseTask(text);

          if (parsedTask) {
            const { title, datetime } = parsedTask;
            const reminderTime = new Date(datetime.getTime() - 30 * 60000);

            const taskId = await createTask(userId, title, datetime, reminderTime);

            const confirmMessage =
              `✅ เพิ่มงานเรียบร้อย!\n\n` +
              `📌 ${title}\n` +
              `📅 ${datetime.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}\n` +
              `⏰ จะเตือน: ${reminderTime.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}`;

            await lineClient.replyMessage(replyToken, confirmMessage);
            console.log(`[Webhook] Created task: ${taskId}`);
          } else {
            await lineClient.replyMessage(
              replyToken,
              "❌ รูปแบบคำสั่งไม่ถูกต้อง\n\n" +
              "ใช้รูปแบบ:\n" +
              "งาน [ชื่องาน] [วันนี้/พรุ่งนี้] [เวลา]\n\n" +
              "ส่ง \"ช่วยเหลือ\" เพื่อดูตัวอย่าง"
            );
          }
        }
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[Webhook] Error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

// ===================================
// HTTP SERVER
// ===================================
Deno.serve({
  port: 8000,
  handler: async (req: Request): Promise<Response> => {
    const url = new URL(req.url);

    if (url.pathname === "/webhook") {
      return await handleWebhook(req);
    }

    if (url.pathname === "/") {
      return new Response(
        JSON.stringify({
          status: "running",
          service: "LINE Secretary Bot",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log("🚀 LINE Secretary Bot is running on port 8000");
console.log("📍 Webhook endpoint: /webhook");
