# ✅ Checklist การติดตั้ง LINE Secretary Bot

ใช้ Checklist นี้เพื่อตรวจสอบว่าคุณทำครบทุกขั้นตอนแล้ว!

---

## 📋 Part 1: สร้าง LINE Bot

- [ ] เข้า LINE Developers Console (https://developers.line.biz/console/)
- [ ] สร้าง Provider ใหม่ (ถ้ายังไม่มี)
- [ ] สร้าง Messaging API Channel
- [ ] ได้ Channel Access Token แล้ว
- [ ] ได้ Channel Secret แล้ว
- [ ] เปิด "Use webhooks" เป็น ON
- [ ] ปิด "Auto-reply messages"
- [ ] ปิด "Greeting messages"

---

## 📋 Part 2: Deploy บน Deno Deploy

### วิธี GitHub:
- [ ] สร้าง Repository บน GitHub
- [ ] Push โค้ดขึ้น GitHub
- [ ] Login Deno Deploy ด้วย GitHub
- [ ] สร้าง Project ใหม่
- [ ] เชื่อมต่อกับ GitHub Repository
- [ ] ตั้ง Entry Point เป็น `main.ts`
- [ ] Deploy สำเร็จ
- [ ] ได้ URL: `https://your-project.deno.dev`

### วิธี CLI:
- [ ] ติดตั้ง Deno
- [ ] ติดตั้ง deployctl
- [ ] Login deployctl
- [ ] Deploy ด้วยคำสั่ง `deployctl deploy`
- [ ] ได้ URL: `https://your-project.deno.dev`

---

## 📋 Part 3: ตั้งค่า Environment Variables

- [ ] เข้า Deno Deploy Dashboard
- [ ] ไปที่ Project Settings
- [ ] เพิ่ม `LINE_CHANNEL_ACCESS_TOKEN`
- [ ] เพิ่ม `LINE_CHANNEL_SECRET`
- [ ] กด Save
- [ ] Deployment รันใหม่อัตโนมัติ

---

## 📋 Part 4: เชื่อมต่อ Webhook

- [ ] กลับไปที่ LINE Developers Console
- [ ] ไปแท็บ "Messaging API"
- [ ] ตั้ง Webhook URL: `https://your-project.deno.dev/webhook`
- [ ] กด Update
- [ ] กด Verify → ได้ "Success"
- [ ] Webhook เปิดใช้งาน (ON)

---

## 📋 Part 5: ทดสอบการใช้งาน

- [ ] สแกน QR Code เพื่อเพิ่มเพื่อนกับบอท
- [ ] ส่งคำสั่ง: `ช่วยเหลือ`
- [ ] ได้รับข้อความวิธีใช้งาน
- [ ] ส่งคำสั่ง: `งาน ทดสอบ วันนี้ 18:00`
- [ ] ได้รับข้อความยืนยันว่าสร้างงานเรียบร้อย

---

## 📋 Part 6: ทดสอบฟีเจอร์

### Reminder (เตือนล่วงหน้า):
- [ ] สร้างงานที่จะเกิดขึ้นใน 40 นาที
- [ ] รอ 10 นาที (เหลือ 30 นาที)
- [ ] ได้รับข้อความเตือนจากบอท

### Morning Digest (สรุปเช้า):
- [ ] สร้างงานวันพรุ่งนี้
- [ ] รอถึง 8:00 น. วันถัดไป
- [ ] ได้รับสรุปงานวันนี้จากบอท

---

## 📋 Part 7: ตรวจสอบ Logs

- [ ] เข้า Deno Deploy Dashboard
- [ ] ไปแท็บ "Logs"
- [ ] เห็น Logs ว่า Webhook ทำงาน
- [ ] เห็น Logs ว่า Cron jobs ถูก register

---

## 🎉 สำเร็จแล้ว!

ถ้าทำครบทุกข้อ ✅ แสดงว่าบอทของคุณพร้อมใช้งาน 100% แล้ว!

---

## 🐛 ถ้ามีปัญหา

ตรวจสอบตามลำดับ:

1. **Bot ไม่ตอบกลับ**
   - [ ] Webhook URL ถูกต้อง (ลงท้ายด้วย `/webhook`)
   - [ ] Environment Variables ถูกต้อง
   - [ ] Webhook Verify ผ่าน
   - [ ] ดู Logs ใน Deno Deploy

2. **ไม่ได้รับการเตือน**
   - [ ] รูปแบบคำสั่งถูกต้อง
   - [ ] Cron jobs ทำงาน (ดู Logs)
   - [ ] เวลาที่ตั้งยังไม่ผ่านไป

3. **ไม่ได้รับ Morning Digest**
   - [ ] สร้างงานวันนี้แล้ว
   - [ ] รอถึง 8:00 น. (เวลาไทย)
   - [ ] Cron ทำงาน (ดู Logs)

---

## 📞 Resources

- [README.md](README.md) - ภาพรวม
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - คู่มือติดตั้ง
- [DEPLOYMENT.md](DEPLOYMENT.md) - คู่มือ Deploy
- [QUICK_START.md](QUICK_START.md) - Quick Start
- Deno Deploy Logs: https://dash.deno.com/

---

**Good luck! 🚀**
