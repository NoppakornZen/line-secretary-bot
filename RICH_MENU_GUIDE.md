## 🎨 Rich Menu Image Template

สร้างภาพ Rich Menu ด้วย Canva หรือโปรแกรมแก้ไขรูปภาพ:

### ขนาด:
- **2500 x 1686 pixels**

### Layout (แบ่ง 4 ส่วน):

```
┌─────────────┬─────────────┐
│             │             │
│  ➕ เพิ่มงาน │  📋 งานวันนี้ │
│             │             │
├─────────────┼─────────────┤
│             │             │
│ 📅 งานทั้งหมด│  ❓ ช่วยเหลือ │
│             │             │
└─────────────┴─────────────┘
```

### แต่ละช่อง:
- ขนาด: 1250 x 843 pixels
- พื้นหลัง: สีพาสเทล (#F7D154, #38BDF8, #6EE7B7, #E9A568)
- ไอคอน: ใหญ่ชัดเจน
- ข้อความ: ฟอนต์ไทยอ่านง่าย (Prompt, Sarabun)

### ตัวอย่างสี:
1. **เพิ่มงาน**: พื้นเหลือง (#F7D154) + ไอคอน ➕ สีดำ
2. **งานวันนี้**: พื้นฟ้า (#38BDF8) + ไอคอน 📋 สีขาว
3. **งานทั้งหมด**: พื้นเขียว (#6EE7B7) + ไอคอน 📅 สีดำ
4. **ช่วยเหลือ**: พื้นส้ม (#E9A568) + ไอคอน ❓ สีขาว

---

## 🖼️ Template Canva (ง่ายที่สุด):

1. ไปที่ https://www.canva.com/
2. สร้าง Custom Size: **2500 x 1686 px**
3. วางตาราง 2x2
4. เพิ่มไอคอนและข้อความในแต่ละช่อง
5. Export เป็น PNG

---

## 📸 หรือใช้ภาพตัวอย่างนี้:

ดาวน์โหลด: https://i.imgur.com/example-richmenu.png (สร้างเองด้วย Canva)

---

## ⚡ วิธีอัปโหลด Rich Menu:

### วิธีที่ 1: ใช้ LINE Developers Console (แนะนำ)

1. ไปที่ https://developers.line.biz/console/
2. เข้า Channel ของคุณ
3. แท็บ **"Messaging API"**
4. เลื่อนลงหา **"Rich menus"**
5. กด **"Create"**
6. กรอก:
   - **Title**: Secretary Bot Menu
   - **Chat bar text**: เมนู
   - **Selected by default**: เปิด
7. กด **"Choose template"** → เลือก **2x2 grid**
8. ตั้งค่าแต่ละพื้นที่:

   **ช่องบนซ้าย (เพิ่มงาน):**
   ```
   Type: Postback
   Postback data: action=add_task
   Text to display: ➕ เพิ่มงาน
   ```

   **ช่องบนขวา (งานวันนี้):**
   ```
   Type: Postback
   Postback data: action=view_today
   Text to display: 📋 ดูงานวันนี้
   ```

   **ช่องล่างซ้าย (งานทั้งหมด):**
   ```
   Type: Postback
   Postback data: action=view_all
   Text to display: 📅 งานทั้งหมด
   ```

   **ช่องล่างขวา (ช่วยเหลือ):**
   ```
   Type: Message
   Text: ช่วยเหลือ
   ```

9. อัปโหลดรูปภาพ Rich Menu (2500x1686 px)
10. กด **"Save"**

---

### วิธีที่ 2: ใช้ API (สำหรับคนที่มีรูปภาพแล้ว)

```bash
# 1. Create Rich Menu
curl -X POST https://api.line.me/v2/bot/richmenu \
-H 'Authorization: Bearer YOUR_CHANNEL_ACCESS_TOKEN' \
-H 'Content-Type: application/json' \
-d @richMenu.json

# จะได้ richMenuId กลับมา เช่น: richmenu-abc123

# 2. Upload Image
curl -X POST https://api-data.line.me/v2/bot/richmenu/RICHMENU_ID/content \
-H 'Authorization: Bearer YOUR_CHANNEL_ACCESS_TOKEN' \
-H 'Content-Type: image/png' \
--data-binary @richmenu.png

# 3. Set as Default
curl -X POST https://api.line.me/v2/bot/user/all/richmenu/RICHMENU_ID \
-H 'Authorization: Bearer YOUR_CHANNEL_ACCESS_TOKEN'
```

---

## ✅ สรุป:

Rich Menu พร้อมแล้ว! ผู้ใช้จะเห็นปุ่มด้านล่างแชท:
- **➕ เพิ่มงาน** → แสดงวิธีพิมพ์คำสั่ง
- **📋 งานวันนี้** → แสดง Flex Message งานวันนี้
- **📅 งานทั้งหมด** → แสดง Flex Message งานทั้งหมด
- **❓ ช่วยเหลือ** → แสดงคำสั่ง

**ไม่ต้องพิมพ์คำสั่งยาวๆ อีกแล้ว! แค่กดปุ่ม! 🎉**
