// database.ts - Deno KV Database
import type { Task, User } from "./types.ts";

const kv = await Deno.openKv();

// ===================================
// USER FUNCTIONS
// ===================================

export async function createUserIfNotExists(userId: string): Promise<void> {
  const userKey = ["users", userId];
  const user = await kv.get<User>(userKey);

  if (!user.value) {
    await kv.set(userKey, {
      userId: userId,
      createdAt: new Date(),
      settings: {
        morningDigestTime: "08:00",
        defaultReminderMinutes: 30,
      },
    });
    console.log("Created new user:", userId);
  }
}

export async function getUser(userId: string): Promise<User | null> {
  const userKey = ["users", userId];
  const result = await kv.get<User>(userKey);
  return result.value;
}

// ===================================
// TASK FUNCTIONS
// ===================================

export async function createTask(
  userId: string,
  title: string,
  datetime: Date,
  reminderTime: Date
): Promise<string> {
  const taskId = crypto.randomUUID();
  const taskKey = ["tasks", taskId];

  const task: Task = {
    taskId: taskId,
    userId: userId,
    title: title,
    datetime: datetime,
    reminderTime: reminderTime,
    isCompleted: false,
    reminderSent: false,
    createdAt: new Date(),
  };

  await kv.set(taskKey, task);

  // Create index for user's tasks
  const userTaskKey = ["userTasks", userId, taskId];
  await kv.set(userTaskKey, taskId);

  console.log("Created task:", taskId);
  return taskId;
}

export async function getTask(taskId: string): Promise<Task | null> {
  const taskKey = ["tasks", taskId];
  const result = await kv.get<Task>(taskKey);
  return result.value;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  const task = await getTask(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  const updatedTask = { ...task, ...updates };
  const taskKey = ["tasks", taskId];
  await kv.set(taskKey, updatedTask);
}

// Get tasks that need reminders (reminderTime in the last minute)
export async function getTasksNeedingReminders(): Promise<Task[]> {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60000);

  const tasks: Task[] = [];
  const iter = kv.list<Task>({ prefix: ["tasks"] });

  for await (const entry of iter) {
    const task = entry.value;
    if (
      !task.isCompleted &&
      !task.reminderSent &&
      new Date(task.reminderTime) >= oneMinuteAgo &&
      new Date(task.reminderTime) <= now
    ) {
      tasks.push(task);
    }
  }

  return tasks;
}

// Get today's tasks for a user
export async function getTodayTasks(userId: string): Promise<Task[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks: Task[] = [];
  const iter = kv.list<Task>({ prefix: ["tasks"] });

  for await (const entry of iter) {
    const task = entry.value;
    const taskDate = new Date(task.datetime);

    if (
      task.userId === userId &&
      !task.isCompleted &&
      taskDate >= today &&
      taskDate < tomorrow
    ) {
      tasks.push(task);
    }
  }

  // Sort by datetime
  tasks.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  return tasks;
}

// Get all users
export async function getAllUsers(): Promise<User[]> {
  const users: User[] = [];
  const iter = kv.list<User>({ prefix: ["users"] });

  for await (const entry of iter) {
    users.push(entry.value);
  }

  return users;
}

export { kv };
