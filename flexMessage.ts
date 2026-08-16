// flexMessage.ts - Flex Message Templates
import type { Task } from "./types.ts";
import { formatDate, formatTime } from "./utils.ts";

export function buildTaskCard(task: Task) {
  const datetime = new Date(task.datetime);
  const dateStr = formatDate(datetime);
  const timeStr = formatTime(datetime);

  const footer = task.isCompleted
    ? undefined
    : {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            action: {
              type: "postback",
              label: "✅ เสร็จแล้ว",
              data: `action=complete&taskId=${task.taskId}`,
            },
            style: "primary",
            color: "#06C755",
            height: "sm",
          },
          {
            type: "button",
            action: {
              type: "postback",
              label: "✏️ แก้ไข",
              data: `action=edit_task&taskId=${task.taskId}`,
            },
            style: "secondary",
            height: "sm",
            margin: "sm",
          },
          {
            type: "button",
            action: {
              type: "postback",
              label: "🗑️ ลบ",
              data: `action=confirm_delete&taskId=${task.taskId}`,
            },
            style: "secondary",
            height: "sm",
            margin: "sm",
          },
        ],
        spacing: "none",
        paddingAll: "13px",
      };

  return {
    type: "bubble",
    size: "kilo",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: task.isCompleted ? "✅ งานเสร็จแล้ว" : "📋 งานที่ต้องทำ",
          color: task.isCompleted ? "#06C755" : "#0A0D12",
          size: "sm",
          weight: "bold",
        },
      ],
      paddingAll: "13px",
      backgroundColor: task.isCompleted ? "#E8F8F0" : "#F7D154",
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: task.title,
          size: "xl",
          weight: "bold",
          wrap: true,
          color: "#0F131C",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "baseline",
              contents: [
                { type: "text", text: "📅", size: "sm", flex: 0 },
                {
                  type: "text",
                  text: dateStr,
                  size: "sm",
                  color: "#161D2B",
                  margin: "sm",
                  flex: 1,
                },
              ],
              spacing: "sm",
            },
            {
              type: "box",
              layout: "baseline",
              contents: [
                { type: "text", text: "⏰", size: "sm", flex: 0 },
                {
                  type: "text",
                  text: timeStr,
                  size: "sm",
                  color: "#161D2B",
                  margin: "sm",
                  flex: 1,
                },
              ],
              spacing: "sm",
            },
          ],
          margin: "lg",
          spacing: "sm",
        },
      ],
      paddingAll: "20px",
    },
    footer,
  };
}

export function buildTaskList(tasks: Task[]) {
  if (tasks.length === 0) {
    return {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "ไม่มีงานในขณะนี้",
            size: "lg",
            align: "center",
            color: "#161D2B",
          },
          {
            type: "text",
            text: "กดปุ่ม ➕ เพิ่มงาน เพื่อสร้างงานใหม่",
            size: "sm",
            align: "center",
            color: "#666666",
            margin: "md",
            wrap: true,
          },
        ],
        paddingAll: "30px",
      },
    };
  }

  return {
    type: "carousel",
    contents: tasks.slice(0, 10).map((task) => buildTaskCard(task)),
  };
}

export function buildDeleteConfirm(task: Task) {
  const datetime = new Date(task.datetime);

  return {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "🗑️ ยืนยันการลบ",
          weight: "bold",
          color: "#FFFFFF",
          size: "md",
        },
      ],
      paddingAll: "13px",
      backgroundColor: "#D0021B",
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: task.title,
          size: "xl",
          weight: "bold",
          wrap: true,
          color: "#0F131C",
        },
        {
          type: "text",
          text: `${formatDate(datetime)} ${formatTime(datetime)}`,
          size: "sm",
          color: "#666666",
          margin: "md",
        },
      ],
      paddingAll: "20px",
    },
    footer: {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "button",
          action: {
            type: "postback",
            label: "✅ ใช่ ลบเลย",
            data: `action=delete&taskId=${task.taskId}`,
          },
          style: "primary",
          color: "#D0021B",
          height: "sm",
        },
        {
          type: "button",
          action: {
            type: "postback",
            label: "❌ ยกเลิก",
            data: "action=view_all",
          },
          style: "secondary",
          height: "sm",
        },
      ],
      spacing: "sm",
      paddingAll: "13px",
    },
  };
}

export function buildReminderMessage(task: Task) {
  const datetime = new Date(task.datetime);

  return {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "⏰ อีก 30 นาทีจะถึงเวลา!",
          weight: "bold",
          color: "#0A0D12",
          size: "md",
        },
      ],
      paddingAll: "13px",
      backgroundColor: "#FFB800",
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: task.title,
          size: "xl",
          weight: "bold",
          wrap: true,
          color: "#0F131C",
        },
        {
          type: "box",
          layout: "baseline",
          contents: [
            { type: "text", text: "📅", size: "sm", flex: 0 },
            {
              type: "text",
              text: `${formatDate(datetime)} ${formatTime(datetime)}`,
              size: "sm",
              color: "#161D2B",
              margin: "sm",
              flex: 1,
            },
          ],
          spacing: "sm",
          margin: "lg",
        },
      ],
      paddingAll: "20px",
    },
    footer: {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "button",
          action: {
            type: "postback",
            label: "✅ เสร็จแล้ว",
            data: `action=complete&taskId=${task.taskId}`,
          },
          style: "primary",
          color: "#06C755",
          height: "sm",
        },
        {
          type: "button",
          action: {
            type: "postback",
            label: "😴 เลื่อน 30 นาที",
            data: `action=snooze&taskId=${task.taskId}`,
          },
          style: "secondary",
          height: "sm",
        },
      ],
      spacing: "sm",
      paddingAll: "13px",
    },
  };
}
