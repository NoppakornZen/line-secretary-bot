// main.ts - Deno Deploy Entry Point
import { LineClient } from "./line.ts";
import { parseTask } from "./parser.ts";
import {
  createUserIfNotExists,
  createTask,
  getTask,
  getTodayTasks,
  getUserTasks,
  getCompletedTasks,
  updateTask,
  deleteTask,
} from "./database.ts";
import {
  buildTaskList,
  buildDeleteConfirm,
} from "./flexMessage.ts";
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

    const isValid = await lineClient.verifySignature(body, signature, channelSecret);
    if (!isValid) {
      console.error("[Webhook] Invalid signature");
      return new Response("Invalid signature", { status: 403 });
    }

    const data: LineWebhookRequest = JSON.parse(body);

    for (const event of data.events) {
      // ── POSTBACK EVENTS ──────────────────────────────────────────
      if (event.type === "postback") {
        const userId = event.source.userId;
        const replyToken = event.replyToken;
        const params = new URLSearchParams(event.postback!.data);
        const action = params.get("action");
        const taskId = params.get("taskId");

        console.log(`[Webhook] Postback from ${userId}: ${event.postback!.data}`);

        await createUserIfNotExists(userId);

        if (action === "complete" && taskId) {
          await updateTask(taskId, { isCompleted: true });
          await lineClient.replyMessageWithQuickReply(
            replyToken,
            "✅ ทำเครื่องหมายงานเสร็จแล้ว!",
            [
              {
                type: "action",
                action: {
                  type: "postback",
                  label: "📋 ดูงานที่เหลือ",
                  data: "action=view_all",
                },
              },
            ]
          );
        } else if (action === "confirm_delete" && taskId) {
          const task = await getTask(taskId);
          if (task) {
            const flex = buildDeleteConfirm(task);
            await lineClient.replyFlexMessage(replyToken, "ยืนยันลบงานนี้ไหม?", flex);
          } else {
            await lineClient.replyMessage(replyToken, "❌ ไม่พบงานนี้");
          }
        } else if (action === "delete" && taskId) {
          await deleteTask(taskId);
          await lineClient.replyMessageWithQuickReply(
            replyToken,
            "🗑️ ลบงานเรียบร้อย!",
            [
              {
                type: "action",
                action: {
                  type: "postback",
                  label: "📋 ดูงานที่เหลือ",
                  data: "action=view_all",
                },
              },
            ]
          );
        } else if (action === "snooze" && taskId) {
          const task = await getTask(taskId);
          if (task) {
            const newReminderTime = new Date(
              new Date(task.reminderTime).getTime() + 30 * 60000
            );
            await updateTask(taskId, { reminderSent: false, reminderTime: newReminderTime });
            await lineClient.replyMessage(replyToken, "😴 เลื่อนการแจ้งเตือนออกไป 30 นาทีแล้ว");
          } else {
            await lineClient.replyMessage(replyToken, "❌ ไม่พบงานนี้");
          }
        } else if (action === "edit_task" && taskId) {
          await lineClient.replyMessage(
            replyToken,
            "✏️ เพื่อแก้ไขงาน กรุณาพิมพ์งานใหม่ในรูปแบบ:\n\n" +
              "งาน [ชื่องาน] [วัน] [เวลา]\n\n" +
              "ตัวอย่าง:\nงาน ประชุมทีม พรุ่งนี้ 10:00\n\n" +
              "⚠️ งานเดิมจะยังคงอยู่จนกว่าคุณจะลบมือ"
          );
        } else if (action === "view_today") {
          const tasks = await getTodayTasks(userId);
          const flexMessage = buildTaskList(tasks);
          await lineClient.replyFlexMessage(replyToken, "งานวันนี้", flexMessage);
        } else if (action === "view_all") {
          const tasks = await getUserTasks(userId);
          const flexMessage = buildTaskList(tasks);
          await lineClient.replyFlexMessage(replyToken, "งานทั้งหมด", flexMessage);
        } else if (action === "view_done") {
          const tasks = await getCompletedTasks(userId);
          const flexMessage = buildTaskList(tasks);
          await lineClient.replyFlexMessage(replyToken, "งานที่เสร็จแล้ว", flexMessage);
        } else if (action === "add_task") {
          await lineClient.replyMessage(
            replyToken,
            "✍️ พิมพ์คำสั่งเพิ่มงาน:\n\n" +
              "งาน [ชื่องาน] [วัน] [เวลา]\n\n" +
              "รองรับรูปแบบวัน:\n" +
              "• วันนี้ / พรุ่งนี้\n" +
              "• วันจันทร์ – วันอาทิตย์\n" +
              "• 25/8 หรือ 25 ส.ค.\n\n" +
              "ตัวอย่าง:\n" +
              "งาน ประชุมทีม วันนี้ 14:30\n" +
              "งาน ส่งรายงาน 25/8 09:00\n" +
              "งาน ออกกำลังกาย วันเสาร์ 07:00"
          );
        }
      }

      // ── TEXT MESSAGE EVENTS ──────────────────────────────────────
      if (event.type === "message" && event.message?.type === "text") {
        const userId = event.source.userId;
        const text = event.message.text.trim();
        const replyToken = event.replyToken;

        console.log(`[Webhook] Message from ${userId}: ${text}`);

        await createUserIfNotExists(userId);

        if (text === "ช่วยเหลือ" || text === "help") {
          await lineClient.replyMessage(
            replyToken,
            "📋 วิธีใช้งาน:\n\n" +
              "งาน [ชื่องาน] [วัน] [เวลา]\n\n" +
              "รองรับรูปแบบวัน:\n" +
              "• วันนี้ / พรุ่งนี้\n" +
              "• วันจันทร์ – วันอาทิตย์\n" +
              "• 25/8 หรือ 25 ส.ค.\n\n" +
              "ตัวอย่าง:\n" +
              "งาน ประชุมทีม วันนี้ 14:30\n" +
              "งาน ส่งรายงาน พรุ่งนี้ 09:00\n" +
              "งาน ออกกำลังกาย วันเสาร์ 07:00\n" +
              "งาน ส่ง TPS 25/8 17:00\n\n" +
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
                "งาน [ชื่องาน] [วัน] [เวลา]\n\n" +
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
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log("🚀 LINE Secretary Bot is running on port 8000");
console.log("📍 Webhook endpoint: /webhook");
