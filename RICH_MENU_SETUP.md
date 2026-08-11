# 🚀 วิธีตั้งค่า Rich Menu (ทำครั้งเดียว 5 นาที!)

## ⚡ วิธีที่ 1: ใช้สคริปต์อัตโนมัติ (แนะนำ!)

### เปิด PowerShell แล้วรัน:

```powershell
cd C:\Users\Zen\Desktop\line-secretary-bot-deno
.\setupRichMenu.ps1
```

สคริปต์จะ:
- เปิด LINE Developers Console อัตโนมัติ
- แสดงขั้นตอนให้ทำตาม
- คุณแค่คัดลอก-วางตามขั้นตอน!

---

## 📋 ขั้นตอนโดยสรุป (5 นาที):

### 1. เปิดไฟล์ HTML เพื่อสร้างรูป
```
ดับเบิลคลิก: C:\Users\Zen\Desktop\line-secretary-bot-deno\richmenu.html
→ จะดาวน์โหลดไฟล์ richmenu.png ไปที่ Downloads
```

### 2. ไปที่ LINE Developers Console
```
URL: https://developers.line.biz/console/
→ เข้า Channel
→ แท็บ "Messaging API"
→ เลื่อนหา "Rich menus"
→ กด "Create"
```

### 3. กรอกข้อมูล
```
Title: Secretary Bot Menu
Chat bar text: เมนู
Selected by default: ON (เปิด)
```

### 4. เลือก Template
```
กด "Choose template" → เลือก "2x2 grid"
```

### 5. ตั้งค่า 4 ช่อง

**ช่องที่ 1 (บนซ้าย):**
```
Action type: Postback
Postback data: action=add_task
Text to display: ➕ เพิ่มงาน
```

**ช่องที่ 2 (บนขวา):**
```
Action type: Postback
Postback data: action=view_today
Text to display: 📋 ดูงานวันนี้
```

**ช่องที่ 3 (ล่างซ้าย):**
```
Action type: Postback
Postback data: action=view_all
Text to display: 📅 งานทั้งหมด
```

**ช่องที่ 4 (ล่างขวา):**
```
Action type: Message
Text: ช่วยเหลือ
```

### 6. อัปโหลดรูป
```
กด "Upload image"
→ เลือกไฟล์ richmenu.png จาก Downloads
```

### 7. บันทึก
```
กด "Save"
```

---

## ✅ เสร็จแล้ว!

เปิดแชทบอท จะเห็นปุ่มเมนู 4 ปุ่มด้านล่างทันที! 🎉

---

## 🎨 ตัวอย่างรูป Rich Menu:

```
┌─────────────────┬─────────────────┐
│   เหลือง         │    ฟ้า          │
│    ➕            │    📋           │
│  เพิ่มงาน        │  งานวันนี้      │
├─────────────────┼─────────────────┤
│   เขียว         │    ส้ม          │
│    📅            │    ❓           │
│ งานทั้งหมด      │  ช่วยเหลือ      │
└─────────────────┴─────────────────┘
```

---

## 🐛 ถ้ามีปัญหา:

**ปัญหา 1: ไม่เห็นปุ่ม Rich Menu**
- รอ 1-2 นาที
- ปิดแชทแล้วเปิดใหม่
- ตรวจสอบว่า "Selected by default" เป็น ON

**ปัญหา 2: กดปุ่มแล้วไม่มีอะไรเกิดขึ้น**
- ตรวจสอบว่า Deploy บน Deno Deploy เสร็จแล้ว
- ดู Logs ว่า Postback event เข้ามาไหม

**ปัญหา 3: รูปไม่ผ่าน**
- ตรวจสอบขนาดต้องเป็น 2500x1686 px
- ไฟล์ต้องเป็น PNG
- ขนาดไฟล์ไม่เกิน 1 MB

---

## 💡 Tips:

- Rich Menu จะแสดงให้ทุกคนที่เพิ่มเพื่อนใหม่
- สามารถมี Rich Menu หลายอันและสลับได้
- ถ้าต้องการเปลี่ยนรูป ให้สร้างใหม่แล้วลบอันเก่า

---

**พร้อมแล้วเริ่มได้เลย! รันคำสั่งนี้:**

```powershell
cd C:\Users\Zen\Desktop\line-secretary-bot-deno
.\setupRichMenu.ps1
```

🚀 **หรือทำตามขั้นตอนข้างบนด้วยตัวเอง!**
