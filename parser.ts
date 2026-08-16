// parser.ts - Parse task commands
import { getBangkokTime } from "./utils.ts";

export interface ParsedTask {
  title: string;
  datetime: Date;
}

const THAI_MONTH_MAP: Record<string, number> = {
  "ม.ค.": 0, "ก.พ.": 1, "มี.ค.": 2, "เม.ย.": 3,
  "พ.ค.": 4, "มิ.ย.": 5, "ก.ค.": 6, "ส.ค.": 7,
  "ก.ย.": 8, "ต.ค.": 9, "พ.ย.": 10, "ธ.ค.": 11,
};

const WEEKDAY_MAP: Record<string, number> = {
  "อาทิตย์": 0, "จันทร์": 1, "อังคาร": 2, "พุธ": 3,
  "พฤหัสบดี": 4, "ศุกร์": 5, "เสาร์": 6,
};

function isValidTime(hour: number, minute: number): boolean {
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

// Sub-parser 1: วันนี้ / พรุ่งนี้
function parseRelativeDay(text: string): ParsedTask | null {
  const match = text.match(/^งาน\s+(.+?)\s+(วันนี้|พรุ่งนี้)\s+(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const title = match[1].trim();
  const dayText = match[2];
  const hour = parseInt(match[3]);
  const minute = parseInt(match[4]);

  if (!isValidTime(hour, minute)) return null;

  const now = getBangkokTime();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);

  if (dayText === "พรุ่งนี้") {
    target.setDate(target.getDate() + 1);
  } else if (target <= now) {
    // วันนี้ แต่เวลาผ่านไปแล้ว → เลื่อนเป็นพรุ่งนี้
    target.setDate(target.getDate() + 1);
  }

  return { title, datetime: target };
}

// Sub-parser 2: วันจันทร์ / วันอังคาร / ...
function parseWeekday(text: string): ParsedTask | null {
  const match = text.match(
    /^งาน\s+(.+?)\s+(?:วัน)?(จันทร์|อังคาร|พุธ|พฤหัสบดี|ศุกร์|เสาร์|อาทิตย์)\s+(\d{1,2}):(\d{2})$/
  );
  if (!match) return null;

  const title = match[1].trim();
  const weekdayName = match[2];
  const hour = parseInt(match[3]);
  const minute = parseInt(match[4]);

  if (!isValidTime(hour, minute)) return null;

  const targetDow = WEEKDAY_MAP[weekdayName];
  const now = getBangkokTime();
  const todayDow = now.getDay();

  let daysUntil = (targetDow - todayDow + 7) % 7;

  const target = new Date(now);
  target.setDate(target.getDate() + daysUntil);
  target.setHours(hour, minute, 0, 0);

  // ถ้าเวลาผ่านไปแล้ว ให้ไปสัปดาห์หน้า
  if (target <= now) {
    target.setDate(target.getDate() + 7);
  }

  return { title, datetime: target };
}

// Sub-parser 3: DD/MM เช่น 25/8
function parseNumericDate(text: string): ParsedTask | null {
  const match = text.match(/^งาน\s+(.+?)\s+(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const title = match[1].trim();
  const day = parseInt(match[2]);
  const month = parseInt(match[3]) - 1; // 0-based
  const hour = parseInt(match[4]);
  const minute = parseInt(match[5]);

  if (month < 0 || month > 11 || day < 1 || day > 31) return null;
  if (!isValidTime(hour, minute)) return null;

  const now = getBangkokTime();
  let year = now.getFullYear();

  const target = new Date(year, month, day, hour, minute, 0, 0);

  // ถ้าวันที่ผ่านไปแล้วในปีนี้ ใช้ปีหน้า
  if (target <= now) {
    year += 1;
    target.setFullYear(year);
  }

  return { title, datetime: target };
}

// Sub-parser 4: DD ส.ค. เช่น 25 ส.ค.
function parseThaiMonth(text: string): ParsedTask | null {
  const monthPattern = Object.keys(THAI_MONTH_MAP)
    .map((m) => m.replace(/\./g, "\\."))
    .join("|");

  const regex = new RegExp(
    `^งาน\\s+(.+?)\\s+(\\d{1,2})\\s+(${monthPattern})\\s+(\\d{1,2}):(\\d{2})$`
  );
  const match = text.match(regex);
  if (!match) return null;

  const title = match[1].trim();
  const day = parseInt(match[2]);
  const month = THAI_MONTH_MAP[match[3]];
  const hour = parseInt(match[4]);
  const minute = parseInt(match[5]);

  if (month === undefined || day < 1 || day > 31) return null;
  if (!isValidTime(hour, minute)) return null;

  const now = getBangkokTime();
  let year = now.getFullYear();

  const target = new Date(year, month, day, hour, minute, 0, 0);

  if (target <= now) {
    year += 1;
    target.setFullYear(year);
  }

  return { title, datetime: target };
}

export function parseTask(text: string): ParsedTask | null {
  return (
    parseRelativeDay(text) ??
    parseWeekday(text) ??
    parseNumericDate(text) ??
    parseThaiMonth(text)
  );
}
