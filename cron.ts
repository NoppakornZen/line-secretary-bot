// cron.ts - Scheduled tasks (Reminders + Morning Digest)
import { LineClient } from "./line.ts";
import {
  getTasksNeedingReminders,
  getAllUsers,
  getTodayTasks,
  updateTask,
} from "./database.ts";
import { formatDate, formatTime } from "./utils.ts";

const channelAccessToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN") || "";
const lineClient = new LineClient(channelAccessToken);

// ===================================
// SEND REMINDERS - ทุก 1 นาที
// ===================================
Deno.cron("sendReminders", "* * * * *", async () => {
  console.log("[Cron] Checking for reminders...");

  try {
    const tasks = await getTasksNeedingReminders();

    if (tasks.length === 0) {
      console.log("[Cron] No tasks to remind");
      return;
    }

    console.log(`[Cron] Found ${tasks.length} tasks to remind`);

    for (const task of tasks) {
      const datetime = new Date(task.datetime);
      const message =
        `⏰ อีก 30 นาทีจะถึงเวลา!\n\n` +
        `📌 ${task.title}\n` +
        `📅 ${formatDate(datetime)} ${formatTime(datetime)}`;

      try {
        await lineClient.pushMessage(task.userId, message);
        await updateTask(task.taskId, { reminderSent: true });
        console.log(`[Cron] Sent reminder for task: ${task.taskId}`);
      } catch (error) {
        console.error(`[Cron] Error sending reminder:`, error);
      }
    }
  } catch (error) {
    console.error("[Cron] Error in sendReminders:", error);
  }
});

// ===================================
// MORNING DIGEST - ทุกวัน 8:00 น.
// ===================================
Deno.cron("sendMorningDigest", "0 8 * * *", async () => {
  console.log("[Cron] Sending morning digest...");

  try {
    const users = await getAllUsers();
    console.log(`[Cron] Found ${users.length} users`);

    for (const user of users) {
      try {
        const tasks = await getTodayTasks(user.userId);

        let message: string;

        if (tasks.length === 0) {
          message =
            "☀️ สวัสดีตอนเช้า!\n\n" +
            "📋 วันนี้ไม่มีงานนะ\n" +
            "พักผ่อนให้เต็มที่! 😊";
        } else {
          message =
            `☀️ สวัสดีตอนเช้า!\n\n` +
            `📋 วันนี้มีงาน ${tasks.length} อย่าง:\n\n`;

          tasks.forEach((task, index) => {
            const datetime = new Date(task.datetime);
            message += `${index + 1}. ⏰ ${task.title} - ${formatTime(datetime)}\n`;
          });
        }

        await lineClient.pushMessage(user.userId, message.trim());
        console.log(`[Cron] Sent morning digest to: ${user.userId}`);
      } catch (error) {
        console.error(`[Cron] Error sending digest to user:`, error);
      }
    }
  } catch (error) {
    console.error("[Cron] Error in sendMorningDigest:", error);
  }
});

console.log("✅ Cron jobs registered:");
console.log("  - sendReminders: every 1 minute");
console.log("  - sendMorningDigest: daily at 8:00 AM");
