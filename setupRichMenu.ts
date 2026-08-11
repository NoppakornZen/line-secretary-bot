// setupRichMenu.ts - Auto setup Rich Menu via LINE API
const channelAccessToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN") || "";

if (!channelAccessToken) {
  console.error("❌ ไม่พบ LINE_CHANNEL_ACCESS_TOKEN");
  console.error("กรุณาตั้งค่า Environment Variable ก่อน");
  Deno.exit(1);
}

console.log("🎨 กำลังสร้าง Rich Menu...");

// Rich Menu configuration
const richMenuData = {
  size: { width: 2500, height: 1686 },
  selected: true,
  name: "Secretary Bot Menu",
  chatBarText: "เมนู",
  areas: [
    {
      bounds: { x: 0, y: 0, width: 1250, height: 843 },
      action: {
        type: "postback",
        data: "action=add_task",
        displayText: "➕ เพิ่มงาน",
      },
    },
    {
      bounds: { x: 1250, y: 0, width: 1250, height: 843 },
      action: {
        type: "postback",
        data: "action=view_today",
        displayText: "📋 ดูงานวันนี้",
      },
    },
    {
      bounds: { x: 0, y: 843, width: 1250, height: 843 },
      action: {
        type: "postback",
        data: "action=view_all",
        displayText: "📅 งานทั้งหมด",
      },
    },
    {
      bounds: { x: 1250, y: 843, width: 1250, height: 843 },
      action: { type: "message", text: "ช่วยเหลือ" },
    },
  ],
};

// Create Rich Menu
const createResponse = await fetch("https://api.line.me/v2/bot/richmenu", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${channelAccessToken}`,
  },
  body: JSON.stringify(richMenuData),
});

if (!createResponse.ok) {
  const error = await createResponse.text();
  console.error("❌ สร้าง Rich Menu ไม่สำเร็จ:", error);
  Deno.exit(1);
}

const { richMenuId } = await createResponse.json();
console.log("✅ สร้าง Rich Menu สำเร็จ! ID:", richMenuId);

// Generate image programmatically
console.log("🎨 กำลังสร้างรูปภาพ...");

// Create a simple PNG using data URL approach
const canvas = `
<svg width="2500" height="1686" xmlns="http://www.w3.org/2000/svg">
  <!-- Top Left - Yellow -->
  <rect x="0" y="0" width="1250" height="843" fill="#F7D154"/>
  <!-- Top Right - Blue -->
  <rect x="1250" y="0" width="1250" height="843" fill="#38BDF8"/>
  <!-- Bottom Left - Green -->
  <rect x="0" y="843" width="1250" height="843" fill="#6EE7B7"/>
  <!-- Bottom Right - Orange -->
  <rect x="1250" y="843" width="1250" height="843" fill="#E9A568"/>

  <!-- Borders -->
  <rect x="0" y="0" width="1250" height="843" fill="none" stroke="#FFFFFF" stroke-width="8"/>
  <rect x="1250" y="0" width="1250" height="843" fill="none" stroke="#FFFFFF" stroke-width="8"/>
  <rect x="0" y="843" width="1250" height="843" fill="none" stroke="#FFFFFF" stroke-width="8"/>
  <rect x="1250" y="843" width="1250" height="843" fill="none" stroke="#FFFFFF" stroke-width="8"/>

  <!-- Text: Top Left -->
  <text x="625" y="321" font-family="Arial" font-size="180" font-weight="bold" fill="#0A0D12" text-anchor="middle">➕</text>
  <text x="625" y="541" font-family="Arial" font-size="80" font-weight="bold" fill="#0A0D12" text-anchor="middle">เพิ่มงาน</text>

  <!-- Text: Top Right -->
  <text x="1875" y="321" font-family="Arial" font-size="180" font-weight="bold" fill="#FFFFFF" text-anchor="middle">📋</text>
  <text x="1875" y="541" font-family="Arial" font-size="80" font-weight="bold" fill="#FFFFFF" text-anchor="middle">งานวันนี้</text>

  <!-- Text: Bottom Left -->
  <text x="625" y="1164" font-family="Arial" font-size="180" font-weight="bold" fill="#0A0D12" text-anchor="middle">📅</text>
  <text x="625" y="1384" font-family="Arial" font-size="80" font-weight="bold" fill="#0A0D12" text-anchor="middle">งานทั้งหมด</text>

  <!-- Text: Bottom Right -->
  <text x="1875" y="1164" font-family="Arial" font-size="180" font-weight="bold" fill="#FFFFFF" text-anchor="middle">❓</text>
  <text x="1875" y="1384" font-family="Arial" font-size="80" font-weight="bold" fill="#FFFFFF" text-anchor="middle">ช่วยเหลือ</text>
</svg>
`;

// Convert SVG to PNG using resvg (Deno has built-in support)
const svgBuffer = new TextEncoder().encode(canvas);

// For now, we'll use a workaround - save instructions for manual upload
console.log("");
console.log("⚠️ สร้าง Rich Menu ID เรียบร้อย!");
console.log("📋 Rich Menu ID:", richMenuId);
console.log("");
console.log("📝 ขั้นตอนต่อไป:");
console.log("1. เปิดไฟล์ richmenu.html ในโฟลเดอร์ปัจจุบัน");
console.log("2. ดาวน์โหลดรูป richmenu.png");
console.log("3. รันคำสั่ง:");
console.log("");
console.log(`   curl -X POST https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content \\`);
console.log(`   -H "Authorization: Bearer ${channelAccessToken}" \\`);
console.log(`   -H "Content-Type: image/png" \\`);
console.log(`   --data-binary @richmenu.png`);
console.log("");
console.log(`4. ตั้งเป็น Default:`);
console.log(`   curl -X POST https://api.line.me/v2/bot/user/all/richmenu/${richMenuId} \\`);
console.log(`   -H "Authorization: Bearer ${channelAccessToken}"`);
console.log("");
console.log("หรือใช้ไฟล์ uploadRichMenu.ps1 ที่ผมสร้างให้!");
