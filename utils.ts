// utils.ts - Helper functions

export function formatDate(date: Date): string {
  const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${dayName} ${day} ${month}`;
}

export function formatTime(date: Date): string {
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${hour}:${minute} น.`;
}

export function getBangkokTime(): Date {
  const now = new Date();
  const bangkokOffset = 7 * 60; // UTC+7 in minutes
  const localOffset = now.getTimezoneOffset();
  const offsetDiff = bangkokOffset + localOffset;

  const bangkokTime = new Date(now.getTime() + offsetDiff * 60000);
  return bangkokTime;
}
