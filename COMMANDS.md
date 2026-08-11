# 🎯 คำสั่งที่ต้องรัน (คัดลอกไปวางได้เลย!)

## 📋 ขั้นตอนที่ 2: Push โค้ดขึ้น GitHub

**หลังจากสร้าง GitHub Repository แล้ว รันคำสั่งนี้:**

```powershell
# เข้าไปในโฟลเดอร์โปรเจค
cd C:\Users\Zen\Desktop\line-secretary-bot-deno

# เชื่อมต่อกับ GitHub (เปลี่ยน YOUR_USERNAME เป็นชื่อ GitHub ของคุณ!)
git remote add origin https://github.com/YOUR_USERNAME/line-secretary-bot.git

# เปลี่ยน branch เป็น main
git branch -M main

# Push โค้ดขึ้น GitHub
git push -u origin main
```

**⚠️ อย่าลืม:** เปลี่ยน `YOUR_USERNAME` เป็นชื่อ GitHub ของคุณจริงๆ!

---

## 💡 ตัวอย่าง:

ถ้าชื่อ GitHub ของคุณคือ `zenstudent`:

```powershell
cd C:\Users\Zen\Desktop\line-secretary-bot-deno
git remote add origin https://github.com/zenstudent/line-secretary-bot.git
git branch -M main
git push -u origin main
```

---

## 🔑 ถ้า Git ขอ Login:

Git อาจขอ Username และ Password:

1. **Username**: ใส่ชื่อ GitHub ของคุณ
2. **Password**: **ไม่ใช่รหัสผ่าน!** ต้องใช้ **Personal Access Token**

### วิธีสร้าง Personal Access Token:

1. ไปที่ https://github.com/settings/tokens
2. กด **"Generate new token"** → เลือก **"Generate new token (classic)"**
3. กรอก:
   - **Note**: `Deno Deploy Bot`
   - **Expiration**: `90 days` (หรือเลือกตามต้องการ)
   - **Scopes**: เลือก **`repo`** (ติ๊กทั้ง repo)
4. กด **"Generate token"**
5. **คัดลอก Token ที่ได้** (จะเห็นครั้งเดียว!)
6. วาง Token นี้แทน Password ตอน Git push

---

## ✅ เมื่อ Push สำเร็จ:

คุณจะเห็นข้อความประมาณนี้:

```
Enumerating objects: 18, done.
Counting objects: 100% (18/18), done.
Delta compression using up to 8 threads
Compressing objects: 100% (17/17), done.
Writing objects: 100% (18/18), 25.46 KiB | 3.64 MiB/s, done.
Total 18 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/YOUR_USERNAME/line-secretary-bot.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

**✅ สำเร็จ!** ไปทำขั้นตอนที่ 3 ต่อได้เลย (Deploy บน Deno Deploy)

---

## 🐛 ถ้ามีปัญหา:

### ปัญหา 1: "remote origin already exists"

```powershell
# ลบ remote เดิมก่อน
git remote remove origin

# เพิ่มใหม่
git remote add origin https://github.com/YOUR_USERNAME/line-secretary-bot.git
git push -u origin main
```

### ปัญหา 2: "Permission denied"

- ตรวจสอบว่าใช้ Personal Access Token (ไม่ใช่รหัสผ่าน)
- ตรวจสอบว่า Token มี scope `repo`

### ปัญหา 3: "Repository not found"

- ตรวจสอบชื่อ Repository ใน GitHub ว่าเป็น `line-secretary-bot`
- ตรวจสอบ Username ว่าถูกต้อง

---

**ขั้นตอนถัดไป:** อ่านไฟล์ `TODO_BY_USER.md` เพื่อดูขั้นตอนที่ 3 (Deploy บน Deno Deploy)
