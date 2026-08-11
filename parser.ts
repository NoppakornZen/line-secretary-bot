// parser.ts - Parse task commands
export interface ParsedTask {
  title: string;
  datetime: Date;
}

export function parseTask(text: string): ParsedTask | null {
  // รูปแบบ: "งาน [ชื่องาน] [วันนี้/พรุ่งนี้] [HH:MM]"
  const match = text.match(
    /^งาน\s+(.+?)\s+(พรุ่งนี้|วันนี้|(?:วัน)?(?:จันทร์|อังคาร|พุธ|พฤหัสบดี|ศุกร์|เสาร์|อาทิตย์)?)\s+(\d{1,2}):(\d{2})$/
  );

  if (!match) {
    return null;
  }

  const title = match[1].trim();
  const dayText = match[2];
  const hour = parseInt(match[3]);
  const minute = parseInt(match[4]);

  // ตรวจสอบความถูกต้อง
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  // คำนวณวันที่
  const now = new Date();
  const targetDate = new Date(now);

  // ใช้ timezone ของไทย (UTC+7)
  const bangkokOffset = 7 * 60; // minutes
  const localOffset = targetDate.getTimezoneOffset();
  const offsetDiff = bangkokOffset + localOffset;
  targetDate.setMinutes(targetDate.getMinutes() + offsetDiff);

  if (dayText === "วันนี้") {
    // วันนี้
  } else if (dayText === "พรุ่งนี้") {
    targetDate.setDate(targetDate.getDate() + 1);
  } else {
    // วันในสัปดาห์ (ตอนนี้ default เป็นพรุ่งนี้)
    targetDate.setDate(targetDate.getDate() + 1);
  }

  targetDate.setHours(hour, minute, 0, 0);

  // ถ้าเวลาที่ตั้งเป็นอดีต (สำหรับวันนี้)
  if (targetDate < now) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  return {
    title: title,
    datetime: targetDate,
  };
}
