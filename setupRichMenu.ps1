# ใช้ LINE Developers Console ตั้งค่า Rich Menu (ง่ายที่สุด!)

Write-Host "🎨 กำลังเปิด LINE Developers Console..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 ทำตามขั้นตอนนี้:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. เปิด Browser แล้วไปที่:" -ForegroundColor White
Write-Host "   https://developers.line.biz/console/" -ForegroundColor Green
Write-Host ""
Write-Host "2. เข้า Channel ของคุณ" -ForegroundColor White
Write-Host ""
Write-Host "3. ไปแท็บ 'Messaging API'" -ForegroundColor White
Write-Host ""
Write-Host "4. เลื่อนลงหา 'Rich menus' → กด 'Create'" -ForegroundColor White
Write-Host ""
Write-Host "5. กรอก:" -ForegroundColor White
Write-Host "   Title: Secretary Bot Menu" -ForegroundColor Gray
Write-Host "   Chat bar text: เมนู" -ForegroundColor Gray
Write-Host "   Selected by default: ON" -ForegroundColor Gray
Write-Host ""
Write-Host "6. กด 'Choose template' → เลือก '2x2 grid'" -ForegroundColor White
Write-Host ""
Write-Host "7. ตั้งค่าแต่ละช่อง:" -ForegroundColor White
Write-Host ""
Write-Host "   ช่อง 1 (บนซ้าย):" -ForegroundColor Yellow
Write-Host "   - Action type: Postback" -ForegroundColor Gray
Write-Host "   - Postback data: action=add_task" -ForegroundColor Gray
Write-Host "   - Text to display: ➕ เพิ่มงาน" -ForegroundColor Gray
Write-Host ""
Write-Host "   ช่อง 2 (บนขวา):" -ForegroundColor Cyan
Write-Host "   - Action type: Postback" -ForegroundColor Gray
Write-Host "   - Postback data: action=view_today" -ForegroundColor Gray
Write-Host "   - Text to display: 📋 ดูงานวันนี้" -ForegroundColor Gray
Write-Host ""
Write-Host "   ช่อง 3 (ล่างซ้าย):" -ForegroundColor Green
Write-Host "   - Action type: Postback" -ForegroundColor Gray
Write-Host "   - Postback data: action=view_all" -ForegroundColor Gray
Write-Host "   - Text to display: 📅 งานทั้งหมด" -ForegroundColor Gray
Write-Host ""
Write-Host "   ช่อง 4 (ล่างขวา):" -ForegroundColor Magenta
Write-Host "   - Action type: Message" -ForegroundColor Gray
Write-Host "   - Text: ช่วยเหลือ" -ForegroundColor Gray
Write-Host ""
Write-Host "8. อัปโหลดรูป:" -ForegroundColor White
Write-Host "   - เปิดไฟล์ richmenu.html ในโฟลเดอร์นี้" -ForegroundColor Gray
Write-Host "   - ดาวน์โหลดรูป richmenu.png" -ForegroundColor Gray
Write-Host "   - อัปโหลดในหน้า Rich Menu" -ForegroundColor Gray
Write-Host ""
Write-Host "9. กด 'Save'" -ForegroundColor White
Write-Host ""
Write-Host "✅ เสร็จแล้ว! Rich Menu จะปรากฏในแชทบอททันที!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 กด Enter เพื่อเปิด Browser..." -ForegroundColor Yellow
Read-Host

Start-Process "https://developers.line.biz/console/"
