# 🚀 Deployment Guide - Deno Deploy

คู่มือ Deploy LINE Secretary Bot บน Deno Deploy แบบละเอียด

---

## 🎯 ภาพรวม

การ Deploy บน Deno Deploy ทำได้ 2 วิธี:
1. **Deploy จาก GitHub** (แนะนำ - Auto Deploy เมื่อมีการอัปเดตโค้ด)
2. **Deploy ด้วย CLI** (Deploy ด้วยคำสั่ง)

---

## 📦 วิธีที่ 1: Deploy จาก GitHub (แนะนำ)

### ขั้นตอนที่ 1: สร้าง GitHub Repository

1. ไปที่ https://github.com/new
2. กรอกข้อมูล:
   - **Repository name**: `line-secretary-bot`
   - **Description**: `LINE Secretary Bot with Deno`
   - **Visibility**: Public หรือ Private (เลือกอะไรก็ได้)
   - **ไม่ต้อง** เลือก Initialize with README
3. กด **Create repository**

### ขั้นตอนที่ 2: Push โค้ดขึ้น GitHub

เปิด PowerShell/Terminal และรันคำสั่ง:

```powershell
# 1. เข้าไปในโฟลเดอร์โปรเจค
cd C:\Users\Zen\Desktop\line-secretary-bot-deno

# 2. Initialize Git repository
git init

# 3. เพิ่มไฟล์ทั้งหมด
git add .

# 4. Commit
git commit -m "Initial commit: LINE Secretary Bot"

# 5. เชื่อมต่อกับ GitHub (เปลี่ยน YOUR_USERNAME เป็นชื่อ GitHub ของคุณ)
git remote add origin https://github.com/YOUR_USERNAME/line-secretary-bot.git

# 6. Push ขึ้น GitHub
git branch -M main
git push -u origin main
```

**หมายเหตุ:** ถ้า Git ขอ login:
- ใส่ Username: `ชื่อ GitHub ของคุณ`
- ใส่ Password: `Personal Access Token` (ไม่ใช่รหัสผ่าน)
  - สร้าง Token ได้ที่: https://github.com/settings/tokens

### ขั้นตอนที่ 3: เชื่อมต่อ Deno Deploy กับ GitHub

1. ไปที่ https://dash.deno.com/
2. Login ด้วย GitHub
3. กด **New Project**
4. เลือก **Deploy from GitHub**
5. ถ้ายังไม่เคยเชื่อม:
   - กด **Connect to GitHub**
   - เลือก Repository: `line-secretary-bot`
   - กด **Install & Authorize**

### ขั้นตอนที่ 4: ตั้งค่า Project

1. เลือก Repository: `line-secretary-bot`
2. เลือก Branch: `main`
3. **Entry Point**: `main.ts`
4. **Project Name**: `secretary-bot` (หรือชื่ออื่นที่ชอบ)
5. กด **Deploy Project**

### ขั้นตอนที่ 5: ตั้งค่า Environment Variables

1. ไปที่แท็บ **Settings** ใน Project
2. เลื่อนลงหา **Environment Variables**
3. กด **Add Variable**:

   **Variable 1:**
   ```
   Key: LINE_CHANNEL_ACCESS_TOKEN
   Value: <วาง Channel Access Token ของคุณ>
   ```

   **Variable 2:**
   ```
   Key: LINE_CHANNEL_SECRET
   Value: <วาง Channel Secret ของคุณ>
   ```

4. กด **Save** หลังใส่แต่ละตัว
5. Deployment จะรันใหม่อัตโนมัติ

### ขั้นตอนที่ 6: คัดลอก Deployment URL

หลัง Deploy เสร็จ คุณจะได้ URL เช่น:
```
https://secretary-bot-xxxxx.deno.dev
```

**เก็บ URL นี้ไว้** → ใช้ตั้งค่า Webhook ใน LINE Developers Console

### ขั้นตอนที่ 7: ทดสอบ Deployment

เปิดเบราว์เซอร์ไปที่:
```
https://your-project-name.deno.dev
```

ถ้าเห็นข้อความแบบนี้ = สำเร็จ ✅
```json
{
  "status": "running",
  "service": "LINE Secretary Bot",
  "timestamp": "2026-08-11T..."
}
```

---

## 💻 วิธีที่ 2: Deploy ด้วย CLI

### ขั้นตอนที่ 1: ติดตั้ง Deno (ถ้ายังไม่มี)

```powershell
irm https://deno.land/install.ps1 | iex
```

### ขั้นตอนที่ 2: ติดตั้ง deployctl

```powershell
deno install -Arf jsr:@deno/deployctl
```

### ขั้นตอนที่ 3: Login

```powershell
deployctl login
```

เบราว์เซอร์จะเปิดขึ้นมา → Login ด้วย GitHub

### ขั้นตอนที่ 4: Deploy

```powershell
cd C:\Users\Zen\Desktop\line-secretary-bot-deno

deployctl deploy --project=secretary-bot --prod main.ts
```

**หมายเหตุ:**
- `--project=secretary-bot`: ชื่อ Project (ตั้งชื่ออะไรก็ได้)
- `--prod`: Deploy เป็น Production
- ครั้งแรกจะสร้าง Project ใหม่อัตโนมัติ

### ขั้นตอนที่ 5: ตั้งค่า Environment Variables

ไปที่ https://dash.deno.com/ → เข้า Project → Settings → Environment Variables

เพิ่ม:
```
LINE_CHANNEL_ACCESS_TOKEN=your_token_here
LINE_CHANNEL_SECRET=your_secret_here
```

### ขั้นตอนที่ 6: Redeploy

หลังตั้งค่า Environment Variables ให้ Deploy อีกครั้ง:

```powershell
deployctl deploy --project=secretary-bot --prod main.ts
```

---

## 🔄 การอัปเดตโค้ด

### ถ้าใช้ GitHub (แนะนำ):

```powershell
cd C:\Users\Zen\Desktop\line-secretary-bot-deno

# แก้ไขโค้ด...

git add .
git commit -m "Update: คำอธิบายการเปลี่ยนแปลง"
git push
```

Deno Deploy จะ Deploy อัตโนมัติภายใน 30 วินาที ✅

### ถ้าใช้ CLI:

```powershell
cd C:\Users\Zen\Desktop\line-secretary-bot-deno

# แก้ไขโค้ด...

deployctl deploy --project=secretary-bot --prod main.ts
```

---

## 📊 ดู Logs และ Metrics

### วิธีที่ 1: ผ่าน Dashboard (แนะนำ)

1. ไปที่ https://dash.deno.com/
2. เข้า Project ของคุณ
3. แท็บ **Logs**: ดู Real-time logs
4. แท็บ **Metrics**: ดู Request count, Latency

### วิธีที่ 2: ผ่าน CLI

```powershell
# ดู Logs
deployctl logs --project=secretary-bot

# ดู Logs แบบ Follow (Real-time)
deployctl logs --project=secretary-bot --follow
```

---

## 🔍 ตรวจสอบการทำงาน

### ทดสอบ HTTP Endpoint

```powershell
# ทดสอบ Root endpoint
curl https://your-project-name.deno.dev/

# ควรได้ Response:
# {"status":"running","service":"LINE Secretary Bot","timestamp":"..."}
```

### ทดสอบ Webhook

LINE จะส่ง POST request มาที่:
```
https://your-project-name.deno.dev/webhook
```

ดู Logs ว่ามี Request เข้ามาหรือไม่:
```powershell
deployctl logs --project=secretary-bot
```

---

## ⚙️ การตั้งค่าขั้นสูง

### เปลี่ยน Branch ที่ Deploy (GitHub)

1. ไปที่ Project Settings
2. เลื่อนหา **Git Integration**
3. เปลี่ยน **Production Branch** เป็น branch ที่ต้องการ

### ตั้งค่า Custom Domain

1. ไปที่ Project Settings
2. เลื่อนหา **Domains**
3. กด **Add Domain**
4. ใส่ domain ของคุณ
5. ตั้งค่า DNS ตามที่แสดง

---

## 📈 Quotas และ Limits (Free Plan)

- ✅ **100,000 requests/day**
- ✅ **100 GB data transfer/month**
- ✅ **Deno KV: 1 GB storage**
- ✅ **Unlimited projects**
- ✅ **No credit card required**

สำหรับบอทส่วนตัว quota นี้เพียงพอมาก!

---

## 🛠️ Troubleshooting

### Deploy ไม่สำเร็จ

```powershell
# ตรวจสอบว่า Deno syntax ถูกต้อง
deno check main.ts

# ทดสอบรันบน Local
deno task start
```

### Environment Variables ไม่ทำงาน

1. ตรวจสอบชื่อตัวแปรว่าถูกต้อง
2. ไม่มีช่องว่างหน้าหรือหลังค่า
3. กด Save แล้ว Redeploy

### Cron Jobs ไม่ทำงาน

- Deno Cron จะทำงานเฉพาะ Production Deployment
- ตรวจสอบ Logs ว่ามี Cron logs หรือไม่
- รอประมาณ 1-2 นาที หลัง Deploy

---

## 🎉 เสร็จสิ้น!

Bot ของคุณพร้อมใช้งานบน Deno Deploy แล้ว!

**Next Steps:**
1. ตั้งค่า Webhook URL ใน LINE Developers Console
2. ทดสอบการใช้งานบอท
3. ติดตาม Logs และ Metrics

---

## 📚 Resources

- [Deno Deploy Docs](https://docs.deno.com/deploy/)
- [Deno KV Docs](https://docs.deno.com/kv/)
- [Deno Cron Docs](https://docs.deno.com/deploy/kv/manual/cron)
- [LINE Messaging API Docs](https://developers.line.biz/en/docs/messaging-api/)
