# 📖 คู่มือติดตั้ง LINE Secretary Bot

คู่มือนี้จะพาคุณติดตั้งบอทตั้งแต่เริ่มต้นจนใช้งานได้จริง 100%

---

## 📋 สิ่งที่ต้องเตรียม

- [ ] บัญชี LINE (สำหรับเพิ่มเพื่อนกับบอท)
- [ ] บัญชี LINE Developers (สมัครฟรีที่ https://developers.line.biz)
- [ ] บัญชี GitHub (สำหรับ Deploy ผ่าน Deno Deploy)
- [ ] ไม่ต้องมีบัตรเครดิต ✅

---

## ⏱️ เวลาที่ใช้

ประมาณ **15-20 นาที** (ถ้าทำครั้งแรก)

---

## 📝 ขั้นตอนที่ 1: สร้าง LINE Bot

### 1.1 เข้า LINE Developers Console

1. ไปที่ https://developers.line.biz/console/
2. เข้าสู่ระบบด้วยบัญชี LINE ของคุณ
3. กด **"Create a new provider"** (ถ้ายังไม่เคยสร้าง)
   - ใส่ชื่อ Provider: `My Bots` (หรือชื่ออื่นก็ได้)

### 1.2 สร้าง Messaging API Channel

1. กดปุ่ม **"Create a Messaging API channel"**
2. กรอกข้อมูล:
   - **Channel name**: `Secretary Bot` (หรือชื่อที่ชอบ)
   - **Channel description**: `บอทเลขานุการส่วนตัว`
   - **Category**: `Productivity`
   - **Subcategory**: `Tools`
3. ยอมรับ Terms of Use
4. กด **"Create"**

### 1.3 ดึง Credentials

1. เข้าไปที่ Channel ที่สร้างไว้
2. ไปที่แท็บ **"Messaging API"**
3. เลื่อนลงหา **"Channel access token"**
   - กด **"Issue"** เพื่อสร้าง Token
   - **คัดลอก Token นี้** → เก็บไว้ใช้ในขั้นตอนที่ 3
4. เลื่อนขึ้นหา **"Channel secret"**
   - **คัดลอก Secret นี้** → เก็บไว้ใช้ในขั้นตอนที่ 3

### 1.4 ตั้งค่า Bot

1. ในแท็บ **"Messaging API"** เลื่อนลงหา:
   - **"Use webhooks"**: เปิดใช้งาน (ON)
   - **"Allow bot to join group chats"**: ปิด (OFF) - ถ้าใช้แค่ส่วนตัว
2. ไปที่แท็บ **"Basic settings"**
   - เลื่อนลงหา **"Your user ID"**
   - **คัดลอก User ID** → เก็บไว้ทดสอบภายหลัง

✅ **เสร็จขั้นตอนที่ 1!** คุณมี:
- Channel access token
- Channel secret
- Bot User ID

---

## 🚀 ขั้นตอนที่ 2: Deploy บน Deno Deploy

### 2.1 สมัครบัญชี Deno Deploy

1. ไปที่ https://dash.deno.com/
2. กด **"Sign in with GitHub"**
3. อนุญาตให้ Deno เข้าถึง GitHub account

### 2.2 สร้าง Project ใหม่

1. กด **"New Project"**
2. เลือก **"Deploy from GitHub"**
3. กด **"Connect to GitHub"** (ถ้ายังไม่เคย connect)
4. อนุญาตให้ Deno Deploy เข้าถึง repository

### 2.3 อัปโหลดโค้ด

#### วิธีที่ 1: ใช้ GitHub (แนะนำ)

1. สร้าง Repository ใหม่บน GitHub:
   - ไปที่ https://github.com/new
   - ตั้งชื่อ: `line-secretary-bot`
   - เลือก **Public** หรือ **Private** ก็ได้
   - กด **"Create repository"**

2. อัปโหลดโค้ดขึ้น GitHub:

```bash
cd C:\Users\Zen\Desktop\line-secretary-bot-deno
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/line-secretary-bot.git
git push -u origin main
```

3. กลับไปที่ Deno Deploy Dashboard
4. กด **"New Project"** → **"Deploy from GitHub"**
5. เลือก repository: `line-secretary-bot`
6. ตั้งค่า:
   - **Branch**: `main`
   - **Entry Point**: `main.ts`
7. กด **"Deploy Project"**

#### วิธีที่ 2: Deploy ด้วย CLI (ถ้าไม่อยากใช้ GitHub)

```bash
# 1. ติดตั้ง deployctl
deno install -Arf jsr:@deno/deployctl

# 2. Login
deployctl login

# 3. Deploy
cd C:\Users\Zen\Desktop\line-secretary-bot-deno
deployctl deploy --project=secretary-bot main.ts
```

### 2.4 ดูข้อมูล Project

หลัง Deploy เสร็จ จะได้ URL แบบนี้:
```
https://secretary-bot-xxxxx.deno.dev
```

**เก็บ URL นี้ไว้** → จะใช้ในขั้นตอนที่ 4

---

## 🔐 ขั้นตอนที่ 3: ตั้งค่า Environment Variables

### 3.1 เข้า Project Settings

1. ใน Deno Deploy Dashboard
2. เข้าไปที่ Project ที่สร้างไว้
3. กดแท็บ **"Settings"**
4. เลื่อนลงหา **"Environment Variables"**

### 3.2 เพิ่ม Variables

กด **"Add Variable"** และใส่ค่าดังนี้:

**Variable 1:**
- **Key**: `LINE_CHANNEL_ACCESS_TOKEN`
- **Value**: `<วาง Channel Access Token จากขั้นตอนที่ 1.3>`

**Variable 2:**
- **Key**: `LINE_CHANNEL_SECRET`
- **Value**: `<วาง Channel Secret จากขั้นตอนที่ 1.3>`

### 3.3 Save และ Redeploy

1. กด **"Save"** หลังใส่แต่ละตัว
2. Deno Deploy จะ redeploy อัตโนมัติ
3. รอ deployment เสร็จ (ประมาณ 10-30 วินาที)

✅ **เสร็จขั้นตอนที่ 3!** Bot มี credentials แล้ว

---

## 🔗 ขั้นตอนที่ 4: เชื่อมต่อ Webhook

### 4.1 กลับไปที่ LINE Developers Console

1. ไปที่ https://developers.line.biz/console/
2. เข้าไปที่ Channel ของคุณ
3. ไปแท็บ **"Messaging API"**

### 4.2 ตั้งค่า Webhook URL

1. เลื่อนลงหา **"Webhook settings"**
2. กด **"Edit"** ที่ช่อง **Webhook URL**
3. ใส่ URL ในรูปแบบ:
   ```
   https://your-project-name-xxxxx.deno.dev/webhook
   ```
   - เปลี่ยน `your-project-name-xxxxx` เป็น URL จริงจากขั้นตอนที่ 2.4
   - **ห้ามลืม `/webhook` ท้าย URL!**
4. กด **"Update"**
5. เปิด **"Use webhook"** เป็น ON
6. กด **"Verify"** เพื่อทดสอบการเชื่อมต่อ
   - ถ้าขึ้น **"Success"** แสดงว่าเชื่อมต่อสำเร็จ ✅
   - ถ้า Error ให้ตรวจสอบ URL และ Environment Variables

### 4.3 ปิด Auto-reply

เลื่อนลงหา **"Auto-reply messages"**:
- กด **"Edit"** → ปิด (Disabled)

เลื่อนหา **"Greeting messages"**:
- กด **"Edit"** → ปิด (Disabled)

✅ **เสร็จขั้นตอนที่ 4!** Webhook พร้อมใช้งาน

---

## ✅ ขั้นตอนที่ 5: ทดสอบบอท

### 5.1 เพิ่มเพื่อนกับบอท

1. ใน LINE Developers Console → แท็บ **"Messaging API"**
2. เลื่อนหา **"Bot information"**
3. สแกน **QR Code** เพื่อเพิ่มเพื่อนกับบอท

### 5.2 ทดสอบคำสั่ง

ส่งข้อความไปหาบอท:

**ทดสอบ 1: ดูวิธีใช้**
```
ช่วยเหลือ
```
✅ ควรได้ข้อความวิธีใช้งาน

**ทดสอบ 2: สร้างงาน**
```
งาน ทดสอบบอท วันนี้ 18:00
```
✅ ควรได้ข้อความยืนยันว่าสร้างงานเรียบร้อย

**ทดสอบ 3: รอเตือน**
- รอ 30 นาทีก่อนถึง 18:00
- บอทจะส่งข้อความเตือนมาให้ ⏰

**ทดสอบ 4: Morning Digest**
- รอถึง 8:00 น. วันถัดไป
- บอทจะส่งสรุปงานวันนี้มาให้ ☀️

---

## 🎉 สำเร็จแล้ว!

บอทของคุณพร้อมใช้งาน 100% แล้ว!

---

## 🐛 แก้ปัญหา

### Bot ไม่ตอบกลับ

1. ตรวจสอบ Webhook URL ว่าถูกต้อง (ลงท้ายด้วย `/webhook`)
2. ตรวจสอบ Environment Variables ใน Deno Deploy
3. ดู Logs ใน Deno Deploy Dashboard → แท็บ **"Logs"**
4. กด Verify ใน LINE Webhook Settings อีกครั้ง

### Bot ตอบช้า

- Deno Deploy Free Plan มี cold start ประมาณ 1-3 วินาที
- หลังใช้งานต่อเนื่อง จะเร็วขึ้น

### ไม่ได้รับการเตือน

1. ตรวจสอบว่า Cron Jobs ทำงาน → ดู Logs ใน Deno Deploy
2. ตรวจสอบว่า Format คำสั่งถูกต้อง
3. ตรวจสอบว่า Push API Messages ยังไม่เกิน 500 ข้อความ/เดือน

### ไม่ได้รับ Morning Digest

- Cron ทำงานเวลา 8:00 น. ตามเวลา UTC+7 (เวลาไทย)
- ตรวจสอบ Logs ว่า Cron ทำงานหรือไม่

---

## 📞 ต้องการความช่วยเหลือ?

- ดู Logs: Deno Deploy Dashboard → แท็บ **"Logs"**
- ดู Code: `C:\Users\Zen\Desktop\line-secretary-bot-deno`
- อ่าน README.md สำหรับข้อมูลเพิ่มเติม

---

**🎊 ขอให้สนุกกับการใช้งานบอท!**
