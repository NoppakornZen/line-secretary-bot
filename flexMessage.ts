// flexMessage.ts - Flex Message Templates
import type { Task } from "./types.ts";
import { formatDate, formatTime } from "./utils.ts";

export function buildTaskCard(task: Task) {
  const datetime = new Date(task.datetime);
  const dateStr = formatDate(datetime);
  const timeStr = formatTime(datetime);

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
                {
                  type: "text",
                  text: "📅",
                  size: "sm",
                  flex: 0,
                },
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
                {
                  type: "text",
                  text: "⏰",
                  size: "sm",
                  flex: 0,
                },
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
    footer: task.isCompleted ? undefined : {
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
            label: "❌ ลบ",
            data: `action=delete&taskId=${task.taskId}`,
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
    contents: tasks.slice(0, 10).map(task => buildTaskCard(task)),
  };
}
