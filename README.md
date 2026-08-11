# 🤖 LINE Secretary Bot (Deno Deploy)

บอทเลขานุการส่วนตัวบน LINE ที่ช่วยจัดการงานและเตือนความจำ

## ✨ ฟีเจอร์

- ✅ เพิ่มงานด้วยคำสั่งภาษาไทยง่ายๆ
- ⏰ เตือนล่วงหน้า 30 นาที ก่อนถึงเวลางาน
- ☀️ ส่งสรุปงานวันนี้ทุกเช้า 8:00 น.
- 💾 จัดเก็บข้อมูลด้วย Deno KV (ฟรี)
- 🚀 Deploy บน Deno Deploy (ฟรี 100%)

## 📝 วิธีใช้งาน

ส่งข้อความในรูปแบบ:

```
งาน [ชื่องาน] [วันนี้/พรุ่งนี้] [เวลา]
```

### ตัวอย่าง:

- `งาน ประชุมทีม วันนี้ 14:30`
- `งาน ส่งรายงาน พรุ่งนี้ 09:00`
- `งาน โทรหาหมอ วันนี้ 16:00`

### คำสั่งอื่นๆ:

- `ช่วยเหลือ` หรือ `help` - ดูวิธีใช้งาน

## 🏗️ สถาปัตยกรรม

```
main.ts          → HTTP Server + Webhook Handler
cron.ts          → Reminder Scheduler + Morning Digest
database.ts      → Deno KV Operations
parser.ts        → Thai Command Parser
line.ts          → LINE Messaging API Client
utils.ts         → Helper Functions (Date/Time)
types.ts         → TypeScript Interfaces
```

## 🔧 เทคโนโลยี

- **Runtime**: Deno 2.0
- **Database**: Deno KV (Key-Value Store)
- **Scheduler**: Deno Cron
- **Platform**: Deno Deploy
- **API**: LINE Messaging API

## 📦 Dependencies

- `@std/http` - HTTP utilities
- `@std/dotenv` - Environment variables (local development only)

## 🚀 การติดตั้ง

ดูคู่มือการติดตั้งแบบละเอียดใน [SETUP_GUIDE.md](SETUP_GUIDE.md)

### สรุปขั้นตอน:

1. สร้าง LINE Bot ใน LINE Developers Console
2. สมัครบัญชี Deno Deploy (ฟรี)
3. Deploy โปรเจคนี้ไปยัง Deno Deploy
4. ตั้งค่า Environment Variables
5. ตั้งค่า Webhook URL ใน LINE Developers Console
6. ทดสอบการใช้งาน

## 💻 Local Development

```bash
# 1. Clone โปรเจค
cd line-secretary-bot-deno

# 2. สร้างไฟล์ .env
cp .env.example .env

# 3. ใส่ LINE Credentials ในไฟล์ .env
LINE_CHANNEL_ACCESS_TOKEN=your_token_here
LINE_CHANNEL_SECRET=your_secret_here

# 4. รันบน Local
deno task start
```

Server จะรันที่ `http://localhost:8000`

## 📚 เอกสารเพิ่มเติม

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - คู่มือติดตั้งแบบละเอียด
- [DEPLOYMENT.md](DEPLOYMENT.md) - คู่มือ Deploy บน Deno Deploy

## 🆓 ค่าใช้จ่าย

- LINE Messaging API: **ฟรี** (Reply API + Push API 500 ข้อความ/เดือน)
- Deno Deploy: **ฟรี** (100,000 requests/วัน)
- Deno KV: **ฟรี** (included ใน Deno Deploy)
- **ไม่ต้องผูกบัตรเครดิต**

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

## 🙏 Credits

Built with ❤️ using Deno and LINE Messaging API
