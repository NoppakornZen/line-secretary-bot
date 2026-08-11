# 🚀 ขั้นตอนที่คุณต้องทำเอง (3 ขั้นตอนเท่านั้น!)

ผมทำให้เกือบหมดแล้ว! เหลือแค่ 3 ขั้นตอนที่คุณต้องทำเอง (เพราะต้องใช้บัญชีของคุณ)

---

## ✅ สิ่งที่ผมทำให้แล้ว:

- ✅ สร้างโค้ดทั้งหมด 8 ไฟล์
- ✅ สร้างเอกสารทั้งหมด 6 ไฟล์
- ✅ สร้าง Git repository
- ✅ Commit โค้ดทั้งหมด
- ✅ เตรียมคำสั่งที่ใช้ทั้งหมด

---

## 📝 ขั้นตอนที่คุณต้องทำ (3 ขั้นตอน):

### ขั้นตอนที่ 1: สร้าง GitHub Repository (2 นาที)

1. ไปที่ https://github.com/new
2. กรอก:
   - **Repository name**: `line-secretary-bot`
   - **Description**: `LINE Secretary Bot`
   - **Visibility**: Public หรือ Private (อะไรก็ได้)
   - **ไม่ต้อง** เลือก Initialize with README
3. กด **Create repository**
4. **คัดลอก URL** ที่ได้ เช่น: `https://github.com/YOUR_USERNAME/line-secretary-bot.git`

### ขั้นตอนที่ 2: Push โค้ดขึ้น GitHub (1 นาที)

เปิด PowerShell แล้วรันคำสั่งนี้ (เปลี่ยน YOUR_USERNAME เป็นชื่อ GitHub ของคุณ):

```powershell
cd C:\Users\Zen\Desktop\line-secretary-bot-deno

git remote add origin https://github.com/YOUR_USERNAME/line-secretary-bot.git
git branch -M main
git push -u origin main
```

**หมายเหตุ:** ถ้า Git ขอ login:
- Username: ใส่ชื่อ GitHub ของคุณ
- Password: ใส่ **Personal Access Token** (ไม่ใช่รหัสผ่าน!)
  - สร้าง Token ได้ที่: https://github.com/settings/tokens
  - กด "Generate new token (classic)"
  - เลือก "repo" scope
  - คัดลอก Token ที่ได้มาใส่

### ขั้นตอนที่ 3: Deploy บน Deno Deploy (5 นาที)

**3.1 สมัครบัญชี Deno Deploy:**
1. ไปที่ https://dash.deno.com/
2. กด **"Sign in with GitHub"**
3. อนุญาตให้ Deno เข้าถึง GitHub

**3.2 สร้าง Project:**
1. กด **"New Project"**
2. เลือก **"Deploy from GitHub"**
3. ถ้ายังไม่เคย connect → กด **"Connect to GitHub"**
4. เลือก Repository: `line-secretary-bot`
5. กด **"Install & Authorize"**
6. ตั้งค่า:
   - **Branch**: `main`
   - **Entry Point**: `main.ts`
   - **Project Name**: `secretary-bot` (หรือชื่ออื่นที่ชอบ)
7. กด **"Deploy Project"**

**3.3 ตั้งค่า Environment Variables:**

หลัง Deploy เสร็จ:
1. ไปแท็บ **"Settings"**
2. เลื่อนลงหา **"Environment Variables"**
3. กด **"Add Variable"** แล้วใส่:

   **Variable 1:**
   ```
   Key: LINE_CHANNEL_ACCESS_TOKEN
   Value: <ใส่ Channel Access Token ของคุณ>
   ```

   **Variable 2:**
   ```
   Key: LINE_CHANNEL_SECRET
   Value: <ใส่ Channel Secret ของคุณ>
   ```

4. กด **"Save"** หลังใส่แต่ละตัว
5. **คัดลอก Deployment URL** ที่ได้ เช่น: `https://secretary-bot-xxxxx.deno.dev`

**3.4 ตั้งค่า Webhook URL ใน LINE:**

1. ไปที่ https://developers.line.biz/console/
2. เข้า Channel ของคุณ
3. ไปแท็บ **"Messaging API"**
4. เลื่อนลงหา **"Webhook settings"**
5. กด **"Edit"** แล้วใส่:
   ```
   https://your-project-name.deno.dev/webhook
   ```
   (เปลี่ยน your-project-name เป็น URL จริง + **อย่าลืม /webhook ท้าย URL!**)
6. กด **"Update"**
7. กด **"Verify"** → ควรได้ **"Success"** ✅
8. เปิด **"Use webhook"** เป็น **ON**

**3.5 ปิด Auto-reply:**

ในแท็บเดียวกัน:
- เลื่อนหา **"Auto-reply messages"** → กด Edit → **Disabled**
- เลื่อนหา **"Greeting messages"** → กด Edit → **Disabled**

---

## 🎉 ทดสอบบอท:

1. **เพิ่มเพื่อนกับบอท:**
   - ในแท็บ "Messaging API"
   - เลื่อนหา "Bot information"
   - สแกน QR Code

2. **ส่งคำสั่งทดสอบ:**
   ```
   งาน ทดสอบบอท วันนี้ 18:00
   ```

3. **บอทควรตอบกลับยืนยัน ✅**

---

## 🐛 ถ้าบอทไม่ตอบ:

1. ตรวจสอบ Webhook URL ถูกต้อง (ลงท้ายด้วย `/webhook`)
2. ตรวจสอบ Environment Variables ถูกต้อง
3. ดู Logs: Deno Deploy Dashboard → แท็บ **"Logs"**
4. กด Verify ใน LINE Webhook Settings อีกครั้ง

---

## 📞 ช่วยเหลือเพิ่มเติม:

- อ่านคู่มือละเอียด: `SETUP_GUIDE.md`
- ดู Logs: https://dash.deno.com/ → Project → Logs
- LINE Developers Console: https://developers.line.biz/console/

---

## 💡 สรุป:

คุณต้องทำแค่:
1. ✅ สร้าง GitHub Repository (2 นาที)
2. ✅ Push โค้ด (1 นาที) 
3. ✅ Deploy + ตั้งค่า (5 นาที)

**รวมแค่ 8 นาที!** 🚀

---

**ผมทำให้เกือบหมดแล้ว! เหลือแค่ 3 ขั้นตอนที่ต้องใช้บัญชีของคุณ** 💪
