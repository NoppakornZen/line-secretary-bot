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

  // Atomic write: task + user index + reminder pending index
  await kv.atomic()
    .set(["tasks", taskId], task)
    .set(["userTasks", userId, taskId], taskId)
    .set(["remindersPending", taskId], taskId)
    .commit();

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

  const atomic = kv.atomic().set(["tasks", taskId], updatedTask);

  // Manage remindersPending index based on reminderSent flag
  if (updates.reminderSent === true) {
    atomic.delete(["remindersPending", taskId]);
  } else if (updates.reminderSent === false) {
    // Snooze: re-add to pending
    atomic.set(["remindersPending", taskId], taskId);
  }

  await atomic.commit();
}

// Get tasks that need reminders using the remindersPending index
export async function getTasksNeedingReminders(): Promise<Task[]> {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60000);

  const tasks: Task[] = [];
  const iter = kv.list<string>({ prefix: ["remindersPending"] });

  for await (const entry of iter) {
    const taskId = entry.value;
    const task = await getTask(taskId);
    if (!task) continue;

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

// Get today's tasks for a user — uses userTasks index
export async function getTodayTasks(userId: string): Promise<Task[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks: Task[] = [];
  const iter = kv.list<string>({ prefix: ["userTasks", userId] });

  for await (const entry of iter) {
    const taskId = entry.value;
    const task = await getTask(taskId);
    if (!task) continue;

    const taskDate = new Date(task.datetime);

    if (
      !task.isCompleted &&
      taskDate >= today &&
      taskDate < tomorrow
    ) {
      tasks.push(task);
    }
  }

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

// Get all incomplete tasks for a user — uses userTasks index
export async function getUserTasks(userId: string): Promise<Task[]> {
  const tasks: Task[] = [];
  const iter = kv.list<string>({ prefix: ["userTasks", userId] });

  for await (const entry of iter) {
    const taskId = entry.value;
    const task = await getTask(taskId);
    if (!task) continue;

    if (!task.isCompleted) {
      tasks.push(task);
    }
  }

  tasks.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  return tasks;
}

// Get completed tasks for a user — uses userTasks index
export async function getCompletedTasks(userId: string): Promise<Task[]> {
  const tasks: Task[] = [];
  const iter = kv.list<string>({ prefix: ["userTasks", userId] });

  for await (const entry of iter) {
    const taskId = entry.value;
    const task = await getTask(taskId);
    if (!task) continue;

    if (task.isCompleted) {
      tasks.push(task);
    }
  }

  // Sort most recently completed first
  tasks.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
  return tasks;
}

// Delete task — cleans up all indexes atomically
export async function deleteTask(taskId: string): Promise<void> {
  const task = await getTask(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  await kv.atomic()
    .delete(["tasks", taskId])
    .delete(["userTasks", task.userId, taskId])
    .delete(["remindersPending", taskId])
    .commit();

  console.log("Deleted task:", taskId);
}

export { kv };
